function loopGetLevel(obj) {
  let res = 1

  function computedLevel(obj, level) {
    level = level || 0
    if (typeof obj === 'object') {
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          computedLevel(obj[key], level + 1)
        } else {
          res = level + 1 > res ? level + 1 : res
        }
      }
    } else {
      res = level > res ? level : res
    }
  }

  computedLevel(obj)

  return res
}

const obj = {
  a: { b: [1] },
  c: { d: { e: { f: 1 } } },
}

console.log(loopGetLevel(obj)) // 4
