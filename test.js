var util = require('./')
var ruleset = require('./ruleset')
var ofe = require('object-from-entries')

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

var simple = {
  prop: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    ['margin-left', 'margin-right']
  ],
  vals: [1, 2, 3],
  unit: 'rem',
  tail: ':after'
}

var columns = {
  prop: { c: 'width' },
  vals: ofe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(v => [v, v / 12 * 100])),
  unit: '%'
}

// var columns = {
//   prop: { c: 'width' },
//   vals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   transform: i => i / 12 * 100,
//   unit: '%'
// }

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

var aspectRatio = [50, 100].map(v => ruleset(`ar${v}:after`, `content:"";display:block;padding-top:${v}${v && '%' || ''}`))

var plain = ruleset('dev', 'outline:1px solid red')

console.log(util(simple))