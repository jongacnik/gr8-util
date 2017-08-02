# gr8-util

A little function which returns css utility rules

**⚠️ WARNING: Under active development**

## Usage

```js
var util = require('gr8-util')

var display = util({
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

console.log(display)
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
- `opts.tail` **[String]** string to append after selector (useful for pseudo-selectors)
- `opts.selector` **[Function]** css selector template function

## Why

Provides consistency and flexibility when generating css utility systems, such as [gr8]().

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