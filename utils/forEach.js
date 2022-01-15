Array.prototype.forEach2 = function (callback, thisArg) {
  if (this === null) {
    throw new TypeError("this is null or not undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      callback.call(thisArg, O[k], k, O);
    }
    k++;
  }
};
[1, 2, 3].forEach2((a,b,c)=>console.log(a,b,c))