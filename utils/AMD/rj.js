const def = new Map();

// AMD mini impl
const defaultOptions = {
  paths: "",
};

// From CDN
const __import = (url) => {
  return new Promise((resolve, reject) => {
    System.import(url).then(resolve, reject);
  });
};

// normal script
const __load = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName("head")[0];
    const node = document.createElement("script");
    node.type = "text/javascript";
    node.src = url;
    node.async = true;
    node.onload = resolve;
    node.onerror = reject;
    head.appendChild(node);
  });
};

rj = {};

rj.config = (options) => Object.assign(defaultOptions, options);

// 定义模块，触发的时机其实是 require 的时候，所以 -> 收集
define = (name, deps, factory) => {
  // todo 参数判断，互换
  def.set(name, { name, deps, factory });
};

// dep -> a -> a.js -> 'http://'
const __getUrl = (dep) => {
  const p = location.pathname;
  return p.slice(0, p.lastIndexOf("/")) + "/" + dep + ".js";
};

// 其实才是触发加载依赖的地方
require = (deps, factory) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      deps.map((dep) => {
        // 走 CDN
        if (defaultOptions.paths[dep])
          return __import(defaultOptions.paths[dep]);

        return __load(__getUrl(dep)).then(() => {
          const { deps, factory } = def.get(dep);
          if (deps.length === 0) return factory(null);
          return require(deps, factory);
        });
      })
    ).then(resolve, reject);
  }).then((instances) => factory(...instances));
};
