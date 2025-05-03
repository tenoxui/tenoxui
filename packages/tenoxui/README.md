# TenoxUI

**TenoxUI** is JavaScript library for creating highly customized, flexible, and extensible **utility-first CSS framework**.

## Installation

```bash
npm i tenoxui
```

## Basic Usage

```javascript
import { TenoxUI } from 'tenoxui'

const css = new TenoxUI({
  property: {
    // single css property
    bg: 'background',

    // single css variable
    'my-var': '--my-var',

    // multiple css properties
    size: ['width', 'height'],

    // custom value property
    m: {
      property: 'margin',
      value: '{0}px'
    },

    // specific value
    d: {
      property: 'display',
      value: ['flex', 'grid', 'block', 'inline-block', 'none']
    },

    // direct value
    p: ({ value, unit }) => `padding: ${value + (unit || 'px')}`
  }
})

console.log(
  css
    .render([
      'bg-red',
      'my-var-blue',
      'size-40px',
      'm-5',
      'd-inline-block',
      'd-inline-flex', // ignored
      'p-4',
      'p-4px',
      'p-4rem'
    ])
    .join('\n')
)
```

Output :

```css
.bg-red {
  background: red;
}
.size-40px {
  width: 40px;
  height: 40px;
}
.m-5 {
  margin: 5px;
}
.p-4 {
  padding: 4px;
}
.p-4px {
  padding: 4px;
}
.p-4rem {
  padding: 4rem;
}
```

## Documentation

Check out clear and complete documentation [here](https://tenoxui.web.app).

## License

MIT © 2023-present NOuSantx
