export default {
  name: 'horizontalRule',
  exec(editor) {
    document.execCommand('insertHorizontalRule');
  },
  isActive() { return false; }
};
