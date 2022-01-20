const parseParam = (url) => {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]
  const paramsArr = paramsStr.split('&')
  let paramsObj = {}
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      let [key, val] = param.split('=')
      val = decodeURIComponent(val)
      val = /^\d+$/.test(val) ? parseFloat(val) : val

      if (paramsObj.hasOwnProperty(key)) {
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        paramsObj[key] = val
      }
    } else {
      paramsObj[param] = true
    }
  })

  return paramsObj
}

console.log(parseParam('https://www.badu.com?a=1&a=2&a=3&b=4&c=5'))
