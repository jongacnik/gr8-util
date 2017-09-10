# gr8-util

**⚠️ Work in progress...**

A little function for generating functional css utilities.

## Usage

Given some options, `gr8-util` returns a string of css utilites. It does its best to generate concise and logical css selectors.

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
- `opts.vals` **[String | Array | Object]** css values ***required**
- `opts.unit` **[String]** unit to append to css values (only appended if values are numeric)
- `opts.tail` **[String]** string to append after selector
- `opts.join` **[String]** string to join abbreviation and value in selector
- `opts.selector` **[Function]** css selector template function
- `opts.transform` **[Function]** value transform function

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

Use `tail` in order to append an arbitrary string to a selector. Exceptionally useful for [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) or [descendant selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors).

```js
var css = util({
  prop: 'display',
  vals: 'block',
  tail: ':after'
})
```

```css
.db:after{display:block}
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

## Why

Provides consistency and flexibility when generating functional css utility systems, such as [gr8](https://github.com/jongacnik/gr8).

## Todo

- [ ] Docs
- [ ] Defaults
- [ ] Assertions
- [ ] Remove `=>` functions

## See Also

- [gr8](https://github.com/jongacnik/gr8)
- ~~[gr8-tachyons]()~~

## License

[MIT](https://github.com/jongacnik/gr8-util/blob/master/LICENSE)
