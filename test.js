var test = require('tape')
var util = require('./')

/**
 * Todo
 *
 * - [ ] Test tail
 * - [ ] Test transform?
 */

test('prop {String}, vals {String}', function (t) {
  var css = util({
    prop: 'display',
    vals: 'block'
  })

  var hasUtil = has('.db{display:block}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('prop {Array}, vals {Array}, unit {String}', function (t) {
  var css = util({
    prop: [
      'margin',
      'padding'
    ],
    vals: [
      0,
      1
    ],
    unit: 'rem'
  })

  var hasUtils = hasAll([
    '.m0{margin:0}',
    '.m1{margin:1rem}',
    '.p0{padding:0}',
    '.p1{padding:1rem}'
  ], css)

  t.ok(hasUtils, css)
  t.end()
})

test('prop {Array}{Array}, vals {Int}, unit {String}', function (t) {
  var css = util({
    prop: [
      ['margin-left', 'margin-right']
    ],
    vals: 1,
    unit: 'rem'
  })

  var hasUtil = has('.mlmr1{margin-left:1rem;margin-right:1rem}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('prop {Object}, vals {Object}, join {String}', function (t) {
  var css = util({
    prop: {
      bgc: 'background-color'
    },
    vals: {
      red: '#f00'
    },
    join: '-'
  })

  var hasUtil = has('.bgc-red{background-color:#f00}', css)

  t.ok(hasUtil, css)
  t.end()
})

// true if every element is truthy
function allTruthy (results) {
  return results.every(function (result) {
    return result
  })
}

// true if string contains substring
function has (substr, str) {
  return str.indexOf(substr) > -1
}

// true if string contains all substrings
function hasAll (substrs, str) {
  return allTruthy(substrs.map(function (substr) {
    return has(substr, str)
  }))
}