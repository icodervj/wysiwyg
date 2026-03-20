# Architecture

## Overview

The editor is structured as a monorepo with these layers:

```
editor-core/       — the engine (no framework dependencies)
plugins/           — feature plugins (each is a small object)
framework-adapters — thin wrappers for React and Vue
tests/             — unit tests (vitest + jsdom)
demo/              — self-contained HTML demo
```

---

## Document Model

Content is stored internally as a JSON tree. The root node is always `type: 'doc'`. Each child is a block node; blocks can contain inline nodes.

```js
{
  type: 'doc',
  children: [
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Hello ', marks: [] },
        { type: 'text', text: 'world',  marks: ['bold', 'italic'] }
      ]
    },
    { type: 'heading', level: 1, children: [...] },
    { type: 'bulletList', children: [
      { type: 'listItem', children: [
        { type: 'paragraph', children: [...] }
      ]}
    ]},
    { type: 'image', src: 'https://...', alt: '...' },
    { type: 'codeBlock', language: 'js', children: [...] },
    { type: 'blockquote', children: [...] },
    { type: 'horizontalRule' },
    { type: 'link', href: 'https://...', children: [...] }
  ]
}
```

### Block node types
`doc`, `paragraph`, `heading` (with `level`), `bulletList`, `orderedList`, `listItem`, `blockquote`, `codeBlock` (with `language`), `image`, `horizontalRule`

### Inline node types
`text` (with `marks` array), `link`

### Marks
`bold`, `italic`, `underline`, `strikethrough`, `code`

The `Document` class (`src/core/Document.js`) converts between this JSON model and HTML/DOM:

- `fromHTML(html)` — parse HTML string → JSON
- `toHTML()` — JSON → HTML string
- `fromDOM(el)` — DOM element → JSON
- `toDOM()` — JSON → DOM fragment

Serialization is implemented in `src/utils/serialize.js`.

---

## Command System

Each command is a plain object:

```js
{
  name: 'bold',
  exec(editor, options) { /* mutate editor content */ },
  isActive(editor, options) { /* return true/false for toolbar active state */ },
  shortcut: 'ctrl+b'   // optional
}
```

Commands are registered via `editor.registerCommand(name, def)` and executed via `editor.exec(name, options)`.

The `CommandRegistry` class (`src/commands/index.js`) stores commands by name and provides `exec` / `isActive` helpers.

All built-in commands use `document.execCommand` on the contenteditable surface. This is the same approach used by most editor frameworks and works reliably in all modern browsers.

---

## Plugin System

A plugin is a plain object that describes commands and toolbar buttons:

```js
{
  name: 'my-plugin',
  commands: {
    myCommand: {
      exec(editor, opts) { ... },
      isActive(editor, opts) { ... },
      shortcut: 'ctrl+m'
    }
  },
  toolbar: [
    { command: 'myCommand', label: 'My Cmd', title: 'My Command' },
    { type: 'separator' }
  ],
  init(editor) {
    // optional lifecycle hook — runs once when plugin is registered
  }
}
```

The `PluginManager` (`src/plugins/PluginManager.js`):
1. Iterates each plugin's `commands` and calls `editor.registerCommand`
2. Collects `toolbar` button descriptors in order
3. Calls `plugin.init(editor)` if present

The toolbar is built from all registered button descriptors.

---

## Event System

`EventEmitter` (`src/core/EventEmitter.js`) is a minimal pub/sub:

```js
emitter.on('change', handler);
emitter.emit('change', { html });
emitter.off('change', handler);
```

The `Editor` class exposes `on` / `off` as top-level methods.

---

## History (Undo / Redo)

`History` (`src/core/History.js`) maintains an array of HTML snapshots:

- **Max entries**: 100 (oldest are evicted)
- **Debounced push**: rapid keystrokes are batched (300 ms) — only one snapshot is stored per typing burst
- **`pushImmediate`**: used for programmatic changes (setHTML, setJSON) that should always produce a snapshot
- **`undo()`**: decrements the index and returns the previous state string
- **`redo()`**: increments the index and returns the next state string

The editor restores state by assigning directly to `editorEl.innerHTML`.

---

## Security

All pasted and programmatically-set HTML passes through `sanitizeHTML` (`src/utils/sanitize.js`):

- Removes dangerous tags (`script`, `style`, `iframe`, `object`, `embed`, forms, etc.)
- Removes all `on*` event handler attributes
- Strips `javascript:`, `vbscript:`, and `data:text` URLs from `href` / `src`
- Unwraps unknown tags (replaces with their children) instead of dropping content
- Uses the browser's own `DOMParser` for reliable parsing
