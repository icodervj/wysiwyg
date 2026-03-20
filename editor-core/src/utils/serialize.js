export function jsonToHTML(doc) {
  if (!doc || !doc.children) return '';
  return doc.children.map(nodeToHTML).join('');
}

function nodeToHTML(node) {
  switch (node.type) {
    case 'paragraph':
      return `<p>${childrenToHTML(node.children)}</p>`;
    case 'heading':
      return `<h${node.level}>${childrenToHTML(node.children)}</h${node.level}>`;
    case 'bulletList':
      return `<ul>${childrenToHTML(node.children)}</ul>`;
    case 'orderedList':
      return `<ol>${childrenToHTML(node.children)}</ol>`;
    case 'listItem':
      return `<li>${childrenToHTML(node.children)}</li>`;
    case 'blockquote':
      return `<blockquote>${childrenToHTML(node.children)}</blockquote>`;
    case 'codeBlock': {
      const lang = node.language ? ` class="language-${node.language}"` : '';
      return `<pre><code${lang}>${childrenToHTML(node.children)}</code></pre>`;
    }
    case 'image':
      return `<img src="${escapeAttr(node.src)}" alt="${escapeAttr(node.alt || '')}" />`;
    case 'horizontalRule':
      return '<hr />';
    case 'link':
      return `<a href="${escapeAttr(node.href)}">${childrenToHTML(node.children)}</a>`;
    case 'text':
      return textToHTML(node);
    default:
      return '';
  }
}

function childrenToHTML(children = []) {
  return children.map(nodeToHTML).join('');
}

function textToHTML(node) {
  let text = escapeHTML(node.text || '');
  const marks = node.marks || [];
  if (marks.includes('bold')) text = `<strong>${text}</strong>`;
  if (marks.includes('italic')) text = `<em>${text}</em>`;
  if (marks.includes('underline')) text = `<u>${text}</u>`;
  if (marks.includes('strikethrough')) text = `<s>${text}</s>`;
  if (marks.includes('code')) text = `<code>${text}</code>`;
  return text;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function htmlToJSON(html) {
  if (typeof DOMParser === 'undefined') return { type: 'doc', children: [] };
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return domToJSON(doc.body);
}

export function domToJSON(el) {
  const children = [];
  for (const child of el.childNodes) {
    const node = domNodeToJSON(child);
    if (node) children.push(node);
  }
  return { type: 'doc', children };
}

function domNodeToJSON(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (!text) return null;
    return { type: 'text', text, marks: [] };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.tagName.toLowerCase();

  switch (tag) {
    case 'p':
      return { type: 'paragraph', children: childrenToJSON(node) };
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
      return { type: 'heading', level: parseInt(tag[1]), children: childrenToJSON(node) };
    case 'ul':
      return { type: 'bulletList', children: childrenToJSON(node) };
    case 'ol':
      return { type: 'orderedList', children: childrenToJSON(node) };
    case 'li':
      return { type: 'listItem', children: childrenToJSON(node) };
    case 'blockquote':
      return { type: 'blockquote', children: childrenToJSON(node) };
    case 'pre': {
      const codeEl = node.querySelector('code');
      const lang = codeEl ? (codeEl.className.match(/language-(\w+)/) || [])[1] : '';
      return { type: 'codeBlock', language: lang || '', children: childrenToJSON(codeEl || node) };
    }
    case 'img':
      return { type: 'image', src: node.getAttribute('src') || '', alt: node.getAttribute('alt') || '' };
    case 'hr':
      return { type: 'horizontalRule' };
    case 'a':
      return { type: 'link', href: node.getAttribute('href') || '', children: childrenToJSON(node) };
    case 'strong': case 'b':
      return inlineToJSON(node, 'bold');
    case 'em': case 'i':
      return inlineToJSON(node, 'italic');
    case 'u':
      return inlineToJSON(node, 'underline');
    case 's': case 'del': case 'strike':
      return inlineToJSON(node, 'strikethrough');
    case 'code': {
      const text = node.textContent;
      return { type: 'text', text, marks: ['code'] };
    }
    case 'br':
      return { type: 'text', text: '\n', marks: [] };
    default:
      return { type: 'paragraph', children: childrenToJSON(node) };
  }
}

function childrenToJSON(node) {
  const children = [];
  for (const child of node.childNodes) {
    const n = domNodeToJSON(child);
    if (n) children.push(n);
  }
  return children;
}

function inlineToJSON(node, mark) {
  const children = childrenToJSON(node);
  if (children.length === 0) {
    return { type: 'text', text: node.textContent, marks: [mark] };
  }
  // Merge mark onto text children
  const merged = children.map(child => {
    if (child.type === 'text') {
      return { ...child, marks: [...(child.marks || []), mark] };
    }
    return child;
  }).filter(Boolean);
  if (merged.length === 1) return merged[0];
  // Wrap multiple children in a pseudo-node not ideal; return first or joined
  return { type: 'text', text: node.textContent, marks: [mark] };
}

export function jsonToDOM(doc) {
  const frag = document.createDocumentFragment();
  for (const child of (doc.children || [])) {
    const el = jsonNodeToDOM(child);
    if (el) frag.appendChild(el);
  }
  return frag;
}

function jsonNodeToDOM(node) {
  switch (node.type) {
    case 'paragraph': {
      const p = document.createElement('p');
      appendChildren(p, node.children);
      return p;
    }
    case 'heading': {
      const h = document.createElement(`h${node.level}`);
      appendChildren(h, node.children);
      return h;
    }
    case 'bulletList': {
      const ul = document.createElement('ul');
      appendChildren(ul, node.children);
      return ul;
    }
    case 'orderedList': {
      const ol = document.createElement('ol');
      appendChildren(ol, node.children);
      return ol;
    }
    case 'listItem': {
      const li = document.createElement('li');
      appendChildren(li, node.children);
      return li;
    }
    case 'blockquote': {
      const bq = document.createElement('blockquote');
      appendChildren(bq, node.children);
      return bq;
    }
    case 'codeBlock': {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      if (node.language) code.className = `language-${node.language}`;
      appendChildren(code, node.children);
      pre.appendChild(code);
      return pre;
    }
    case 'image': {
      const img = document.createElement('img');
      img.src = node.src || '';
      img.alt = node.alt || '';
      return img;
    }
    case 'horizontalRule':
      return document.createElement('hr');
    case 'link': {
      const a = document.createElement('a');
      a.href = node.href || '';
      appendChildren(a, node.children);
      return a;
    }
    case 'text':
      return textToDOM(node);
    default:
      return null;
  }
}

function appendChildren(el, children = []) {
  for (const child of children) {
    const node = jsonNodeToDOM(child);
    if (node) el.appendChild(node);
  }
}

function textToDOM(node) {
  const textNode = document.createTextNode(node.text || '');
  const marks = node.marks || [];

  if (marks.includes('code')) {
    const code = document.createElement('code');
    code.appendChild(textNode);
    return code;
  }

  let current = textNode;

  if (marks.includes('bold')) {
    const strong = document.createElement('strong');
    strong.appendChild(current);
    current = strong;
  }
  if (marks.includes('italic')) {
    const em = document.createElement('em');
    em.appendChild(current);
    current = em;
  }
  if (marks.includes('underline')) {
    const u = document.createElement('u');
    u.appendChild(current);
    current = u;
  }
  if (marks.includes('strikethrough')) {
    const s = document.createElement('s');
    s.appendChild(current);
    current = s;
  }

  return current;
}
