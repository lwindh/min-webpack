Array.prototype.some2 = function (callback, thisArg) {
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
        if (callback.call(thisArg, O[k], k, O)) {
            return true;
        }
      }
      k++;
    }
  };
  
  console.log([1, 2, 3].some2((a,b,c)=> a===1))