import { describe, it, expect } from 'vitest';

// Commands are plain objects with exec/isActive methods
// We test structure and behavior without a real browser DOM

const commandModules = [
  { name: 'bold', file: '../editor-core/src/commands/bold.js' },
  { name: 'italic', file: '../editor-core/src/commands/italic.js' },
  { name: 'underline', file: '../editor-core/src/commands/underline.js' },
  { name: 'heading', file: '../editor-core/src/commands/heading.js' },
  { name: 'list', file: '../editor-core/src/commands/list.js' },
  { name: 'link', file: '../editor-core/src/commands/link.js' },
  { name: 'image', file: '../editor-core/src/commands/image.js' },
  { name: 'blockquote', file: '../editor-core/src/commands/quote.js' },
  { name: 'codeBlock', file: '../editor-core/src/commands/codeBlock.js' },
  { name: 'horizontalRule', file: '../editor-core/src/commands/horizontalRule.js' },
];

describe('Command structure', () => {
  it('bold command has name, exec, and isActive', async () => {
    const { default: bold } = await import('../editor-core/src/commands/bold.js');
    expect(bold.name).toBe('bold');
    expect(typeof bold.exec).toBe('function');
    expect(typeof bold.isActive).toBe('function');
    expect(bold.shortcut).toBe('ctrl+b');
  });

  it('italic command has name, exec, and isActive', async () => {
    const { default: italic } = await import('../editor-core/src/commands/italic.js');
    expect(italic.name).toBe('italic');
    expect(typeof italic.exec).toBe('function');
    expect(typeof italic.isActive).toBe('function');
    expect(italic.shortcut).toBe('ctrl+i');
  });

  it('underline command has name, exec, and isActive', async () => {
    const { default: underline } = await import('../editor-core/src/commands/underline.js');
    expect(underline.name).toBe('underline');
    expect(typeof underline.exec).toBe('function');
    expect(typeof underline.isActive).toBe('function');
    expect(underline.shortcut).toBe('ctrl+u');
  });

  it('heading command has name, exec, and isActive', async () => {
    const { default: heading } = await import('../editor-core/src/commands/heading.js');
    expect(heading.name).toBe('heading');
    expect(typeof heading.exec).toBe('function');
    expect(typeof heading.isActive).toBe('function');
  });

  it('list command has name, exec, and isActive', async () => {
    const { default: list } = await import('../editor-core/src/commands/list.js');
    expect(list.name).toBe('list');
    expect(typeof list.exec).toBe('function');
    expect(typeof list.isActive).toBe('function');
  });

  it('link command has name, exec, and isActive', async () => {
    const { default: link } = await import('../editor-core/src/commands/link.js');
    expect(link.name).toBe('link');
    expect(typeof link.exec).toBe('function');
    expect(typeof link.isActive).toBe('function');
  });

  it('image command has name, exec, and isActive', async () => {
    const { default: image } = await import('../editor-core/src/commands/image.js');
    expect(image.name).toBe('image');
    expect(typeof image.exec).toBe('function');
    expect(typeof image.isActive).toBe('function');
  });

  it('blockquote command has name, exec, and isActive', async () => {
    const { default: quote } = await import('../editor-core/src/commands/quote.js');
    expect(quote.name).toBe('blockquote');
    expect(typeof quote.exec).toBe('function');
    expect(typeof quote.isActive).toBe('function');
  });

  it('codeBlock command has name, exec, and isActive', async () => {
    const { default: codeBlock } = await import('../editor-core/src/commands/codeBlock.js');
    expect(codeBlock.name).toBe('codeBlock');
    expect(typeof codeBlock.exec).toBe('function');
    expect(typeof codeBlock.isActive).toBe('function');
  });

  it('horizontalRule command has name, exec, and isActive', async () => {
    const { default: horizontalRule } = await import('../editor-core/src/commands/horizontalRule.js');
    expect(horizontalRule.name).toBe('horizontalRule');
    expect(typeof horizontalRule.exec).toBe('function');
    expect(typeof horizontalRule.isActive).toBe('function');
  });
});

describe('CommandRegistry', () => {
  it('can register and retrieve commands', async () => {
    const { CommandRegistry } = await import('../editor-core/src/commands/index.js');
    const registry = new CommandRegistry();
    const mockCmd = { name: 'test', exec: () => {}, isActive: () => false };
    registry.register(mockCmd);
    expect(registry.get('test')).toBe(mockCmd);
  });

  it('returns undefined for unknown commands', async () => {
    const { CommandRegistry } = await import('../editor-core/src/commands/index.js');
    const registry = new CommandRegistry();
    expect(registry.get('nonexistent')).toBeUndefined();
  });

  it('isActive returns false for commands without isActive', async () => {
    const { CommandRegistry } = await import('../editor-core/src/commands/index.js');
    const registry = new CommandRegistry();
    registry.register({ name: 'test', exec: () => {} });
    expect(registry.isActive('test', null)).toBe(false);
  });

  it('builtinCommands exports all expected commands', async () => {
    const { builtinCommands } = await import('../editor-core/src/commands/index.js');
    const names = builtinCommands.map(c => c.name);
    expect(names).toContain('bold');
    expect(names).toContain('italic');
    expect(names).toContain('underline');
    expect(names).toContain('blockquote');
    expect(names).toContain('codeBlock');
    expect(names).toContain('horizontalRule');
    expect(names).toContain('image');
    expect(names).toContain('link');
    expect(names).toContain('list');
    expect(names).toContain('heading');
  });
});
