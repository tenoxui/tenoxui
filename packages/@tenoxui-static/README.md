# `@tenoxui/static`

This package contains CSS rule generator if you don't want to use `inline-style` approach. Recommended for build.

## Installation

```bash
npm i @tenoxui/static
```

### Usage

```javascript
import { TenoxUI } from '@tenoxui/static'
// usage
// new TenoxUI(config)

// example
const tenoxui = new TenoxUI({
  property: {
    bg: 'background'
  }
})

// process the class names and include them to be processed later
tenoxui.processClassNames(['bg-red', 'bg-green'])

const stylesheet = tenoxui.generateStylesheet()

console.log(stylesheet)

/* Output :
.bg-red { background: red }
.bg-yellow { background: yellow }
*/
```

## Configuration Options

```javascript
new TenoxUI({
  property: {},
  values: {},
  classes: {},
  aliases: {},
  breakpoints: [],
  reserveClass: [],
  apply: {}
})
```

You can read documentation for `property`, `values`, `classes`, `aliases`, and `breakpoints` on the [main README.md](https://github.com/tenoxui/tenoxui)

### `reserveClass`

Reserve any class names to include on the output :

```javascript
export default {
  property: {
    bg: 'background'
  },
  reserveClass: ['bg-red', 'bg-yellow']
}
```

Output :

```css
.bg-red {
  background: red;
}
.bg-yellow {
  background: yellow;
}
```

### `apply`

`apply` is where you can add custom css selector, or even stacking them like regular CSS. Same as `reserveClass` field, all of the rules inside `apply` will included in the output. Example :

```javascript
export default {
  property: {
    bg: 'background',
    text: 'color'
  },
  apply: {
    ':root': '[--black]-#000 [--white]-#fff',
    body: 'bg-$white text-$black',
    '@media (prefers-color-scheme: dark)': {
      ':root': '[--white]-#000 [--black]-#fff'
    }
  }
}
```

Output :

```css
:root {
  --black: #000;
  --white: #fff;
}
body {
  background: var(--white);
  color: var(--black);
}
@media (prefers-color-scheme: dark) {
  :root {
    --white: #000;
    --black: #fff;
  }
}
```
