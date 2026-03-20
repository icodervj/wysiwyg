import { htmlToJSON, jsonToHTML, domToJSON, jsonToDOM } from '../utils/serialize.js';

export class Document {
  constructor() {
    this.data = { type: 'doc', children: [] };
  }

  fromHTML(html) {
    this.data = htmlToJSON(html);
    return this.data;
  }

  toHTML() {
    return jsonToHTML(this.data);
  }

  fromDOM(el) {
    this.data = domToJSON(el);
    return this.data;
  }

  toDOM() {
    const frag = jsonToDOM(this.data);
    const nodes = [];
    while (frag.firstChild) {
      nodes.push(frag.firstChild);
      frag.removeChild(frag.firstChild);
    }
    return nodes;
  }
}
