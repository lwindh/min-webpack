// 导入包
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

/**
 * 获取文件依赖
 * @param {*} filename 文件路径
 * @returns filename 文件名
 * @returns dependencies 该文件所依赖的模块集合(键值对存储)
 * @returns code 转后的代码
 */
function getFileDependencies(filename) {
  // 读取文件
  const content = fs.readFileSync(filename, "utf-8");
  // 将文件内容转化为 AST
  const ast = parser.parse(content, {
    sourceType: "module", // babel 官方规定必须加这个参数，不然无法识别ES Module
  });
  // 收集该文件的依赖
  const dependencies = {};
  traverse(ast, {
    // 获取 通过 import 引入的模块
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const absPath = `./${path.join(dirname, node.source.value)}`;
      // 保存所依赖的模块
      dependencies[node.source.value] = absPath;
    },
  });
  // 通过 @babel/core 和 @babel/preset-env 进行代码的转换 ES6 -> ES5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return {
    filename,
    dependencies,
    code,
  };
}

/**
 * 获取依赖
 * @param {*} temp
 * @param {*} param1
 */
function getDependencies(temp, { dependencies }) {
  Object.keys(dependencies).forEach((key) => {
    const child = getFileDependencies(dependencies[key]);
    temp.push(child);
    getDependencies(temp, child);
  });
}

/**
 * 模块解析生成依赖图谱
 * @param {*} entry 入口文件
 * @returns dependenceGraph 依赖图谱
 */
function parseModules(entry) {
  const entryModule = getFileDependencies(entry);
  const graphArray = [entryModule];
  const dependenceGraph = {};

  getDependencies(graphArray, entryModule);
  // 生成依赖图谱
  graphArray.forEach((item) => {
    dependenceGraph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    };
  });

  return dependenceGraph;
}

/**
 * 生成bundle文件
 * @param {*} file 
 * @returns 
 */
function bundle(file) {
  const graph = JSON.stringify(parseModules(file));
  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].dependencies[relPath])
            }
            var exports = {};
            (function (require, exports, code) {
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('${file}')
    })(${graph})`;
}

const content = bundle('./src/index.js')
// console.log(content)
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);