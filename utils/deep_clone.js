// 将可遍历类型存在一个数组里
const canForArr = ['Map', 'Set', 'Array', 'Object']

// 将不可遍历类型存在一个数组
const noForArr = ['Symbol', 'RegExp', 'Function']

// 判断类型的函数
function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}

// 判断引用类型的temp
function checkTemp(target) {
  const c = target.constructor
  return new c()
}

// 拷贝Function
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  if (func.prototype) {
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) {
      if (param) {
        const paramArr = param[0].split(',')
        return new Function(...paramArr, body[0])
      } else {
        return new Function(body[0])
      }
    } else {
      return null
    }
  } else {
    return eval(funcString)
  }
}

// 拷贝Symbol
function cloneSymbol(target) {
  return Object(Symbol.prototype.valueOf.call(target))
}

// 拷贝RegExp
function cloneReg(target) {
  const reg = /\w*$/
  const res = new target.constructor(target.source, reg.exec(target))
  res.lastIndex = target.lastIndex
  return res
}

function deepClone(target, map = new Map()) {
  const type = checkType(target)
  // 基本数据类型直接返回
  if (!canForArr.concat(noForArr).includes(type)) {
    return target
  }

  // 判断Function，RegExp，Symbol
  if (type === 'Function') return cloneFunction(target)
  if (type === 'RegExp') return cloneReg(target)
  if (type === 'Symbol') return cloneSymbol(target)

  // 引用数据类型特殊处理
  const cloneTarget = checkTemp(target)

  // 处理环引用
  if (map.get(target)) {
    // 已存在则直接返回
    return map.get(target)
  }
  // 不存在则第一次设置
  map.set(target, cloneTarget)

  // 处理Map类型
  if (type === 'Map') {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map))
    })

    return cloneTarget
  }

  // 处理Set类型
  if (type === 'Set') {
    target.forEach((value, key) => {
      cloneTarget.add(key, deepClone(value, map))
    })

    return cloneTarget
  }

  Object.keys(target).forEach((prop) => {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop], map)
    }
  })
  return cloneTarget
}

const a = {
  name: 'sunshine_lin',
  age: 23,
  hobbies: { sports: '篮球', tv: '雍正王朝' },
  works: ['2020', '2021'],
  map: new Map([
    ['haha', 111],
    ['xixi', 222],
  ]),
  set: new Set([1, 2, 3]),
  func: (name, age) => `${name}今年${age}岁啦！！！`,
  sym: Symbol(123),
  reg: new RegExp(/haha/g),
  startDate: new Date('2022-01-29'),
  endDate: new Date('2022-02-06'),
}

// 缺陷：无法克隆Symbol
console.log(deepClone(a))
