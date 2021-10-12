const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (newStatus) {
      case FULFILLED: {
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      }
      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;
      }
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  then(onFulfilled, onRejected) {
    const fulFilledFn = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };
    const rejectedFn = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };
    const fulFilledFnWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (!this.isFunction(onFulfilled)) {
            resolve(this.value);
          } else {
            const x = fulFilledFn(this.value);
            this.resolvePromise(newPromise, x, resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    const rejectedFnWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (!this.isFunction(onRejected)) {
            reject(this.reason);
          } else {
            const x = rejectedFn(this.reason);
            this.resolvePromise(newPromise, x, resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MyPromise((resolve, reject) =>
          fulFilledFnWithCatch(resolve, reject, newPromise)
        );
        return newPromise;
      }
      case REJECTED: {
        const newPromise = new MyPromise((resolve, reject) =>
          rejectedFnWithCatch(resolve, reject, newPromise)
        );
        return newPromise;
      }
      case PENDING: {
        const newPromise = new MyPromise((resolve, reject) => {
          this.FULFILLED_CALLBACK_LIST.push(() =>
            fulFilledFnWithCatch(resolve, reject, newPromise)
          );
          this.REJECTED_CALLBACK_LIST.push(() =>
            rejectedFnWithCatch(resolve, reject, newPromise)
          );
        });
        return newPromise;
      }
    }
  }

  finally(callback) {
    return this.then(
      (value) => {
        // callback没有参数、
        // 如果callback返回的是promise，则会等待promise执行
        return MyPromise.resolve(callback()).then(() => {
          // finally会保持promise状态和值
          return value;
        });
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          // finally会保持promise状态和值
          throw reason;
        });
      }
    );
  }

  resolvePromise(newPromise, x, resolve, reject) {
    if (newPromise === x) {
      return reject(
        new TypeError("The promise and the return value are the same")
      );
    }

    if (x instanceof MyPromise) {
      if (x.status === PENDING) {
        x.then(
          (y) => {
            this.resolvePromise(newPromise, y, resolve, reject);
          },
          (reason) => {
            reject(reason);
          }
        );
      } else {
        x.then(resolve, reject);
      }
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;

      try {
        then = x.then;
      } catch (error) {
        return reject(error);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(newPromise, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (error) {
          if (called) return;
          reject(error);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  isFunction(param) {
    return typeof param === "function";
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError("arguments must be an array"));
      }

      let resolvedCounter = 0;
      const promiseNum = promiseList.length;
      let resolvedValues = [];

      if (promiseList.length === 0) {
        return resolve();
      }

      promiseList.forEach((promise) => {
        MyPromise.resolve(promise).then(
          (value) => {
            resolvedCounter++;
            resolvedValues.push(value);
            if (resolvedCounter === promiseNum) {
              return resolve(resolvedValues);
            }
          },
          (reason) => reject(reason)
        );
      });
    });
  }

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError("arguments must be an array"));
      }

      if (promiseList.length === 0) {
        return resolve();
      }

      promiseList.forEach((promise) => {
        promise.then(resolve, reject);
        // Promise.resolve(promise).then(resolve, reject)
      });
    });
  }

  static allSettled(promiseList) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promiseList)) {
        return reject(new TypeError("arguments must be an array"));
      }

      let resolvedCounter = 0;
      const promiseNum = promiseList.length;
      let resolvedValues = [];

      if (promiseNum === 0) {
        return resolve();
      }

      promiseList.forEach((promise) => {
        MyPromise.resolve(promise).then(
          (value) => {
            resolvedCounter++;
            resolvedValues.push(value);
            if (resolvedCounter == promiseNum) {
              return resolve(resolvedValues);
            }
          },
          (reason) => {
            resolvedCounter++;
            resolvedValues.push(reason);
            if (resolvedCounter == promiseNum) {
              return reject(reason);
            }
          }
        );
      });
    });
  }
}

const test = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(1);
  }, 1000);
}).catch((reason) => console.log("报错" + reason));
