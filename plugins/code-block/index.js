export default {
  name: 'code-block',
  commands: {
    codeBlock: {
      exec(editor) {
        document.execCommand('formatBlock', false, 'pre');
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          let node = sel.anchorNode;
          while (node && node.nodeName !== 'PRE') node = node.parentNode;
          if (node && node.nodeName === 'PRE' && !node.querySelector('code')) {
            const code = document.createElement('code');
            code.className = 'language-js';
            code.innerHTML = node.innerHTML;
            node.innerHTML = '';
            node.appendChild(code);
          }
        }
      },
      isActive() {
        try { return document.queryCommandValue('formatBlock') === 'pre'; } catch (e) { return false; }
      },
    },
    inlineCode: {
      exec() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString();
        document.execCommand('insertHTML', false, `<code>${text}</code>`);
      },
      isActive() {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return false;
        let node = sel.anchorNode;
        while (node && node !== document.body) {
          if (node.nodeName === 'CODE') return true;
          node = node.parentNode;
        }
        return false;
      },
    }
  },
  toolbar: [
    { type: 'separator' },
    { command: 'codeBlock', label: '&lt;/&gt;', title: 'Code Block' },
    { command: 'inlineCode', label: '`code`', title: 'Inline Code' },
  ]
};
