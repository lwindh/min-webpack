const detect = (obj, stackSet, detected) => {
  // 不是对象类型的话，可以直接跳过
  if (obj && typeof obj !== "object") {
    return;
  }
  // 当要检查的对象已经存在于stackSet中时，表示存在循环引用
  if (stackSet.has(obj)) {
    return (detected = true);
  }
  // 将当前obj存入stackSet
  stackSet.add(obj);

  for (let key in obj) {
    // 对obj下的属性进行挨个检测
    if (obj.hasOwnProperty(key)) {
      detect(obj[key], stackSet, detected);
    }
  }
  // 平级检测完成之后，将当前对象删除，防止误判
  stackSet.delete(obj);
};

// 判断是不是循环引用
const isCyclic = (obj) => {
  // 使用Set数据类型来存储已经检测过的对象
  let stackSet = new Set();
  let detected = false;

  detect(obj, stackSet, detected);

  return detected;
};

const getType = (s) => {
  return Object.prototype.toString
    .call(s)
    .replace(/\[object (.*)\]/, "$1")
    .toLowerCase();
};

const jsonStringify = (data) => {
  // 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
  if (isCyclic(data)) {
    throw new TypeError("Converting circular structure to JSON");
  }
  // 当尝试去转换 BigInt 类型的值会抛出错误
  if (typeof data === "bigint") {
    throw new TypeError("Do not know how to serialize a BigInt");
  }

  const type = typeof data;
  const commonKeys1 = ["undefined", "function", "symbol"];
  // 非对象
  if (type !== "object" || data === null) {
    let result = data;
    // NaN 和 Infinity 格式的数值及 null 都会被当做 null。
    if ([NaN, Infinity, null].includes(data)) {
      result = "null";
      // `undefined`、`任意的函数`以及`symbol值`被`单独转换`时，会返回 undefined
    } else if (commonKeys1.includes(type)) {
      // 直接得到undefined，并不是一个字符串'undefined'
      return undefined;
    } else if (type === "string") {
      result = '"' + data + '"';
    }

    return String(result);
  } else if (type === "object") {
    // Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
    if (typeof data.toJson === "function") {
      return jsonStringify(data.toJson());
    } else if (Array.isArray(data)) {
      let result = data.map((it) => {
        // `undefined`、`任意的函数`以及`symbol值`出现在`数组`中时会被转换成 `null`
        return commonKeys1.includes(typeof it) ? "null" : jsonstringify(it);
      });

      return `[${result}]`.replace(/'/g, '"');
    } else {
      // 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
      if (["boolean", "number"].includes(getType(data))) {
        return String(data);
      } else if (getType(data) === "string") {
        return '"' + data + '"';
      } else {
        let result = [];
        // 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
        Object.keys(data).forEach((key) => {
          // 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们
          if (typeof key !== "symbol") {
            const value = data[key];
            // `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略
            if (!commonKeys1.includes(typeof value)) {
              result.push(`"${key}":${jsonstringify(value)}`);
            }
          }
        });

        return `{${result}}`.replace(/'/, '"');
      }
    }
  }
};
