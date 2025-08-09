# `@tenoxui/plugin-moxie`

A complete starter plugin for TenoxUI with rich and ready-to-use features you ever need.

**functional utilities & variants** for creating complex rules, **arbitrary value & variant support**, **important mark**, **default data to css transformer**, and many more amazing features is ready to use for your new project!

## Installation

To use this plugin, you also need to install `@tenoxui/core@3+` :

```bash
npm i @tenoxui/core@3 @tenoxui/plugin-moxie
```

## Usage Example

```javascript
import { TenoxUI } from '@tenoxui/core'
import { Moxie } from '@tenoxui/plugin-moxie'

const ui = new TenoxUI({
  utilities: {
    moxie: {
      bg: 'background',
      m: ({ value }) => ({ margin: value * 0.25 + 'rem' })
    }
  },
  variants: {
    hover: '&:hover',
    max: ({ value }) => `@media (max-width: ${value}) { @slot }`
  },
  plugins: [Moxie()]
})

console.log(ui.process('bg-red hover:bg-blue max-554px:m-10'))
```

Output :

```javascript
[
  {
    use: 'moxie',
    className: 'bg-red',
    rules: { property: 'background', value: 'red' },
    variant: null,
    isImportant: false,
    raw: ...
  },
  {
    use: 'moxie',
    className: 'hover:bg-blue',
    rules: { property: 'background', value: 'blue' },
    variant: '&:hover',
    isImportant: false,
    raw: ...
  },
  {
    use: 'moxie',
    className: 'max-554px:m-10',
    rules: { margin: '2.5rem' },
    variant: '@media (max-width: 554px) { @slot }',
    isImportant: false,
    raw: ...
  }
]
```

## LICENSE

MIT 2025-present TenoxUI
