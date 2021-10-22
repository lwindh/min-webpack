// for split arguments
const ArrayPrototypeSlice = Array.prototype.slice;
// realize bind function
Function.prototype.bind = function (otherThis) {
	// determine whether the object used is a function
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
	// split arguments as a variable
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
  // extends function
  if (this.prototype) {
    fNOP.prototype = this.prototype;
  }
  fBound.prototype = new fNOP();

  return fBound;
};
