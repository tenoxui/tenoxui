# `@tenoxui/core`

`@tenoxui/core` is a core components of TenoxUI that responsible for class name parsing, creating utility shorthands, skeleton data of CSS rules, variants processing and many more.

## Installation

```bash
npm i @tenoxui/core
```

## Usage Example

```javascript
const ui = new TenoxUI({
  utilities: {
    m: 'margin',
    bg: 'background'
  }
})

console.log(ui.process('m-10px m-1rem bg-red hover:bg-blue'))
```

Output :

```javascript
;[
  {
    className: 'm-10px',
    variant: null,
    rules: { type: 'm', property: 'margin' },
    value: { raw: '10px', data: '10px' }
  },
  {
    className: 'm-1rem',
    variant: null,
    rules: { type: 'm', property: 'margin' },
    value: { raw: '1rem', data: '1rem' }
  },
  {
    className: 'bg-red',
    variant: null,
    rules: { type: 'bg', property: 'background' },
    value: { raw: 'red', data: 'red' }
  },
  {
    className: 'hover:bg-blue',
    variant: { name: 'hover', data: null },
    rules: { type: 'bg', property: 'background' },
    value: { raw: 'blue', data: 'blue' }
  }
]
```

## License

MIT © 2025-present
