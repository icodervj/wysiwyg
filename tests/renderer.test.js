import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';

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

describe('jsonToDOM', () => {
  it('creates a paragraph element', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        { type: 'paragraph', children: [{ type: 'text', text: 'Hello', marks: [] }] }
      ]
    });
    const p = frag.firstChild;
    expect(p.tagName.toLowerCase()).toBe('p');
    expect(p.textContent).toBe('Hello');
  });

  it('creates heading elements with correct level', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        { type: 'heading', level: 1, children: [{ type: 'text', text: 'Title', marks: [] }] },
        { type: 'heading', level: 3, children: [{ type: 'text', text: 'Sub', marks: [] }] },
      ]
    });
    const h1 = frag.childNodes[0];
    const h3 = frag.childNodes[1];
    expect(h1.tagName.toLowerCase()).toBe('h1');
    expect(h3.tagName.toLowerCase()).toBe('h3');
  });

  it('creates unordered list', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'bulletList',
          children: [
            { type: 'listItem', children: [{ type: 'text', text: 'Item 1', marks: [] }] },
            { type: 'listItem', children: [{ type: 'text', text: 'Item 2', marks: [] }] },
          ]
        }
      ]
    });
    const ul = frag.firstChild;
    expect(ul.tagName.toLowerCase()).toBe('ul');
    expect(ul.children.length).toBe(2);
    expect(ul.children[0].tagName.toLowerCase()).toBe('li');
  });

  it('creates ordered list', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'orderedList',
          children: [
            { type: 'listItem', children: [{ type: 'text', text: 'First', marks: [] }] }
          ]
        }
      ]
    });
    expect(frag.firstChild.tagName.toLowerCase()).toBe('ol');
  });

  it('creates blockquote', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'blockquote',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Quote text', marks: [] }] }
          ]
        }
      ]
    });
    expect(frag.firstChild.tagName.toLowerCase()).toBe('blockquote');
    expect(frag.firstChild.firstChild.tagName.toLowerCase()).toBe('p');
  });

  it('creates code block with pre and code', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'codeBlock',
          language: 'js',
          children: [{ type: 'text', text: 'const x = 1;', marks: [] }]
        }
      ]
    });
    const pre = frag.firstChild;
    expect(pre.tagName.toLowerCase()).toBe('pre');
    const code = pre.firstChild;
    expect(code.tagName.toLowerCase()).toBe('code');
    expect(code.className).toBe('language-js');
    expect(code.textContent).toBe('const x = 1;');
  });

  it('creates image element', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        { type: 'image', src: 'https://example.com/img.png', alt: 'Test image' }
      ]
    });
    const img = frag.firstChild;
    expect(img.tagName.toLowerCase()).toBe('img');
    expect(img.getAttribute('src')).toBe('https://example.com/img.png');
    expect(img.getAttribute('alt')).toBe('Test image');
  });

  it('creates horizontal rule', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [{ type: 'horizontalRule' }]
    });
    expect(frag.firstChild.tagName.toLowerCase()).toBe('hr');
  });

  it('creates link element', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'link',
          href: 'https://example.com',
          children: [{ type: 'text', text: 'Example', marks: [] }]
        }
      ]
    });
    const a = frag.firstChild;
    expect(a.tagName.toLowerCase()).toBe('a');
    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.textContent).toBe('Example');
  });

  it('wraps bold text in strong', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Bold', marks: ['bold'] }]
        }
      ]
    });
    const p = frag.firstChild;
    expect(p.firstChild.tagName.toLowerCase()).toBe('strong');
    expect(p.firstChild.textContent).toBe('Bold');
  });

  it('wraps italic text in em', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Italic', marks: ['italic'] }]
        }
      ]
    });
    const p = frag.firstChild;
    expect(p.firstChild.tagName.toLowerCase()).toBe('em');
  });

  it('wraps underline text in u', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Underline', marks: ['underline'] }]
        }
      ]
    });
    const p = frag.firstChild;
    expect(p.firstChild.tagName.toLowerCase()).toBe('u');
  });

  it('wraps code text in code element', async () => {
    const { jsonToDOM } = await import('../editor-core/src/utils/serialize.js');
    const frag = jsonToDOM({
      type: 'doc',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'x = 1', marks: ['code'] }]
        }
      ]
    });
    const p = frag.firstChild;
    expect(p.firstChild.tagName.toLowerCase()).toBe('code');
    expect(p.firstChild.textContent).toBe('x = 1');
  });
});

describe('EventEmitter', () => {
  it('emits and receives events', async () => {
    const { EventEmitter } = await import('../editor-core/src/core/EventEmitter.js');
    const emitter = new EventEmitter();
    let received = null;
    emitter.on('test', (data) => { received = data; });
    emitter.emit('test', 'hello');
    expect(received).toBe('hello');
  });

  it('can remove event listeners', async () => {
    const { EventEmitter } = await import('../editor-core/src/core/EventEmitter.js');
    const emitter = new EventEmitter();
    let count = 0;
    const handler = () => count++;
    emitter.on('test', handler);
    emitter.emit('test');
    emitter.off('test', handler);
    emitter.emit('test');
    expect(count).toBe(1);
  });
});

describe('History', () => {
  it('supports undo/redo', async () => {
    const { History } = await import('../editor-core/src/core/History.js');
    const history = new History();
    history.pushImmediate('state1');
    history.pushImmediate('state2');
    history.pushImmediate('state3');
    expect(history.undo()).toBe('state2');
    expect(history.undo()).toBe('state1');
    expect(history.redo()).toBe('state2');
  });

  it('returns null when no more undo states', async () => {
    const { History } = await import('../editor-core/src/core/History.js');
    const history = new History();
    history.pushImmediate('only');
    expect(history.undo()).toBeNull();
  });

  it('returns null when no more redo states', async () => {
    const { History } = await import('../editor-core/src/core/History.js');
    const history = new History();
    history.pushImmediate('only');
    expect(history.redo()).toBeNull();
  });
});
