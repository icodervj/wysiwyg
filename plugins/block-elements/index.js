export default {
  name: 'block-elements',
  commands: {
    'heading-1': {
      exec() { document.execCommand('formatBlock', false, 'h1'); },
      isActive() { try { return document.queryCommandValue('formatBlock') === 'h1'; } catch (e) { return false; } },
    },
    'heading-2': {
      exec() { document.execCommand('formatBlock', false, 'h2'); },
      isActive() { try { return document.queryCommandValue('formatBlock') === 'h2'; } catch (e) { return false; } },
    },
    'heading-3': {
      exec() { document.execCommand('formatBlock', false, 'h3'); },
      isActive() { try { return document.queryCommandValue('formatBlock') === 'h3'; } catch (e) { return false; } },
    },
    'paragraph': {
      exec() { document.execCommand('formatBlock', false, 'p'); },
      isActive() { try { return document.queryCommandValue('formatBlock') === 'p'; } catch (e) { return false; } },
    },
    'bulletList': {
      exec() { document.execCommand('insertUnorderedList'); },
      isActive() { try { return document.queryCommandState('insertUnorderedList'); } catch (e) { return false; } },
    },
    'orderedList': {
      exec() { document.execCommand('insertOrderedList'); },
      isActive() { try { return document.queryCommandState('insertOrderedList'); } catch (e) { return false; } },
    },
    'blockquote': {
      exec() { document.execCommand('formatBlock', false, 'blockquote'); },
      isActive() { try { return document.queryCommandValue('formatBlock') === 'blockquote'; } catch (e) { return false; } },
    },
  },
  toolbar: [
    { type: 'separator' },
    { command: 'heading-1', label: 'H1', title: 'Heading 1' },
    { command: 'heading-2', label: 'H2', title: 'Heading 2' },
    { command: 'heading-3', label: 'H3', title: 'Heading 3' },
    { command: 'paragraph', label: 'P', title: 'Paragraph' },
    { type: 'separator' },
    { command: 'bulletList', label: '&#8226; List', title: 'Bullet List' },
    { command: 'orderedList', label: '1. List', title: 'Ordered List' },
    { command: 'blockquote', label: '&#10077;', title: 'Blockquote' },
  ]
};
