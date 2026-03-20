# Integration Guide

## Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/editor.css" />
</head>
<body>
  <div id="editor"></div>

  <script type="module">
    import { Editor } from '@wysiwyg/editor-core';
    import basicFormatting from '@wysiwyg/basic-formatting';
    import blockElements   from '@wysiwyg/block-elements';
    import linkPlugin      from '@wysiwyg/link';
    import imagePlugin     from '@wysiwyg/image';
    import codeBlockPlugin from '@wysiwyg/code-block';

    const editor = new Editor({
      element: '#editor',
      plugins: [basicFormatting, blockElements, linkPlugin, imagePlugin, codeBlockPlugin],
      placeholder: 'Start writing…',
    });

    // Read content
    const html = editor.getHTML();
    const json = editor.getJSON();

    // Set content
    editor.setHTML('<p>Hello <strong>world</strong></p>');

    // Listen for changes
    editor.on('change', ({ html }) => {
      document.getElementById('output').textContent = html;
    });

    // Execute a command programmatically
    editor.exec('bold');
    editor.exec('heading-1');

    // Undo / redo
    editor.undo();
    editor.redo();

    // Clean up
    editor.destroy();
  </script>
</body>
</html>
```

---

## React

Install the adapter:

```bash
npm install @wysiwyg/react @wysiwyg/editor-core
```

```jsx
import React, { useRef, useState } from 'react';
import WysiwygEditor from '@wysiwyg/react';
import basicFormatting from '@wysiwyg/basic-formatting';
import blockElements   from '@wysiwyg/block-elements';
import linkPlugin      from '@wysiwyg/link';

const plugins = [basicFormatting, blockElements, linkPlugin];

export default function App() {
  const [html, setHtml] = useState('<p>Hello <strong>world</strong></p>');
  const editorRef = useRef(null);

  return (
    <div>
      <WysiwygEditor
        ref={editorRef}
        value={html}
        onChange={setHtml}
        plugins={plugins}
        placeholder="Start writing…"
        style={{ border: '1px solid #ccc', borderRadius: 8 }}
      />

      <button onClick={() => editorRef.current?.exec('bold')}>
        Bold
      </button>

      <pre>{html}</pre>
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `''` | Controlled HTML content |
| `onChange` | `(html: string) => void` | — | Called on every change |
| `plugins` | `Plugin[]` | `[]` | Plugin objects |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |
| `className` | `string` | `''` | CSS class for container |
| `style` | `object` | `{}` | Inline styles for container |

### Ref Methods

```ts
editorRef.current.getHTML()         // string
editorRef.current.getJSON()         // DocNode
editorRef.current.exec(cmd, opts?)  // void
editorRef.current.undo()            // void
editorRef.current.redo()            // void
```

---

## Vue 3

Install the adapter:

```bash
npm install @wysiwyg/vue @wysiwyg/editor-core
```

```vue
<template>
  <WysiwygEditor
    v-model="content"
    :plugins="plugins"
    placeholder="Start writing…"
  />
  <pre>{{ content }}</pre>
</template>

<script setup>
import { ref } from 'vue';
import WysiwygEditor from '@wysiwyg/vue';
import basicFormatting from '@wysiwyg/basic-formatting';
import blockElements   from '@wysiwyg/block-elements';

const content = ref('<p>Hello <strong>Vue</strong></p>');
const plugins = [basicFormatting, blockElements];
</script>
```

The component supports `v-model` for two-way binding of HTML content.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | Bound HTML (`v-model`) |
| `plugins` | `Plugin[]` | `[]` | Plugin objects |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |

### Exposed Methods

Access via a template ref (`ref="editorRef"`):

```ts
editorRef.value.getHTML()
editorRef.value.getJSON()
editorRef.value.exec(cmd, opts?)
editorRef.value.undo()
editorRef.value.redo()
```

---

## Styling

The editor adds class names you can target in your CSS:

| Selector | Element |
|---|---|
| `.wysiwyg-editor` | Outer container |
| `.wysiwyg-toolbar` | Toolbar row |
| `.wysiwyg-btn` | Toolbar button |
| `.wysiwyg-btn.active` | Active/pressed toolbar button |
| `.wysiwyg-separator` | Toolbar separator |
| `.wysiwyg-content` | Editable content area |
| `.wysiwyg-content.drag-over` | Content area during drag |

See `demo/index.html` for a complete CSS theme example.
