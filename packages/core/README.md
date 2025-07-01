# `@tenoxui/core`

`@tenoxui/core` is a core components of TenoxUI that responsible for class name parsing, creating utility shorthands, skeleton data of CSS rules, variants processing and many more.

## Installation

```bash
npm i @tenoxui/core
```

## Usage Example

```javascript
import { TenoxUI } from '@tenoxui/core'

const css = new TenoxUI({
  property: {
    bg: 'background',
    m: ({ value }) => `margin: ${value * 0.25 + 'rem'}`
  },
  variants: {
    hover: '&:hover'
  }
})

console.log(css.process(['bg-red', 'm-4', '!hover:bg-[rgb(255_0_0)]']))
```

Output :

```javascript
;[
  {
    className: 'bg-red',
    isImportant: false,
    cssRules: 'background',
    value: 'red',
    variants: null,
    raw: [undefined, 'bg', 'red', '', undefined, undefined, 'bg-red']
  },
  {
    className: 'm-4',
    isImportant: false,
    cssRules: 'margin: 1rem',
    value: null,
    variants: null,
    raw: [undefined, 'm', '4', '', undefined, undefined, 'm-4']
  },
  {
    className: '\\!hover\\:bg-\\[rgb\\(255_0_0\\)\\]',
    isImportant: true,
    cssRules: 'background',
    value: 'rgb(255 0 0)',
    variants: { name: 'hover', data: '&:hover' },
    raw: ['hover', 'bg', '[rgb(255_0_0)]', '', undefined, undefined, 'hover:bg-[rgb(255_0_0)]']
  }
]
```

## License

MIT © 2024-present
