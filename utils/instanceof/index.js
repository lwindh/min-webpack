function myInstanceof(l, r) {
  if (typeof l !== "object" || r == null) {
    return false;
  }

  let o = r.prototype;
  l = l.__proto__;

  while (true) {
    if (l == null) {
      return false;
    }
    if (o === l) {
      return true;
    }
    l = l.__proto__;
  }
}

//--- 验证 ---

const a = [];
const b = {};

function Foo() {}

var c = new Foo();
function Child() {}
function Father() {}
Child.prototype = new Father();
var d = new Child();

console.log(myInstanceof(a, Array)); // true
console.log(myInstanceof(b, Object)); // true
console.log(myInstanceof(b, Array)); // false
console.log(myInstanceof(a, Object)); // true
console.log(myInstanceof(c, Foo)); // true
console.log(myInstanceof(d, Child)); // true
console.log(myInstanceof(d, Father)); // true
console.log(myInstanceof(123, Object)); // false
console.log(Foo instanceof Function); // false
console.log(myInstanceof(Foo, Function)); // false
