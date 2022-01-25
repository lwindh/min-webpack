const renderTemplate = (template, data) => {
  const reg = /\{\{(\w+)\}\}/
  if (reg.test(template)) {
    const name = reg.exec(template)[1]
    template = template.replace(reg, data[name])
    return renderTemplate(template, data)
  }
  return template
}

console.log(
  renderTemplate('Hello {{your_name}}, I am {{name}}.', {
    name: 'Li Hong',
    your_name: 'Wang Yao',
  })
)
