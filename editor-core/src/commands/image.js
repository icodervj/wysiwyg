export default {
  name: 'image',
  exec(editor, { src, alt } = {}) {
    const imgSrc = src || prompt('Enter image URL:');
    if (!imgSrc) return;
    const imgAlt = alt || '';
    document.execCommand('insertHTML', false, `<img src="${imgSrc}" alt="${imgAlt}" style="max-width:100%" />`);
  },
  isActive() { return false; }
};
