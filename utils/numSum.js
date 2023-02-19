let arr = [1, 4, 7, 11, 9, 8, 10, 6];
let N = 3;
let M = 27;

function numSum(nums, n, m) {
  if (!nums.length || nums.length < n) return [];
  nums = nums.sort((a, b) => a - b);
  const result = [];
  const stack = [];

  const backtrace = (start) => {
    if (stack.length === n - 1) {
      let end = nums.length - 1;

      while (start <= end) {
        const temp = stack.reduce((acc, cur) => acc + cur);
        if (temp + nums[start] === m) {
          result.push([...stack, nums[start]]);
        }
        if (start !== end && temp + nums[end] === m) {
          result.push([...stack, nums[end]]);
        }
        start++;
        end--;
      }
      return;
    }

    for (let i = start; i < nums.length; i++) {
      stack.push(nums[i]);
      backtrace(i + 1);
      stack.pop();
    }
  };

  backtrace(0);
  return result;
}

const res = numSum(arr, 3, 27);
console.log(res);
// [7, 11, 9], [11, 10, 6], [9, 8, 10]
