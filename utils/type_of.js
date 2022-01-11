/**
 * 获取目标的数据类型
 * @param {*} obj 目标
 * @returns 
 */
const typeOf = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

console.log(typeOf([]))
console.log(typeOf({}))
console.log(typeOf(new RegExp()))
console.log(typeOf(Symbol(1)))
