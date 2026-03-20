# Plugin Guide

## Overview

Plugins are plain JavaScript objects. They can register commands, add toolbar buttons, and run setup code when the editor initialises.

## Minimal Plugin

```js
const myPlugin = {
  name: 'my-plugin',   // required, must be unique
  commands: {
    myAction: {
      exec(editor, options) {
        // Perform the action, e.g. using document.execCommand
        document.execCommand('bold');
      },
      isActive(editor, options) {
        // Return true when the button should appear "active"
        return document.queryCommandState('bold');
      },
      shortcut: 'ctrl+m',  // optional keyboard shortcut
    }
  },
  toolbar: [
    { command: 'myAction', label: 'My', title: 'My Action (Ctrl+M)' }
  ]
};
```

Then pass it when constructing the editor:

```js
const editor = new Editor({
  element: '#editor',
  plugins: [myPlugin],
});
```

---

## Plugin Object Shape

```ts
interface Plugin {
  name: string;                          // unique identifier

  commands?: {
    [commandName: string]: {
      exec(editor: Editor, options?: object): void;
      isActive?(editor: Editor, options?: object): boolean;
      shortcut?: string;                 // e.g. 'ctrl+m'
    }
  };

  toolbar?: ToolbarItem[];

  init?(editor: Editor): void;           // lifecycle hook
}

type ToolbarItem =
  | { type: 'separator' }
  | {
      command: string;
      label: string;    // inner HTML of the button
      title?: string;   // tooltip
      icon?: string;    // alias for label (SVG string)
      options?: object; // passed to exec() when clicked
    };
```

---

## Toolbar Separators

Insert a vertical divider between button groups:

```js
toolbar: [
  { command: 'bold',   label: '<b>B</b>', title: 'Bold' },
  { type: 'separator' },
  { command: 'heading-1', label: 'H1', title: 'Heading 1' },
]
```

---

## The `init` Hook

Use `init` for side-effects that need the editor's DOM (drag-and-drop listeners, custom overlays, etc.):

```js
const pasteWatcher = {
  name: 'paste-watcher',
  init(editor) {
    editor.editorEl.addEventListener('paste', (e) => {
      console.log('User pasted content');
    });
  }
};
```

---

## Calling `exec` Programmatically

Any registered command can be called by name:

```js
editor.exec('myAction');
editor.exec('myAction', { someOption: true });
```

---

## Full Example: Font Color Plugin

```js
const fontColorPlugin = {
  name: 'font-color',
  commands: {
    fontColor: {
      exec(editor, { color = '#e74c3c' } = {}) {
        document.execCommand('foreColor', false, color);
      },
      isActive() { return false; }
    }
  },
  toolbar: [
    { command: 'fontColor', label: '🔴', title: 'Red',   options: { color: '#e74c3c' } },
    { command: 'fontColor', label: '🔵', title: 'Blue',  options: { color: '#3498db' } },
    { command: 'fontColor', label: '🟢', title: 'Green', options: { color: '#2ecc71' } },
  ]
};
```

---

## Accessing the Editor Inside a Plugin

The `exec` and `isActive` functions always receive the `editor` instance as their first argument. You can access:

| Property | Description |
|---|---|
| `editor.editorEl` | The contenteditable `<div>` |
| `editor.toolbarEl` | The toolbar `<div>` |
| `editor.getHTML()` | Current HTML content |
| `editor.setHTML(html)` | Set HTML content |
| `editor.exec(cmd, opts)` | Execute another command |
| `editor.on(event, fn)` | Subscribe to editor events |
| `editor.emitter` | Direct access to the EventEmitter |
