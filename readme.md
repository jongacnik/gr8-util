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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .op0{opacity:0}
  ```

</details>

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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .m0{margin:0}
  .m0-5{margin:0.5rem}
  .m1{margin:1rem}
  .p0{padding:0}
  .p0-5{padding:0.5rem}
  .p1{padding:1rem}
  ```

</details>

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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .bgc-red{background-color:#f00}
  ```

</details>

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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .mlmr1{margin-left:1rem;margin-right:1rem}
  ```

</details>

---

Use a nested array as `prop` within an object to override abbreviation.

```js
var css = util({
  prop: { 
    mx: ['margin-left', 'margin-right']
  },
  vals: 1,
  unit: 'rem'
})
```

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .mx1{margin-left:1rem;margin-right:1rem}
  ```

</details>

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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .m1{margin:1rem}
  .mr1{margin-right:1rem}
  .ml1{margin-left:1rem}
  .mx1{margin-left:1rem;margin-right:1rem}
  ```

</details>

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

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .xw{flex-wrap:wrap}
  .xwr{flex-wrap:wrap-reverse}
  .xwn{flex-wrap:nowrap}
  ```

</details>

---

Pass a function to `selector` in order to create selectors other than class selectors. Function receives the generated *selector name* as input and should return a [css selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as a string.

```js
var css = util({
  prop: 'display',
  vals: 'block',
  selector: s => `[data-util~="${s}"]`
})
```

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  [data-util~="db"]{display:block}
  ```

</details>

---

Use `tail` in order to append an arbitrary string to a selector. Exceptionally useful for [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) or [descendant selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors).

```js
var css = util({
  prop: 'display',
  vals: 'block',
  tail: ':after'
})
```

<details>
  <summary><strong>view generated css</strong></summary>

  ```css
  .db:after{display:block}
  ```

</details>

## Why

Provides consistency and flexibility when generating functional css utility systems, such as [gr8]().

## Todo

- [ ] Docs
- [ ] Defaults
- [ ] Assertions
- [ ] Remove `=>` functions

## See Also

- ~~[postcss-gr8-util]()~~
- ~~[postcss-gr8]()~~
- [gr8]()
- ~~[gr8-tachyons]()~~

## License

[MIT]()