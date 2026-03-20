export default {
  name: 'italic',
  exec(editor) { document.execCommand('italic'); },
  isActive() { try { return document.queryCommandState('italic'); } catch (e) { return false; } },
  shortcut: 'ctrl+i'
};
