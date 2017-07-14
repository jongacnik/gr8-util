var objectValues = require('object-values')
var isPlainObj = require('is-plain-obj')
var flatten = require('arr-flatten')
var ruleset = require('gr8-rule')

/**
 * Todo
 *
 * - [ ] Tests
 * - [ ] Determine if keep transform
 * - [ ] Determine if tail correct name
 * - [ ] Determine if classes only
 */

module.exports = gr8util

function gr8util (opts) {
  return getRulesets({
    prefixes: getPrefixes(opts.prop),
    properties: getProperties(opts.prop),
    suffixes: getSuffixes(opts.vals),
    values: getValues(opts.vals, opts.transform),
    join: opts.join,
    unit: opts.unit,
    tail: opts.tail
  })
}

function getPrefixes (input) {
  var prefixes = isPlainObj(input) 
    ? Object.keys(input) 
    : ensureArray(input).map(i => abbreviations(i))
  return prefixes
}

function getProperties (input) {
  var properties = isPlainObj(input) ? objectValues(input) : ensureArray(input)
  return properties
}

function getSuffixes (input) {
  var suffixes = isPlainObj(input) ? Object.keys(input) : ensureArray(input)
  var shouldAbbreviate = !isPlainObj(input)
  return suffixes.map(i => dedecimalOrAbbreviate(i, shouldAbbreviate))
}

function getValues (input, transform = i => i) {
  var values = isPlainObj(input) ? objectValues(input) : ensureArray(input)
  return values.map(i => transform(i))
}

function getRulesets (opts) {
  var rulesets = opts.prefixes.map(function (prefix, i) {
    return opts.values.map(function (value, j) {
      return ruleset(
        classname(prefix, opts.suffixes[j], opts.join, opts.tail),
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

function dedecimalOrAbbreviate (input, shouldAbbreviate) {
  return isFinite(String(input)) 
    ? dedecimal(input)
    : (shouldAbbreviate ? abbreviate(input) : input)
}

function ensureArray (input) {
  return Array.isArray(input) ? input : [ input ]
}

function abbreviations (input) {
  return ensureArray(input).map(i => abbreviate(i)).join('')
}

function declarations (properties, value, unit) {
  return ensureArray(properties)
    .map(property => declaration(property, value, unit)).join(';')
}

function classname (prefix, suffix, join, append) {
  return `${prefix}${join || ''}${suffix}${append || ''}`
}

function declaration (property, value, unit) {
  return `${property}:${value}${value && unit || ''}`
}