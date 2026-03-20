export default {
  name: 'link',
  exec(editor, { url, text } = {}) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      const linkUrl = url || prompt('Enter URL:');
      if (!linkUrl) return;
      const linkText = text || linkUrl;
      document.execCommand('insertHTML', false, `<a href="${linkUrl}">${linkText}</a>`);
    } else {
      const linkUrl = url || prompt('Enter URL:');
      if (!linkUrl) return;
      document.execCommand('createLink', false, linkUrl);
    }
  },
  isActive() {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return false;
    let node = sel.anchorNode;
    while (node) {
      if (node.nodeName === 'A') return true;
      node = node.parentNode;
    }
    return false;
  }
};
