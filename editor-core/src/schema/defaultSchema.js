export const defaultSchema = {
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block', tag: 'p' },
    heading: { content: 'inline*', group: 'block', tag: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], attrs: { level: 1 } },
    bulletList: { content: 'listItem+', group: 'block', tag: 'ul' },
    orderedList: { content: 'listItem+', group: 'block', tag: 'ol' },
    listItem: { content: '(paragraph | block)*', tag: 'li' },
    blockquote: { content: 'block+', group: 'block', tag: 'blockquote' },
    codeBlock: { content: 'text*', group: 'block', tag: 'pre', attrs: { language: '' } },
    image: { group: 'block', inline: false, tag: 'img', attrs: { src: '', alt: '' } },
    horizontalRule: { group: 'block', tag: 'hr' },
    text: { group: 'inline' },
    link: { group: 'inline', content: 'inline*', tag: 'a', attrs: { href: '' } },
  },
  marks: {
    bold: { tag: ['strong', 'b'] },
    italic: { tag: ['em', 'i'] },
    underline: { tag: 'u' },
    strikethrough: { tag: ['s', 'del', 'strike'] },
    code: { tag: 'code' },
  }
};
