# `@tenoxui/plugin-moxie`

A complete starter plugin for TenoxUI with rich and ready-to-use features you ever need.

**functional utilities & variants** for creating complex rules, **arbitrary value & variant support**, **important mark**, **default data to css transformer**, and many more amazing features is ready to use for your new project!

## Installation

To use this plugin, you also need to install `@tenoxui/core@3+` :

```bash
npm i @tenoxui/core@3 @tenoxui/plugin-moxie
```

## Quick Usage Example

```javascript
import { TenoxUI } from '@tenoxui/core'
import { Moxie, transform } from '@tenoxui/plugin-moxie'

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
  plugins: [Moxie(), { name: 'transform-moxie', transform }]
})

console.log(ui.process('bg-red hover:bg-blue m-10 m-10px max-554px:m-10').rules.join('\n'))
```

Output :

```
.bg-red { background: red }
.hover\:bg-blue:hover { background: blue }
.m-10 { margin: 2.5rem }
.m-10px { margin: 10px }
@media (max-width: 554px) { .max-554px\:m-10 { margin: 2.5rem } }
```

## LICENSE

MIT 2025-present TenoxUI
