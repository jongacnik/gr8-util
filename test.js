var test = require('tape')
var util = require('./')

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

test('prop {Array}{Obj}, vals {Int}, unit {String}', function (t) {
  var css = util({
    prop: [
      {
        mx: ['margin-left', 'margin-right']
      }
    ],
    vals: 1,
    unit: 'rem'
  })

  var hasUtil = has('.mx1{margin-left:1rem;margin-right:1rem}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('prop {Obj}, vals {Array}{Obj}, unit {String}', function (t) {
  var css = util({
    prop: {
      x: 'flex-wrap'
    },
    vals: [
      'wrap',
      'wrap-reverse',
      { wn: 'nowrap' }
    ]
  })

  var hasUtils = hasAll([
    '.xw{flex-wrap:wrap}',
    '.xwr{flex-wrap:wrap-reverse}',
    '.xwn{flex-wrap:nowrap}'
  ], css)

  t.ok(hasUtils, css)
  t.end()
})

test('prop {String}, vals {String}, selector {Function}', function (t) {
  var css = util({
    prop: 'display',
    vals: 'block',
    selector: s => `[data-md~="${s}"]`
  })

  var hasUtil = has('[data-md~="db"]{display:block}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('prop {String}, vals {String}, tail {String}', function (t) {
  var css = util({
    prop: 'display',
    vals: 'block',
    tail: ':after'
  })

  var hasUtil = has('.db:after{display:block}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('transform {Function}', function (t) {
  var css = util({
    prop: {
      c: 'width'
    },
    vals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    unit: '%',
    transform: i => (i / 12) * 100
  })

  var hasUtil = has('.c6{width:50%}', css)

  t.ok(hasUtil, css)
  t.end()
})

test('raw', function (t) {
  var css = util({
    raw: {
      'trans-center-x': 'left:50%;transform:translateX(-50%)',
      'trans-center-y': 'top:50%;transform:translateY(-50%)'
    }
  })

  var hasUtil = hasAll([
    '.trans-center-x{left:50%;transform:translateX(-50%)}',
    '.trans-center-y{top:50%;transform:translateY(-50%)}'
  ], css)

  t.ok(hasUtil, css)
  t.end()
})

test('modifiers', function (t) {
  var css = util({
    prop: 'text-transform',
    vals: [
      'uppercase',
      'lowercase'
    ],
    modifiers: [
      ':hover',
      ':active',
      { foc: ':focus' }
    ]
  })

  var hasUtil = hasAll([
    '.ttu-h:hover{text-transform:uppercase}',
    '.ttu-a:active{text-transform:uppercase}',
    '.ttu-foc:focus{text-transform:uppercase}',
    '.ttl-h:hover{text-transform:lowercase}',
    '.ttl-a:active{text-transform:lowercase}',
    '.ttl-foc:focus{text-transform:lowercase}'
  ], css)

  t.ok(hasUtil, css)
  t.end()
})

test('parent', function (t) {
  var css = util({
    prop: { fc: 'color' },
    vals: [
      'red',
      'blue',
      'green'
    ],
    modifiers: ':hover',
    parent: '.no-touch'
  })

  var hasUtil = hasAll([
    '.no-touch .fcr-h:hover{color:red}',
    '.no-touch .fcb-h:hover{color:blue}',
    '.no-touch .fcg-h:hover{color:green}'
  ], css)

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
