export default {
  name: 'codeBlock',
  exec(editor) {
    document.execCommand('formatBlock', false, 'pre');
  },
  isActive() {
    try {
      return document.queryCommandValue('formatBlock') === 'pre';
    } catch (e) { return false; }
  }
};
