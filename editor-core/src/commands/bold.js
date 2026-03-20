export default {
  name: 'bold',
  exec(editor) { document.execCommand('bold'); },
  isActive() { try { return document.queryCommandState('bold'); } catch (e) { return false; } },
  shortcut: 'ctrl+b'
};
