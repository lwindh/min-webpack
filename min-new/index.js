const Mynew = (obj, ...rest) => {
    let o = new Object();
    o.__proto__ = obj.prototype;

    let res = obj.apply(o, rest);
    if (typeof res === 'object') return res
    return o;
}