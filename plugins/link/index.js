export default {
  name: 'link',
  commands: {
    link: {
      exec(editor, { url } = {}) {
        const sel = window.getSelection();
        const linkUrl = url || prompt('Enter URL (e.g. https://example.com):');
        if (!linkUrl) return;

        if (
          !linkUrl.startsWith('http://') &&
          !linkUrl.startsWith('https://') &&
          !linkUrl.startsWith('/') &&
          !linkUrl.startsWith('#')
        ) {
          alert('Please enter a valid URL starting with http://, https://, /, or #');
          return;
        }

        if (sel && !sel.isCollapsed) {
          document.execCommand('createLink', false, linkUrl);
          const links = editor.editorEl.querySelectorAll('a:not([target])');
          links.forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
        } else {
          document.execCommand('insertHTML', false, `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`);
        }
      },
      isActive() {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return false;
        let node = sel.anchorNode;
        while (node && node !== document.body) {
          if (node.nodeName === 'A') return true;
          node = node.parentNode;
        }
        return false;
      },
      shortcut: 'ctrl+k',
    },
    unlink: {
      exec() { document.execCommand('unlink'); },
      isActive() { return false; },
    }
  },
  toolbar: [
    { command: 'link', label: '&#128279;', title: 'Insert Link (Ctrl+K)' },
    { command: 'unlink', label: '&#9939;', title: 'Remove Link' },
  ]
};
