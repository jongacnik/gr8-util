var flatten = require('arr-flatten')
module.exports = util

var test = {
  prop: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left'
  ],
  vals: [
    0,
    1,
    2
  ],
  unit: 'rem'
}

function util (opts) {
  var styles = opts.prop.map(function (p) {
    return opts.vals.map(function (v) {
      return ruleset({
        classname: classname(abbreviate(p), v),
        property: p,
        value: value(v, opts.unit)
      })
    })
  })

  return flatten(styles).join("\n")
}

function abbreviate (str) {
  return str.split('-').map(function (word) {
    return word[0]
  }).join('')
}

function classname (prefix, suffix, joinwith = '') {
  return `${prefix}${joinwith}${suffix}`
}

function value (val, unit) {
  return `${val}${val && unit || ''}`
}

function ruleset (classname, property, value) {
  return `.${classname}{${property}:${value}}`
}

console.log(gr8(test))