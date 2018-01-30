var isPlainObj = require('is-plain-obj')
var isNumber = require('is-number')
var flatten = require('arr-flatten')
var ov = require('object-values')

module.exports = gr8util

function gr8util (opts) {
  if (opts.raw) {
    return getRawRulesets({
      entries: opts.raw,
      tail: opts.tail,
      selector: opts.selector || (s => `.${s}`)
    })
  } else {
    return getRulesets({
      prefixes: getPrefixes(opts.prop),
      properties: getProperties(opts.prop),
      suffixes: getSuffixes(opts.vals),
      values: getValues(opts.vals, opts.transform),
      pseudoPrefixes: getPseudoPrefixes(opts.pseudo),
      pseudoSuffixes: getPseudoSuffixes(opts.pseudo),
      join: opts.join,
      unit: opts.unit,
      tail: opts.tail,
      selector: opts.selector || (s => `.${s}`)
    })
  }
}

function getPrefixes (input) {
  var prefixes = isPlainObj(input)
    ? Object.keys(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? Object.keys(i).pop()
        : abbreviations(i)
    })
  return prefixes
}

function getProperties (input) {
  var properties = isPlainObj(input)
    ? ov(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? ov(i).pop()
        : i
    })
  return properties
}

function getSuffixes (input) {
  if (isPlainObj(input)) {
    return Object.keys(input).map(i => dedecimalOrAbbreviate(i, false))
  } else {
    return ensureArray(input).map(i => {
      return isPlainObj(i)
        ? dedecimalOrAbbreviate(Object.keys(i).pop(), false)
        : dedecimalOrAbbreviate(i, true)
    })
  }
}

function getValues (input, transform) {
  transform = transform || (i => i)
  var values = isPlainObj(input)
    ? ov(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? ov(i).pop()
        : i
    })
  return values.map(i => transform(i))
}

function getPseudoPrefixes (input) {
  if (!input) return [false]
  var prefixes = isPlainObj(input)
    ? Object.keys(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? Object.keys(i).pop()
        : abbreviate(i)
    })
  return prefixes
}

function getPseudoSuffixes (input) {
  if (!input) return [false]
  var suffixes = isPlainObj(input)
    ? ov(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? ov(i).pop()
        : i
    })
  return suffixes
}

function getRulesets (opts) {
  var rulesets = opts.prefixes.map(function (prefix, i) {
    return opts.values.map(function (value, j) {
      return opts.pseudoPrefixes.map(function (pseudo, k) {
        return ruleset(
          opts.selector(classname(prefix, opts.suffixes[j], opts.join, pseudo)),
          declarations(opts.properties[i], value, opts.unit),
          opts.pseudoSuffixes[k],
          opts.tail
        )
      })
    })
  })

  return flatten(rulesets).join('\n')
}

function getRawRulesets (opts) {
  var rulesets = Object.keys(opts.entries).map(function (s) {
    return ruleset(
      opts.selector(s),
      opts.entries[s],
      opts.tail
    )
  })

  return flatten(rulesets).join('\n')
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

function ruleset (selector, declaration, pseudo, tail) {
  return `${selector}${pseudo ? ':' + pseudo : ''}${tail || ''}{${declaration}}`
}

function classname (prefix, suffix, join, pseudo) {
  return `${prefix}${join || ''}${suffix}${pseudo ? '-' + pseudo : ''}`
}

function declaration (property, value, unit) {
  return `${property}:${value}${(value && isNumber(value) && unit) || ''}`
}
