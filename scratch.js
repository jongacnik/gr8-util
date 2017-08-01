var util = require('.')

var css = util({
  prop: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    { 
      mx: ['margin-left', 'margin-right']
    },
    { 
      my: ['margin-top', 'margin-bottom']
    }
  ],
  vals: [ 0, 1, 'auto' ],
  unit: 'rem'
})

console.log(css)