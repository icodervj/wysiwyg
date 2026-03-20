function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default {
  name: 'image',
  commands: {
    image: {
      exec(editor, { src, alt } = {}) {
        const imgSrc = src || prompt('Enter image URL:');
        if (!imgSrc) return;
        const imgAlt = alt || '';
        document.execCommand('insertHTML', false, `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(imgAlt)}" style="max-width:100%" />`);
      },
      isActive() { return false; },
    }
  },
  toolbar: [
    { type: 'separator' },
    { command: 'image', label: '&#128444;', title: 'Insert Image' },
  ],
  init(editor) {
    editor.editorEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      editor.editorEl.classList.add('drag-over');
    });
    editor.editorEl.addEventListener('dragleave', () => {
      editor.editorEl.classList.remove('drag-over');
    });
    editor.editorEl.addEventListener('drop', (e) => {
      e.preventDefault();
      editor.editorEl.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            editor.editorEl.focus();
            document.execCommand('insertHTML', false, `<img src="${escapeAttr(evt.target.result)}" alt="${escapeAttr(file.name)}" style="max-width:100%" />`);
            editor.emitter.emit('change', { html: editor.getHTML() });
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }
};
