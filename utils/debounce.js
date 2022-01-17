function debounce(func, wait) {
  let timer = null

  return function (...args) {
    const context = this
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}

function debounce(func, wait, immediate) {
  let timer = null,
    result

  const debounced = function (...args) {
    const context = this

    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(function () {
        timer = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timer = setTimeout(function () {
        func.apply(context, args)
      }, wait)
      console.log(timer)
    }
    return result
  }

  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}
