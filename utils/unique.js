const unique = (arr) => {
  const res = arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })

  return res
}

const uniqueArr = (arr) => [...new Set(arr)]
