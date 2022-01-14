const isObject = (target) =>
  (typeof target === 'object' || typeof target === 'function') &&
  target !== null

function deepClone(target, map = new WeakMap()) {
  if (map.get(target)) {
    return target
  }

  let constructor = target.constructor
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    return new constructor(target)
  }

  if (isObject(target)) {
    map.set(target, true)
    const cloneTarget = Array.isArray(target) ? [] : {}
    Object.keys(target).forEach((prop) => {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map)
      }
    })
    return cloneTarget
  }
  return target
}

// 缺陷：无法克隆Symbol
console.log(deepClone({ 1: 2, [Symbol(1)]: Symbol(2) }))
