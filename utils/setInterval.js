const mySetInterval = (fn, timeout) => {
  let timer = null
  const interval = () => {
    fn()
    setTimeout(interval, timeout)
  }
  interval()
  return {
    cancel: () => {
      clearTimeout(timer)
      timer = null
    },
  }
}

let a = mySetInterval(() => {
  console.log(111)
}, 1000)
