function omit(source, ...exclude) {
  return Object.keys(source).reduce(
    (acc, cur) =>
      exclude.includes(cur) ? acc : { ...acc, [cur]: source[cur] },
    {}
  )
}

const a = {
  a: 1,
  b: 22,
  c: 3,
}

console.log(omit(a, 'a'))
