const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 's', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'hr',
  'sub', 'sup', 'mark'
]);

const ALLOWED_ATTRS = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height', 'title', 'style'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan'],
  'code': ['class'],
  'pre': ['class'],
  'span': ['class', 'style'],
  'div': ['class'],
  '*': ['class']
};

const DANGEROUS_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed',
  'form', 'input', 'button', 'select', 'textarea',
  'meta', 'link', 'base'
]);

export function sanitizeHTML(html) {
  if (typeof DOMParser === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}

function sanitizeNode(node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();

      if (DANGEROUS_TAGS.has(tagName)) {
        node.removeChild(child);
        continue;
      }

      if (!ALLOWED_TAGS.has(tagName)) {
        // Unwrap: replace with children
        while (child.firstChild) {
          node.insertBefore(child.firstChild, child);
        }
        node.removeChild(child);
        continue;
      }

      // Clean attributes
      const attrs = Array.from(child.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith('on')) {
          child.removeAttribute(attr.name);
          continue;
        }

        const allowed = ALLOWED_ATTRS[tagName] || [];
        const globalAllowed = ALLOWED_ATTRS['*'] || [];
        if (!allowed.includes(attrName) && !globalAllowed.includes(attrName)) {
          child.removeAttribute(attr.name);
          continue;
        }

        if (attrName === 'href' || attrName === 'src') {
          const val = attr.value.trim().toLowerCase().replace(/\s/g, '');
          const isSafeDataUri = attrName === 'src' && /^data:image\/(png|jpe?g|gif|webp|svg\+xml|avif|bmp);base64,/.test(val);
          if (
            val.startsWith('javascript:') ||
            val.startsWith('vbscript:') ||
            (val.startsWith('data:') && !isSafeDataUri)
          ) {
            child.removeAttribute(attr.name);
          }
        }
      }

      sanitizeNode(child);
    }
  }
}
