var flatten = require('arr-flatten')
var assert = require('assert')
var objectValues = require('object-values')

/**
 * Todo
 *
 * - [ ] Simple declaration
 * - [ ] After option
 */

module.exports = util

var basic = {
  prop: 'display',
  vals: [
    'flex',
    'block',
    'inline-block',
    'inline',
    'table',
    'table-cell',
    'table-row',
    'none'
  ]
}

var simple = {
  prop: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    ['margin-left', 'margin-right']
  ],
  vals: [
    0,
    1,
    2
  ],
  unit: 'rem'
}

var medium = {
  prop: {
    mgn: 'margin',
    mgnt: 'margin-top',
    mgnr: 'margin-right',
    mgnb: 'margin-bottom',
    mgnl: 'margin-left',
    mx: ['margin-left', 'margin-right']
  },
  vals: {
    n: 0,
    s: 1,
    b: 2
  },
  transform: i => i * 2,
  unit: 'rem',
  join: '-'
}

function util (opts) {
  return getRulesets({
    prefixes: getPrefixes(opts.prop),
    properties: getProperties(opts.prop),
    suffixes: getSuffixes(opts.vals),
    values: getValues(opts.vals, opts.transform),
    join: opts.join,
    unit: opts.unit
  })
}

function getPrefixes (input) {
  var prefixes

  if (typeof input === 'string') {
    prefixes = [ abbreviate(input) ]
  } else if (Array.isArray(input)) {
    prefixes = input.map(i => abbreviations(i))
  } else if (typeof input === 'object') {
    prefixes = Object.keys(input)
  }

  assert.ok(prefixes, 'gr8-util: opts.props should be a string, array, or object')

  return prefixes
}

function getProperties (input) {
  var properties

  if (typeof input === 'string') {
    properties = [ input ]
  } else if (Array.isArray(input)) {
    properties = input
  } else if (typeof input === 'object') {
    properties = objectValues(input)
  }

  assert.ok(properties, 'gr8-util: opts.props should be a string, array, or object')

  return properties
}

function getSuffixes (input) {
  var suffixes

  if (typeof input === 'string' || isFinite(String(input))) {
    suffixes = [ input ]
  } else if (Array.isArray(input)) {
    suffixes = input
  } else if (typeof input === 'object') {
    suffixes = Object.keys(input)
  }

  assert.ok(suffixes, 'gr8-util: opts.vals should be a string, number, array, or object')

  return suffixes.map(i => dedecimalOrAbbreviate(i))
}

function getValues (input, transform = i => i) {
  var values

  if (typeof input === 'string' || isFinite(String(input))) {
    values = [ input ]
  } else if (Array.isArray(input)) {
    values = input
  } else if (typeof input === 'object') {
    values = objectValues(input)
  }

  assert.ok(values, 'gr8-util: opts.vals should be a string, number, array, or object')

  return values.map(i => transform(i))
}

function getRulesets (opts) {
  var rulesets = opts.prefixes.map(function (prefix, i) {
    return opts.values.map(function (value, j) {
      return ruleset(
        classname(prefix, opts.suffixes[j], opts.join),
        declarations(opts.properties[i], value, opts.unit)
      )
    })
  })

  return flatten(rulesets).join("\n")
}

function dedecimal (input) {
  return String(input).replace('.', '-')
}

function abbreviate (input) {
  return String(input).split('-').map(word => word[0]).join('')
}

function dedecimalOrAbbreviate (input) {
  return isFinite(String(input)) ? dedecimal(input) : abbreviate(input)
}

function abbreviations (input) {
  input = Array.isArray(input) ? input : [ input ]
  return input.map(i => abbreviate(i)).join('')
}

function declarations (properties, value, unit) {
  properties = Array.isArray(properties) ? properties : [ properties ]
  return properties.map(property => declaration(property, value, unit)).join(';')
}

function classname (prefix, suffix, joinwith = '') {
  return `${prefix}${joinwith}${suffix}`
}

function declaration (property, value, unit) {
  return `${property}:${value}${value && unit || ''}`
}

function ruleset (classname, declaration) {
  return `.${classname}{${declaration}}`
}

console.log(util(basic))