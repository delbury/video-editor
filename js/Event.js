export class Event {
  #events = new Map();
  constructor() {
  }

  // 绑定事件
  on(eventName, callback) {
    if(this.#events.has(eventName)) {
      this.#events.get(eventName).add(callback);
    } else {
      this.#events.set(eventName, new Set([callback]));
    }
  }

  // 解绑事件
  off(eventName, callback) {
    if(this.#events.has(eventName)) {
      if(callback) {
        this.#events.get(eventName).delete(callback);
      } else {
        this.#events.get(eventName).clear();
      }
    }
  }

  // 触发事件
  emit(eventName, ...payloads) {
    if(this.#events.has(eventName)) {
      this.#events.get(eventName).forEach(cb => cb(...payloads));
    }
  }
}
