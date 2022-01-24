function throttle(func, wait) {
  let previous = 0

  return function (...args) {
    const now = new Date.now()
    const context = this
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
