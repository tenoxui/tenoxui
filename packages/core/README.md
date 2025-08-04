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
  },
  variants: {
    hover: '&:hover'
  }
})

console.log(ui.process('m-10px m-1rem bg-red hover:bg-blue'))
```

Output :

```javascript
;[
  {
    className: 'm-10px',
    property: 'margin',
    value: '10px',
    variant: null,
    raw: ['m-10px', undefined, 'm', '10px']
  },
  {
    className: 'm-1rem',
    property: 'margin',
    value: '1rem',
    variant: null,
    raw: ['m-1rem', undefined, 'm', '1rem']
  },
  {
    className: 'bg-red',
    property: 'background',
    value: 'red',
    variant: null,
    raw: ['bg-red', undefined, 'bg', 'red']
  },
  {
    className: 'hover:bg-blue',
    property: 'background',
    value: 'blue',
    variant: '&:hover',
    raw: ['hover:bg-blue', 'hover', 'bg', 'blue']
  }
]
```

## License

MIT © 2025-present
