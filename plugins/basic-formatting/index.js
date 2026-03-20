export default {
  name: 'basic-formatting',
  commands: {
    bold: {
      exec(editor) { document.execCommand('bold'); },
      isActive() { try { return document.queryCommandState('bold'); } catch (e) { return false; } },
      shortcut: 'ctrl+b',
    },
    italic: {
      exec(editor) { document.execCommand('italic'); },
      isActive() { try { return document.queryCommandState('italic'); } catch (e) { return false; } },
      shortcut: 'ctrl+i',
    },
    underline: {
      exec(editor) { document.execCommand('underline'); },
      isActive() { try { return document.queryCommandState('underline'); } catch (e) { return false; } },
      shortcut: 'ctrl+u',
    },
    strikethrough: {
      exec(editor) { document.execCommand('strikeThrough'); },
      isActive() { try { return document.queryCommandState('strikeThrough'); } catch (e) { return false; } },
    },
  },
  toolbar: [
    { command: 'bold', label: '<b>B</b>', title: 'Bold (Ctrl+B)' },
    { command: 'italic', label: '<i>I</i>', title: 'Italic (Ctrl+I)' },
    { command: 'underline', label: '<u>U</u>', title: 'Underline (Ctrl+U)' },
    { command: 'strikethrough', label: '<s>S</s>', title: 'Strikethrough' },
  ]
};
