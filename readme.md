<h1 align="center">gr8-util</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/gr8-util">
    <img src="https://img.shields.io/npm/v/gr8-util.svg?style=flat-square" alt="NPM version" />
  </a>
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="NPM version" />
  </a>
</div>

<br />

A little function for generating functional css utilities.

## Usage

Given some options, `gr8-util` returns a string of css utilities. It does its best to generate concise and logical css selectors.

```js
var util = require('gr8-util')

var css = util({
  prop: 'display',
  vals: [
    'block',
    'inline-block',
    'inline',
    'table',
    'table-cell',
    'table-row',
    'flex',
    'none'
  ]
})

console.log(css)
```

```css
.db{display:block}
.dib{display:inline-block}
.di{display:inline}
.dt{display:table}
.dtc{display:table-cell}
.dtr{display:table-row}
.df{display:flex}
.dn{display:none}
```

## API

### `css = util([opts])`

Generate a string of css utility rules. `opts` accepts the following values:

- `opts.prop` **[String | Array | Object]** css property(ies) ***required**
- `opts.vals` **[Number | String | Array | Object]** css values ***required**
- `opts.modifiers` **[String | Array | Object]** selector modifier(s)
- `opts.unit` **[String]** unit to append to css values (only appended if values are numeric)
- `opts.tail` **[String]** string to append after selector
- `opts.join` **[String]** string to join abbreviation and value in selector
- `opts.selector` **[Function]** css selector template function
- `opts.transform` **[Function]** value transform function
- `opts.parent` **[String]** global parent selector

## Examples

These examples are primarily to demonstrate how options are used to generate a wide variety of css utilities. They are not necessarily very useful css utilities themselves.

---

Most basic, single `prop` and single `vals`

```js
var css = util({
  prop: 'opacity',
  vals: 0
})
```

```css
.op0{opacity:0}
```

---

Use an array as `prop` and `vals`, as well as define `unit`. Notice how floating point values are sanitized in generated selector (decimal replaced with hyphen), and how unit is not appended to a value of 0.

```js
var css = util({
  prop: [
    'margin',
    'padding'
  ],
  vals: [
    0,
    0.5,
    1
  ],
  unit: 'rem'
})
```

```css
.m0{margin:0}
.m0-5{margin:0.5rem}
.m1{margin:1rem}
.p0{padding:0}
.p0-5{padding:0.5rem}
.p1{padding:1rem}
```

---

Use an object as `prop` and `vals` in order to override generated abbreviations. Define `join` to add things like hyphens to selectors.

```js
var css = util({
  prop: {
    bgc: 'background-color'
  },
  vals: {
    red: '#f00'
  },
  join: '-'
})
```

```css
.bgc-red{background-color:#f00}
```

---

Use a nested array as `prop` in order to generate rules with multiple properties. Notice how [kebab-case](https://softwareengineering.stackexchange.com/questions/104468/if-this-is-camelcase-what-is-this) properties are abbreviated in selector.

```js
var css = util({
  prop: [
    ['margin-left', 'margin-right']
  ],
  vals: 1,
  unit: 'rem'
})
```

```css
.mlmr1{margin-left:1rem;margin-right:1rem}
```

---

Use an array which contains both strings and key/val objects as `prop` in order to override only specific abbreviations.

```js
var css = util({
  prop: [ 
    'margin',
    'margin-right',
    'margin-left',
    { mx: ['margin-left', 'margin-right'] }
  ],
  vals: 1,
  unit: 'rem'
})
```

```css
.m1{margin:1rem}
.mr1{margin-right:1rem}
.ml1{margin-left:1rem}
.mx1{margin-left:1rem;margin-right:1rem}
```

---

Do the same as previous example with `vals` as well.

```js
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
```

```css
.xw{flex-wrap:wrap}
.xwr{flex-wrap:wrap-reverse}
.xwn{flex-wrap:nowrap}
```

---

Pass a function to `selector` in order to create selectors other than class selectors. Function receives the generated *selector name* as input and should return a [css selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as a string.

```js
var css = util({
  prop: 'display',
  vals: 'block',
  selector: s => `[data-util~="${s}"]`
})
```

```css
[data-util~="db"]{display:block}
```

---

Use `modifiers` in order to generate rules for things like [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes), [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements), and [descendant selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors). Exceptionally useful for hover states.

```js
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
```

```css
.ttu-h:hover{text-transform:uppercase}
.ttu-a:active{text-transform:uppercase}
.ttu-foc:focus{text-transform:uppercase}
.ttl-h:hover{text-transform:lowercase}
.ttl-a:active{text-transform:lowercase}
.ttl-foc:focus{text-transform:lowercase}
```

Passing `false` to modifiers generates rules without a modifier. This is useful for concisely creating sets of rules:

```js
var css = util({
  prop: { fc: 'color' },
  vals: [
    'red',
    'blue',
    'green'
  ],
  modifiers: [
    false,
    ':hover'
  ]
})
```

```css
.fcr{color:red}
.fcr-h:hover{color:red}
.fcb{color:blue}
.fcb-h:hover{color:blue}
.fcg{color:green}
.fcg-h:hover{color:green}
```

---

Use `tail` in order to append an arbitrary string to a selector. Useful when adding things like pseudo-classes which do not need a modifier in the classname.

```js
var css = util({
  raw: {
    cf: 'content:"";display:block;clear:both'
  },
  tail: ':after'
})
```

```css
.cf:after{content:"";display:block;clear:both}
```

---

Use `transform` in order to transform values as they are placed into declarations. Useful for things like columns:

```js
var css = util({
  prop: {
    c: 'width'
  },
  vals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  unit: '%',
  transform: i => (i / 12) * 100
})
```

```css
.c1{width:8.333333333333332%}
.c2{width:16.666666666666664%}
.c3{width:25%}
.c4{width:33.33333333333333%}
.c5{width:41.66666666666667%}
.c6{width:50%}
.c7{width:58.333333333333336%}
.c8{width:66.66666666666666%}
.c9{width:75%}
.c10{width:83.33333333333334%}
.c11{width:91.66666666666666%}
.c12{width:100%}
```

---

Use `parent` in order to namespace your rules. Useful for conditional utilities:

```js
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
```

```css
.no-touch .fcr-h:hover{color:red}
.no-touch .fcb-h:hover{color:blue}
.no-touch .fcg-h:hover{color:green}
```

## Why

Provides consistency and flexibility when generating functional css utility systems, such as [gr8](https://github.com/jongacnik/gr8).

## Todo

- [ ] Defaults
- [ ] Assertions

## See Also

- [gr8](https://github.com/jongacnik/gr8)

## License

[MIT](https://github.com/jongacnik/gr8-util/blob/master/LICENSE)
