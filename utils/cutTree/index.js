function cutTree(list, MM, range) {
  if (list.length === 0) return 0;
  let start = 0;
  let end = Math.max(...list);

  while (start <= end) {
    const mid = start + ((end - start) >> 1);
    let res = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i] > mid) {
        res = res + list[i] - mid;
      }
    }

    if (res > MM) {
      if (res - MM <= range) return mid;
      end = mid - range;
    } else {
      start = mid + range;
    }
  }

  return -1;
}

//test
const a = cutTree([10, 8, 9, 7, 7, 6], 16, 1);
const b = cutTree([10, 8, 9, 7, 7, 6], 20, 1);
const c = cutTree([10, 8, 9, 7, 7, 6], 15, 1);

console.log(a, b, c);
