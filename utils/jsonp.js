const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let dataSrc = []
    Object.keys(params).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        dataSrc.push(`${key}=${params[key]}`)
      }
      dataSrc.push(`callback=${callbackName}`)
      return `${url}?${dataSrc.join('&')}`
    })
  }

  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement('script')
    scriptEle.src = generateUrl()
    document.body.appendChild(scriptEle)
    window[callbackName] = (data) => {
      resolve(data)
      document.removeChild(scriptEle)
    }
  })
}
