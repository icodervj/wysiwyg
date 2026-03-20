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
          // Decode percent-encoding and collapse whitespace to prevent bypass tricks
          let val = attr.value.trim();
          try { val = decodeURIComponent(val); } catch (_) { /* keep original if malformed */ }
          val = val.replace(/[\s\u0000-\u001f\u007f]/g, '').toLowerCase();

          // Allow base64 image data URIs (used by drag-drop image uploads).
          // Validate full format: data:<safe-mime>;base64,<base64-chars>
          const SAFE_DATA_URI_RE =
            /^data:image\/(png|jpe?g|gif|webp|svg\+xml|avif|bmp);base64,[a-z0-9+/]+=*$/i;
          const isSafeDataUri = attrName === 'src' && SAFE_DATA_URI_RE.test(attr.value.trim());

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
