export default {
  name: 'list',
  exec(editor, { ordered = false } = {}) {
    if (ordered) {
      document.execCommand('insertOrderedList');
    } else {
      document.execCommand('insertUnorderedList');
    }
  },
  isActive(editor, { ordered = false } = {}) {
    try {
      if (ordered) return document.queryCommandState('insertOrderedList');
      return document.queryCommandState('insertUnorderedList');
    } catch (e) { return false; }
  }
};
