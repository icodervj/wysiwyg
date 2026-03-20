export default {
  name: 'heading',
  exec(editor, { level = 1 } = {}) {
    document.execCommand('formatBlock', false, `h${level}`);
  },
  isActive(editor, { level } = {}) {
    try {
      const val = document.queryCommandValue('formatBlock');
      return level ? val === `h${level}` : /^h[1-6]$/.test(val);
    } catch (e) { return false; }
  }
};
