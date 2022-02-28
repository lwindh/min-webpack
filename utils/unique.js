const unique = (arr) => {
  const res = arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })

  return res
}

const unique2 = (arr) => {
  const newArr = []
  arr.reduce((pre, next) => {
    if (!pre.has(next)) {
      pre.set(next, 1)
      newArr.push(next)
    }
    return pre
  }, new Map())
  return newArr
}

const uniqueArr = (arr) => [...new Set(arr)]
