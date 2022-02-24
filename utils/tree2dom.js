const vNode = {
  tag: 'DIV',
  children: [
    { tag: 'SPAN', children: [] },
    {
      tag: 'UL',
      children: [
        { tag: 'LI', children: [] },
        { tag: 'LI', children: [] },
      ],
    },
  ],
}
function tree2dom(vNode) {
  // 如果是数字类型转化为字符串
  if (typeof vNode === 'number') {
    vNode = String(vNode)
  }
  // 字符串类型直接就是文本节点
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }
  // 普通DOM
  const dom = document.createElement(vNode.tag)
  if (vNode.attrs) {
    // 遍历属性
    Object.keys(vNode.attrs).forEach((key) => {
      const value = vNode.attrs[key]
      dom.setAttribute(key, value)
    })
  }
  // 子数组进行递归操作
  vNode.children.forEach((child) => dom.appendChild(tree2dom(child)))

  return dom
}
