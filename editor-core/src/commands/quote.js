export default {
  name: 'blockquote',
  exec(editor) {
    document.execCommand('formatBlock', false, 'blockquote');
  },
  isActive() {
    try {
      return document.queryCommandValue('formatBlock') === 'blockquote';
    } catch (e) { return false; }
  }
};
