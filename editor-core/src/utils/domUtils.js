export function closest(el, selector) {
  while (el && el !== document.body) {
    if (el.matches && el.matches(selector)) return el;
    el = el.parentElement;
  }
  return null;
}

export function getBlockElement(el) {
  const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE', 'DIV'];
  while (el && el !== document.body) {
    if (blockTags.includes(el.tagName)) return el;
    el = el.parentElement;
  }
  return null;
}

export function isInsideEditor(el, editorEl) {
  return editorEl.contains(el);
}

export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'className') el.className = v;
    else if (k === 'innerHTML') el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}
