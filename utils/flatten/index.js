let arr = [1, 2, [3, 4, [5, 6, [7]]]];

// console.log(arr.flat(Infinity))

function fn(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? fn(cur) : cur);
  }, []);
}
console.log(fn(arr));

/* function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

console.log(flatten(arr)) */
