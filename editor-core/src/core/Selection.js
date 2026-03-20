export class Selection {
  constructor(editorEl) {
    this.editorEl = editorEl;
    this.activeMarks = new Set();
    this.activeBlock = null;
  }

  update() {
    this.activeMarks = this._getActiveMarks();
    this.activeBlock = this._getActiveBlock();
  }

  _getActiveMarks() {
    const marks = new Set();
    const commands = ['bold', 'italic', 'underline', 'strikeThrough'];
    for (const cmd of commands) {
      try {
        if (document.queryCommandState(cmd)) {
          marks.add(cmd.toLowerCase());
        }
      } catch (_) {
        // ignore
      }
    }
    return marks;
  }

  _getActiveBlock() {
    try {
      const val = document.queryCommandValue('formatBlock');
      if (val) return val.toLowerCase();
    } catch (_) {
      // ignore
    }
    // Walk up from anchor node
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return null;
    let node = sel.anchorNode;
    const blockTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'li', 'div'];
    while (node && node !== this.editorEl) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (blockTags.includes(tag)) return tag;
      }
      node = node.parentNode;
    }
    return null;
  }

  getActiveMarks() {
    return this.activeMarks;
  }

  getActiveBlock() {
    return this.activeBlock;
  }

  save() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0).cloneRange();
  }

  restore(range) {
    if (!range) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
