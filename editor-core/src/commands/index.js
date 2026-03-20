import boldCmd from './bold.js';
import italicCmd from './italic.js';
import underlineCmd from './underline.js';
import headingCmd from './heading.js';
import listCmd from './list.js';
import linkCmd from './link.js';
import imageCmd from './image.js';
import quoteCmd from './quote.js';
import codeBlockCmd from './codeBlock.js';
import horizontalRuleCmd from './horizontalRule.js';

export const builtinCommands = [
  boldCmd, italicCmd, underlineCmd,
  headingCmd, listCmd, linkCmd,
  imageCmd, quoteCmd, codeBlockCmd, horizontalRuleCmd
];

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  register(commandDef) {
    this.commands.set(commandDef.name, commandDef);
  }

  exec(name, editor, options = {}) {
    const cmd = this.commands.get(name);
    if (cmd) cmd.exec(editor, options);
  }

  isActive(name, editor) {
    const cmd = this.commands.get(name);
    return cmd && cmd.isActive ? cmd.isActive(editor) : false;
  }

  get(name) {
    return this.commands.get(name);
  }
}
