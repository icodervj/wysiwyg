export class PluginManager {
  constructor(editor) {
    this.editor = editor;
    this.plugins = new Map();
    this._toolbarButtons = [];
  }

  register(plugin) {
    if (!plugin || !plugin.name) return;
    this.plugins.set(plugin.name, plugin);

    // Register commands
    if (plugin.commands) {
      for (const [cmdName, cmdDef] of Object.entries(plugin.commands)) {
        this.editor.registerCommand(cmdName, {
          ...cmdDef,
          exec: (editor, opts) => cmdDef.exec(editor, opts),
          isActive: (editor, opts) => cmdDef.isActive ? cmdDef.isActive(editor, opts) : false,
        });

        // Register shortcut
        if (cmdDef.shortcut) {
          const key = cmdDef.shortcut.toLowerCase().replace('cmd', 'ctrl');
          this.editor._shortcuts.set(key, cmdName);
        }
      }
    }

    // Collect toolbar buttons
    if (plugin.toolbar) {
      for (const btn of plugin.toolbar) {
        this._toolbarButtons.push(btn);
      }
    }

    // Run plugin init
    if (plugin.init) {
      plugin.init(this.editor);
    }
  }

  getToolbarButtons() {
    return this._toolbarButtons;
  }
}
