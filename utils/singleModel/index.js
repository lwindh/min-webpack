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
const fooService1 = FooServiceSingleton.getInstance();
const fooService2 = FooServiceSingleton.getInstance();

console.log(fooService1 === fooService2);
