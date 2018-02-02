var isPlainObj = require('is-plain-obj')
var isNumber = require('is-number')
var flatten = require('arr-flatten')
var ov = require('object-values')

module.exports = gr8util

function gr8util (opts) {
  if (opts.raw) {
    return getRawRulesets({
      entries: opts.raw,
      parent: opts.parent,
      tail: opts.tail,
      selector: opts.selector || (s => `.${s}`)
    })
  } else {
    return getRulesets({
      prefixes: getKeys(opts.prop, i => abbreviations(i)),
      properties: getValues(opts.prop),
      suffixes: getKeys(opts.vals, i => safeAbbreviate(i), j => dedecimal(j)),
      values: getValues(opts.vals, undefined, opts.transform),
      modifierPrefixes: getKeys(opts.modifiers, i => safeAbbreviate(i), j => prependHyphen(j)),
      modifierSuffixes: getValues(opts.modifiers),
      parent: opts.parent,
      join: opts.join,
      tail: opts.tail,
      unit: opts.unit,
      selector: opts.selector || (s => `.${s}`)
    })
  }
}

function getKeys (input, transformRaw, transform) {
  return processOption(Object.keys, input, transformRaw, transform)
}

function getValues (input, transformRaw, transform) {
  return processOption(ov, input, transformRaw, transform)
}

function processOption (method, input, transformRaw, transform) {
  transformRaw = transformRaw || (i => i)
  transform = transform || (j => j)
  var values = isPlainObj(input)
    ? method(input)
    : ensureArray(input).map(i => {
      return isPlainObj(i)
        ? method(i)[0]
        : transformRaw(i)
    })
  return values.map(v => transform(v))
}

function getRulesets (opts) {
  var rulesets = opts.prefixes.map(function (prefix, i) {
    return opts.values.map(function (value, j) {
      return opts.modifierPrefixes.map(function (modifier, k) {
        var selector = opts.selector(classname(prefix, opts.suffixes[j], opts.join, modifier))
        var declaration = declarations(opts.properties[i], value, opts.unit)
        return ruleset(
          selector,
          declaration,
          opts.modifierSuffixes[k],
          opts.tail,
          opts.parent
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
      null,
      opts.tail,
      opts.parent
    )
  })

  return flatten(rulesets).join('\n')
}

function dedecimal (input) {
  return isFinite(String(input)) ? String(input).replace('.', '-') : input
}

function abbreviate (input) {
  return String(input).split('-').map(word => (word.match(/[a-zA-Z]/) || []).pop()).join('')
}

// only abbreviate if truthy or non number
function safeAbbreviate (input) {
  return input && !isFinite(String(input)) ? abbreviate(input) : input
}

function abbreviations (input) {
  return ensureArray(input).map(i => abbreviate(i)).join('')
}

function prependHyphen (input) {
  return input ? '-' + input : input
}

function ensureArray (input) {
  return Array.isArray(input) ? input : [ input ]
}

function declarations (properties, value, unit) {
  return ensureArray(properties)
    .map(property => declaration(property, value, unit)).join(';')
}

function ruleset (selector, declaration, modifier, tail, parent) {
  return `${parent ? parent + ' ' : ''}${selector}${modifier || ''}${tail || ''}{${declaration}}`
}

function classname (prefix, suffix, join, modifier) {
  return `${prefix}${join || ''}${suffix}${modifier || ''}`
}

function declaration (property, value, unit) {
  return `${property}:${value}${(value && isNumber(value) && unit) || ''}`
}
