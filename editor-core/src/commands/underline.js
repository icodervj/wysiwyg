export default {
  name: 'underline',
  exec(editor) { document.execCommand('underline'); },
  isActive() { try { return document.queryCommandState('underline'); } catch (e) { return false; } },
  shortcut: 'ctrl+u'
};
