const MAX_HISTORY = 100;
const DEBOUNCE_MS = 300;

export class History {
  constructor() {
    this._stack = [];
    this._index = -1;
    this._debounceTimer = null;
  }

  push(state) {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      // Discard any redo states
      this._stack = this._stack.slice(0, this._index + 1);
      this._stack.push(state);
      if (this._stack.length > MAX_HISTORY) {
        this._stack.shift();
      }
      this._index = this._stack.length - 1;
    }, DEBOUNCE_MS);
  }

  undo() {
    if (this._index > 0) {
      this._index--;
      return this._stack[this._index];
    }
    return null;
  }

  redo() {
    if (this._index < this._stack.length - 1) {
      this._index++;
      return this._stack[this._index];
    }
    return null;
  }

  // Force push without debounce (used for initial state)
  pushImmediate(state) {
    clearTimeout(this._debounceTimer);
    this._stack = this._stack.slice(0, this._index + 1);
    this._stack.push(state);
    if (this._stack.length > MAX_HISTORY) {
      this._stack.shift();
    }
    this._index = this._stack.length - 1;
  }
}
