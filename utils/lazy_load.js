let imgList = [...document.querySelectorAll('img')]
const length = imgList.length

const imgLazyLoad = function () {
  let count = 0

  return function () {
    let deleteIndexList = []
    imgList.forEach((img, index) => {
        // 获取矩形的集合
      let rect = img.getBoundingClientRect()
      // rect.top 元素距离顶部的距离 相对于视口
      // window.innerHeight 页面可用高度
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src
        deleteIndexList.push(index)
        count++
        if (count === length) {
          document.removeEventListener('scroll', imgLazyLoad)
        }
      }
    })
    imgList = imgList.filter((_, index) => !deleteIndexList.includes(index))
  }
}

// 这里最好加上防抖处理
document.addEventListener('scroll', imgLazyLoad)
