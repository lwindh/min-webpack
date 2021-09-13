// 导入包
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

/**
 * 获取文件依赖
 * @param {*} filename 文件路径
 * @returns filename 文件名 
 * @returns dependencies 该文件所依赖的模块集合(键值对存储) 
 * @returns code 转后的代码
 */
function getFileDependencies(filename) {
    // 读取文件
    const content = fs.readFileSync(filename, 'utf-8')
    // 将文件内容转化为 AST
    const ast = parser.parse(content, {
        sourceType: 'module' // babel 官方规定必须加这个参数，不然无法识别ES Module
    })

    const dependencies = {}
    // 遍历 AST 语法树
    traverse(ast, {
        // 获取 通过 import 引入的模块
        ImportDeclaration({node}) {
            const dirname = path.dirname(filename)
            const newFile = `./${path.join(dirname, node.source.value)}`
            // 保存所依赖的模块
            dependencies[node.source.value] = newFile
        }
    })
    // 通过 @babel/core 和 @babel/preset-env 进行代码的转换 ES6 -> ES5
    const {code} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })

    return {
        filename,
        dependencies,
        code
    }
}

/**
 * 生成依赖图谱
 * @param {*} entry 入口文件
 * @returns dependenceGraph 依赖图谱
 */
function createDependenciesGraph(entry) {
    const entryModule = getFileDependencies(entry)
    // 存储所有模块
    const graphArray = [entryModule]
    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i]
        // 获取该文件所有依赖的模块集合（键值对存储）
        const {dependencies} = item
        for (let j in dependencies) {
            graphArray.push(getFileDependencies(dependencies[j]))
        }
    }
    // 生成依赖图谱
    const dependenceGraph = {}
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })

    return dependenceGraph
}