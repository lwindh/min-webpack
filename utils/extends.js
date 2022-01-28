// 原型链继承
// 问题1：原型中包含的引用类型属性将被所有实例共享
// 问题2：子类在实例化的时候不能给父类构造函数传参
function Animal() {
  this.colors = ['black', 'white']
}
Animal.prototype.getType = function () {
  return this.colors
}

function Dog() {}
Dog.prototype = new Animal()

// 借用构造函数实现继承
// 问题1：导致每次创建子类实例都会创建一遍方法
function Animal(name) {
  this.name = name
  this.getName = function () {
    return this.name
  }
}

function Dog(name) {
  Animal.call(this, name)
}
Dog.prototype = new Animal()

// 组合继承
// 问题1：调用了 2 次父类构造函数
function Animal(name) {
  this.name = name
  this.colors = ['black', 'white']
}
Animal.prototype.getName = function() {
  return this.name
}

function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}
Dog.prototype =  new Animal()
Dog.prototype.constructor = Dog

// 寄生式组合继承
function Parent(name) {
  this.name = name
  this.say = () => {
    console.log(`${this.name}say`)
  }
}

Parent.prototype.play = function () {
  console.log(`${this.name}play`)
}

function Children(name) {
  Parent.call(this)
  this.name = name
}

Children.prototype = Object.create(Parent.prototype)
Children.prototype.constructor = Children

let child = new Children('111')
console.log(child.name)
child.say()
child.play()

// class 继承
class Animal {
  constructor(name) {
      this.name = name
  } 
  getName() {
      return this.name
  }
}
class Dog extends Animal {
  constructor(name, age) {
      super(name)
      this.age = age
  }
}
