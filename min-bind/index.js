const ArrayPrototypeSlice = Array.prototype.slice;
Function.prototype.bind = function (otherThis) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }

  let baseArgs = ArrayPrototypeSlice.call(arguments, 1),
    baseArgsLength = baseArgs.length,
    fToBind = this,
    fNOP = function () {},
    fBound = function () {
      baseArgs.length = baseArgsLength;
      baseArgs.push.apply(baseArgs, arguments);
      return fToBind.apply(
        fNOP.prototype.isPrototypeOf(this) ? this : otherThis,
        baseArgs
      );
    };

  if (this.prototype) {
    fNOP.prototype = this.prototype;
  }
  fBound.prototype = new fNOP();

  return fBound;
};
