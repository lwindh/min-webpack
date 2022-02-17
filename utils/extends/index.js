// 原型链继承
function Parent() {
  this.action = ["eat", "sleep"];
  this.name = "sss";
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const c1 = new Child();
const c2 = new Child();

console.log(c1.getName());
c1.action.pop();
console.log(c1.action);
console.log(c2.action);

/* 问题
1. 如果属性为引用类型，一旦修改，所以实例都会被影响
2. Child实例无法传递参数
*/

// 构造函数继承
function Parent() {
  this.action = ["eat", "sleep"];
  this.name = "sss";
}

function Child(id, ...rest) {
  Parent.apply(this, rest);
  this.id = id;
}

/* 问题
1. 属性或方法被继承，只能在构造函数中定义，会浪费内存
*/

// 组合继承
function Parent() {
  this.action = ["eat", "sleep"];
  this.name = "sss";
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child(id, ...rest) {
  Parent.apply(this, rest);
  this.id = id;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

/* 问题
1. 调用了两次Parent构造函数
*/

// 寄生组合式继承
function Parent() {
  this.action = ["eat", "sleep"];
  this.name = "sss";
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child(id, ...rest) {
  Parent.apply(this, rest);
  this.id = id;
}

/* let TempFunc = function () {}
TempFunc.prototype = Parent.prototype;
Child.prototype = new TempFunc(); */
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
