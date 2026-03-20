import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up a browser-like environment
let dom;
beforeAll(() => {
  dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.Node = dom.window.Node;
  global.DOMParser = dom.window.DOMParser;
});

describe('htmlToJSON', () => {
  it('parses a paragraph', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<p>Hello</p>');
    expect(result.type).toBe('doc');
    expect(result.children[0].type).toBe('paragraph');
    expect(result.children[0].children[0].text).toBe('Hello');
  });

  it('parses headings with correct level', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<h1>Title</h1><h2>Subtitle</h2>');
    expect(result.children[0].type).toBe('heading');
    expect(result.children[0].level).toBe(1);
    expect(result.children[1].level).toBe(2);
  });

  it('parses bold text', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<p><strong>Bold</strong></p>');
    const para = result.children[0];
    expect(para.children[0].marks).toContain('bold');
    expect(para.children[0].text).toBe('Bold');
  });

  it('parses italic text', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<p><em>Italic</em></p>');
    const para = result.children[0];
    expect(para.children[0].marks).toContain('italic');
  });

  it('parses unordered list', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<ul><li>Item 1</li><li>Item 2</li></ul>');
    expect(result.children[0].type).toBe('bulletList');
    expect(result.children[0].children[0].type).toBe('listItem');
  });

  it('parses ordered list', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<ol><li>First</li></ol>');
    expect(result.children[0].type).toBe('orderedList');
  });

  it('parses links', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<p><a href="https://example.com">Click</a></p>');
    const para = result.children[0];
    expect(para.children[0].type).toBe('link');
    expect(para.children[0].href).toBe('https://example.com');
  });

  it('parses images', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<img src="https://example.com/img.png" alt="Test" />');
    expect(result.children[0].type).toBe('image');
    expect(result.children[0].src).toBe('https://example.com/img.png');
    expect(result.children[0].alt).toBe('Test');
  });

  it('parses blockquote', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<blockquote><p>Quote</p></blockquote>');
    expect(result.children[0].type).toBe('blockquote');
  });

  it('parses code blocks', async () => {
    const { htmlToJSON } = await import('../editor-core/src/utils/serialize.js');
    const result = htmlToJSON('<pre><code class="language-js">const x = 1;</code></pre>');
    expect(result.children[0].type).toBe('codeBlock');
    expect(result.children[0].language).toBe('js');
  });
});

describe('jsonToHTML', () => {
  it('serializes a paragraph', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        { type: 'paragraph', children: [{ type: 'text', text: 'Hello', marks: [] }] }
      ]
    };
    expect(jsonToHTML(doc)).toBe('<p>Hello</p>');
  });

  it('serializes headings', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        { type: 'heading', level: 2, children: [{ type: 'text', text: 'Hi', marks: [] }] }
      ]
    };
    expect(jsonToHTML(doc)).toBe('<h2>Hi</h2>');
  });

  it('serializes bold text', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        { type: 'paragraph', children: [{ type: 'text', text: 'Bold', marks: ['bold'] }] }
      ]
    };
    expect(jsonToHTML(doc)).toContain('<strong>Bold</strong>');
  });

  it('serializes italic text', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        { type: 'paragraph', children: [{ type: 'text', text: 'Italic', marks: ['italic'] }] }
      ]
    };
    expect(jsonToHTML(doc)).toContain('<em>Italic</em>');
  });

  it('serializes lists', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        {
          type: 'bulletList',
          children: [
            { type: 'listItem', children: [{ type: 'text', text: 'Item', marks: [] }] }
          ]
        }
      ]
    };
    const html = jsonToHTML(doc);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
  });

  it('serializes links', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        {
          type: 'link',
          href: 'https://example.com',
          children: [{ type: 'text', text: 'Click', marks: [] }]
        }
      ]
    };
    expect(jsonToHTML(doc)).toContain('href="https://example.com"');
    expect(jsonToHTML(doc)).toContain('Click');
  });

  it('serializes images', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        { type: 'image', src: 'https://example.com/img.png', alt: 'Test' }
      ]
    };
    const html = jsonToHTML(doc);
    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="Test"');
  });

  it('serializes blockquote', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        {
          type: 'blockquote',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Quote', marks: [] }] }
          ]
        }
      ]
    };
    const html = jsonToHTML(doc);
    expect(html).toContain('<blockquote>');
  });

  it('serializes code blocks', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [
        {
          type: 'codeBlock',
          language: 'js',
          children: [{ type: 'text', text: 'const x = 1;', marks: [] }]
        }
      ]
    };
    const html = jsonToHTML(doc);
    expect(html).toContain('<pre>');
    expect(html).toContain('<code class="language-js">');
  });

  it('serializes horizontal rule', async () => {
    const { jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const doc = {
      type: 'doc',
      children: [{ type: 'horizontalRule' }]
    };
    expect(jsonToHTML(doc)).toContain('<hr');
  });
});

describe('htmlToJSON / jsonToHTML roundtrip', () => {
  it('paragraph roundtrip', async () => {
    const { htmlToJSON, jsonToHTML } = await import('../editor-core/src/utils/serialize.js');
    const original = '<p>Hello world</p>';
    const json = htmlToJSON(original);
    const html = jsonToHTML(json);
    expect(html).toBe(original);
  });
});

describe('sanitizeHTML', () => {
  it('removes script tags', async () => {
    const { sanitizeHTML } = await import('../editor-core/src/utils/sanitize.js');
    const result = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>');
    expect(result).not.toContain('<script');
    expect(result).toContain('<p>Hello</p>');
  });

  it('removes event handlers', async () => {
    const { sanitizeHTML } = await import('../editor-core/src/utils/sanitize.js');
    const result = sanitizeHTML('<p onclick="alert()">Click</p>');
    expect(result).not.toContain('onclick');
  });

  it('removes javascript: URLs', async () => {
    const { sanitizeHTML } = await import('../editor-core/src/utils/sanitize.js');
    const result = sanitizeHTML('<a href="javascript:alert()">Link</a>');
    expect(result).not.toContain('javascript:');
  });

  it('keeps safe tags', async () => {
    const { sanitizeHTML } = await import('../editor-core/src/utils/sanitize.js');
    const result = sanitizeHTML('<p><strong>Bold</strong> and <em>italic</em></p>');
    expect(result).toContain('<strong>Bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });
});
