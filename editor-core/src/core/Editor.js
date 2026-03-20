import { EventEmitter } from './EventEmitter.js';
import { Document } from './Document.js';
import { Selection } from './Selection.js';
import { History } from './History.js';
import { PluginManager } from '../plugins/PluginManager.js';
import { sanitizeHTML } from '../utils/sanitize.js';

export class Editor {
  constructor({ element, plugins = [], placeholder = 'Start writing...' }) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;
    this.plugins = plugins;
    this.placeholder = placeholder;
    this.emitter = new EventEmitter();
    this.document = new Document();
    this.history = new History();
    this.pluginManager = new PluginManager(this);

    this._commands = new Map();
    this._shortcuts = new Map();

    this._init();
  }

  _init() {
    this.container.classList.add('wysiwyg-editor');

    this.toolbarEl = document.createElement('div');
    this.toolbarEl.className = 'wysiwyg-toolbar';
    this.container.appendChild(this.toolbarEl);

    this.editorEl = document.createElement('div');
    this.editorEl.className = 'wysiwyg-content';
    this.editorEl.contentEditable = 'true';
    this.editorEl.setAttribute('data-placeholder', this.placeholder);
    this.container.appendChild(this.editorEl);

    this.selection = new Selection(this.editorEl);

    for (const plugin of this.plugins) {
      this.pluginManager.register(plugin);
    }

    this._buildToolbar();
    this._bindEvents();
    this.history.pushImmediate(this.editorEl.innerHTML);
  }

  _buildToolbar() {
    this.toolbarEl.innerHTML = '';
    const buttons = this.pluginManager.getToolbarButtons();

    for (const btn of buttons) {
      if (btn.type === 'separator') {
        const sep = document.createElement('span');
        sep.className = 'wysiwyg-separator';
        this.toolbarEl.appendChild(sep);
        continue;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'wysiwyg-btn';
      button.setAttribute('data-command', btn.command);
      button.title = btn.title || btn.label;
      button.innerHTML = btn.icon || btn.label;
      if (btn.options) {
        button.setAttribute('data-options', JSON.stringify(btn.options));
      }
      button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const opts = btn.options || {};
        this.exec(btn.command, opts);
      });
      this.toolbarEl.appendChild(button);
    }
  }

  _updateToolbar() {
    const buttons = this.toolbarEl.querySelectorAll('[data-command]');
    buttons.forEach(btn => {
      const cmdName = btn.getAttribute('data-command');
      const cmd = this._commands.get(cmdName);
      if (cmd && cmd.isActive) {
        const active = cmd.isActive(this);
        btn.classList.toggle('active', active);
      }
    });
  }

  _bindEvents() {
    this.editorEl.addEventListener('input', () => {
      this.history.push(this.editorEl.innerHTML);
      this.emitter.emit('change', { html: this.getHTML() });
    });

    this.editorEl.addEventListener('keydown', (e) => {
      this._handleKeydown(e);
    });

    this.editorEl.addEventListener('paste', (e) => {
      this._handlePaste(e);
    });

    this.editorEl.addEventListener('focus', () => {
      this.emitter.emit('focus');
    });

    this.editorEl.addEventListener('blur', () => {
      this.emitter.emit('blur');
    });

    document.addEventListener('selectionchange', () => {
      if (document.activeElement === this.editorEl || this.editorEl.contains(document.activeElement)) {
        this.selection.update();
        this._updateToolbar();
        this.emitter.emit('selectionchange', this.selection);
      }
    });
  }

  _handleKeydown(e) {
    const key = (e.ctrlKey || e.metaKey ? 'ctrl+' : '') +
                (e.shiftKey ? 'shift+' : '') +
                e.key.toLowerCase();

    if (this._shortcuts.has(key)) {
      e.preventDefault();
      const cmdName = this._shortcuts.get(key);
      this.exec(cmdName);
      return;
    }

    // Built-in shortcuts
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          this.undo();
          break;
        case 'y':
          e.preventDefault();
          this.redo();
          break;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      this.redo();
    }
  }

  _handlePaste(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    let html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    if (html) {
      html = sanitizeHTML(html);
      document.execCommand('insertHTML', false, html);
    } else if (text) {
      document.execCommand('insertText', false, text);
    }

    this.history.push(this.editorEl.innerHTML);
    this.emitter.emit('change', { html: this.getHTML() });
  }

  registerCommand(name, commandDef) {
    this._commands.set(name, commandDef);
    if (commandDef.shortcut) {
      const key = commandDef.shortcut.toLowerCase().replace('cmd', 'ctrl');
      this._shortcuts.set(key, name);
    }
  }

  exec(command, options = {}) {
    const cmd = this._commands.get(command);
    if (cmd) {
      this.editorEl.focus();
      cmd.exec(this, options);
      this.history.push(this.editorEl.innerHTML);
      this._updateToolbar();
      this.emitter.emit('change', { html: this.getHTML() });
    }
  }

  getHTML() {
    return this.editorEl.innerHTML;
  }

  setHTML(html) {
    this.editorEl.innerHTML = sanitizeHTML(html);
    this.history.pushImmediate(this.editorEl.innerHTML);
  }

  getJSON() {
    return this.document.fromDOM(this.editorEl);
  }

  setJSON(json) {
    this.document.data = json;
    this.editorEl.innerHTML = '';
    const nodes = this.document.toDOM();
    for (const node of nodes) {
      this.editorEl.appendChild(node);
    }
    this.history.pushImmediate(this.editorEl.innerHTML);
  }

  undo() {
    const state = this.history.undo();
    if (state !== null) {
      this.editorEl.innerHTML = state;
      this.emitter.emit('change', { html: this.getHTML() });
    }
  }

  redo() {
    const state = this.history.redo();
    if (state !== null) {
      this.editorEl.innerHTML = state;
      this.emitter.emit('change', { html: this.getHTML() });
    }
  }

  on(event, handler) { this.emitter.on(event, handler); }
  off(event, handler) { this.emitter.off(event, handler); }

  destroy() {
    this.container.innerHTML = '';
    this.container.classList.remove('wysiwyg-editor');
  }
}
