function reduce(arr, reduceCallback, initialValue) {
  // 首先，检查传递的参数是否正确。
  if (
    !Array.isArray(arr) ||
    !arr.length ||
    typeof reduceCallback !== "function"
  ) {
    throw TypeError("参数格式错误");
  }
  // 如果没有将initialValue传递给该函数，我们将使用第一个数组项作为initialValue
  let hasInitialValue = initialValue !== undefined;
  let value = hasInitialValue ? initialValue : 0;
  // 如果有传递 initialValue，则索引从 1 开始，否则从 0 开始
  for (let i = 0, len = arr.length; i < len; i++) {
    value = reduceCallback(value, arr[i], i, arr);
  }
  return value;
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(reduce(arr, (a, b) => a + b));
