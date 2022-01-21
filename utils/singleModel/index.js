const FooServiceSingleton = (function () {
  // 隐藏的Class的构造函数
  function FooService() {}

  // 未初始化的单例对象
  let fooService;

  return {
    // 创建/获取单例对象的函数
    getInstance: function () {
      if (!fooService) {
        fooService = new FooService();
      }
      return fooService;
    },
  };
})();

const FooServiceSingleton1 = (function () {
  // 未初始化的单例对象
  let fooService;
  // 创建/获取单例对象的函数
  const CreateInstance = function (name) {
    if (fooService) {
      return fooService;
    }
    this.name = name
    return fooService = this;
  }

  return CreateInstance;
})();

const CreateInstance = function (name) {
  this.name = name
}

const FooServiceSingleton2 = (function () {
  // 未初始化的单例对象
  let fooService;

  return function (name) {
    if (!fooService) {
      fooService = new CreateInstance(name);
    }
    return fooService;
  };
})();

const fooService1 = new FooServiceSingleton2('1');
const fooService2 = new FooServiceSingleton2('2');

console.log(fooService1 === fooService2);
