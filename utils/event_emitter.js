class EventEmitter {
  constructor() {
    this.events = {}
  }

  // 实现订阅
  on(type, callback) {
    if (!this.events[type]) {
      this.events[type] = [callback]
    } else {
      this.events[type].push(callback)
    }
  }

  // 取消订阅
  off(type, callback) {
    if (!this.events[type]) return
    this.events[type] = this.events[type].filter((item) => {
      return item !== callback
    })
  }

  // 只执行一次订阅事件
  once(type, callback) {
    function fn() {
      callback()
      this.off(type, fn)
    }
    this.on(type, fn)
  }

  // 触发事件
  emit(type, ...rest) {
    this.events[type] && this.events[type].forEach((fn) => fn.apply(this, rest))
  }
}

// 使用如下
const event = new EventEmitter();

const handle = (...rest) => {
  console.log(rest);
};

event.on("click", handle);

event.emit("click", 1, 2, 3, 4);

event.off("click", handle);

event.emit("click", 1, 2);

event.once("dbClick", () => {
  console.log(123456);
});
event.emit("dbClick");
event.emit("dbClick");
