# @wysiwyg/editor-core

A modern, lightweight WYSIWYG rich-text editor built from scratch — a TinyMCE alternative with no heavy dependencies.

## Installation

```bash
# Using npm workspaces (monorepo)
npm install

# Or install the core package alone
npm install @wysiwyg/editor-core
```

## Basic Usage

```html
<div id="editor"></div>

<script type="module">
import { Editor } from '@wysiwyg/editor-core';
import basicFormatting from '@wysiwyg/basic-formatting';
import blockElements from '@wysiwyg/block-elements';

const editor = new Editor({
  element: '#editor',
  plugins: [basicFormatting, blockElements],
  placeholder: 'Start writing…',
});

editor.on('change', ({ html }) => {
  console.log('Content:', html);
});
</script>
```

## Plugins

| Package | Description |
|---|---|
| `@wysiwyg/basic-formatting` | Bold, italic, underline, strikethrough |
| `@wysiwyg/block-elements` | Headings, paragraph, lists, blockquote |
| `@wysiwyg/link` | Insert and remove hyperlinks |
| `@wysiwyg/image` | Insert images, drag-and-drop support |
| `@wysiwyg/code-block` | Code blocks and inline code |

## API Reference

### `new Editor(config)`

| Option | Type | Default | Description |
|---|---|---|---|
| `element` | `string \| HTMLElement` | required | Container element or selector |
| `plugins` | `Plugin[]` | `[]` | Array of plugin objects |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |

### Instance Methods

| Method | Returns | Description |
|---|---|---|
| `getHTML()` | `string` | Get current content as HTML |
| `setHTML(html)` | `void` | Set content from HTML string (sanitized) |
| `getJSON()` | `DocNode` | Get content as JSON document model |
| `setJSON(json)` | `void` | Set content from JSON document model |
| `exec(command, options?)` | `void` | Execute a registered command |
| `undo()` | `void` | Undo last change |
| `redo()` | `void` | Redo last undone change |
| `on(event, handler)` | `void` | Subscribe to an event |
| `off(event, handler)` | `void` | Unsubscribe from an event |
| `destroy()` | `void` | Clean up and remove editor from DOM |

### Events

| Event | Payload | Description |
|---|---|---|
| `change` | `{ html: string }` | Fired when content changes |
| `selectionchange` | `Selection` | Fired when cursor/selection changes |
| `focus` | — | Editor gained focus |
| `blur` | — | Editor lost focus |

### Built-in Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+K` | Insert link (via `@wysiwyg/link`) |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |

## Framework Adapters

- **React**: `@wysiwyg/react` — `<WysiwygEditor>` component
- **Vue 3**: `@wysiwyg/vue` — `<WysiwygEditor>` component

See [integration.md](./integration.md) for full examples.

## Demo

Open `demo/index.html` in a browser (no build step needed):

```bash
npm run demo
# or just open demo/index.html directly
```

## Running Tests

```bash
npm install
npm test
```
