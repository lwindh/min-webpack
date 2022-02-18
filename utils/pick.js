function pick(source, ...include) {
  return Object.keys(source).reduce(
    (acc, cur) =>
      include.includes(cur) ? { ...acc, [cur]: source[cur] } : acc,
    {}
  )
}

const a = {
  a: 1,
  b: 22,
  c: 3,
}

console.log(pick(a, 'a'))
