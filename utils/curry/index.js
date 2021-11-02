function curry(fn) {
  const context = this;
  function inner(...args) {
    if (args.length === fn.length) {
      return fn.call(context, ...args);
    }
    return (...innerArgs) => inner.call(context, ...args, ...innerArgs);
  }
  return inner;
}

function test(a, b, c) {
  console.log(a, b, c);
}

const f1 = curry(test)(1);
const f2 = f1(2);
f2(3);
