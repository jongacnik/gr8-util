var util = require('./')

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

console.log(util(simple))