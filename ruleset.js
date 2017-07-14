module.exports = function ruleset (classname, declaration) {
  return `.${classname}{${declaration}}`
}