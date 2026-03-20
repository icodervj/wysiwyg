export class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  on(event, handler) {
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(handler);
    return this;
  }

  off(event, handler) {
    if (!this._events.has(event)) return this;
    const handlers = this._events.get(event).filter(h => h !== handler);
    this._events.set(event, handlers);
    return this;
  }

  emit(event, ...args) {
    if (!this._events.has(event)) return;
    for (const handler of this._events.get(event)) {
      handler(...args);
    }
  }
}
