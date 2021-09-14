(function (graph) {
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
        require('./src/index.js.js')
    })({"./src/index.js":{"dependencies":{"./message.js":"./src\\message.js"},"code":"\"use strict\";\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _message[\"default\"])(1, 2)); // console.log(message.add(0, 1), message.message)"},"./src\\message.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _default = function _default(a, b) {\n  return a + b;\n}; // export const add = (a, b) => a + b\n// export const message = 'sssss'\n\n\nexports[\"default\"] = _default;"}})