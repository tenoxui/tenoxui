# TenoxUI

TenoxUI is JavaScript library for creating extensible, flexible, and highly customized, **utility-first CSS framework engine**.

## Overview

```javascript
import { TenoxUI } from '@tenoxui/moxie'

const ui = new TenoxUI({
  property: {
    bg: 'background',
    m: 'margin'
  }
})

// process class names
console.log(
  ui.process(['bg-red', 'hover:bg-blue', 'focus:bg-[rgb(255_0_0)]', 'm-12px', '[padding]-1rem'])
)
```

Output :

```javascript
;[
  {
    className: 'bg-red',
    cssRules: 'background',
    value: 'red',
    prefix: undefined,
    raw: [undefined, 'bg', 'red', '', undefined, undefined, 'bg-red']
  },
  {
    className: 'bg-blue',
    cssRules: 'background',
    value: 'blue',
    prefix: 'hover',
    raw: ['hover', 'bg', 'blue', '', undefined, undefined, 'hover:bg-blue']
  },
  {
    className: 'bg-[rgb(255_0_0)]',
    cssRules: 'background',
    value: 'rgb(255 0 0)',
    prefix: 'focus',
    raw: ['focus', 'bg', '[rgb(255_0_0)]', '', undefined, undefined, 'focus:bg-[rgb(255_0_0)]']
  },
  {
    className: 'm-12px',
    cssRules: 'margin',
    value: '12px',
    prefix: undefined,
    raw: [undefined, 'm', '12', 'px', undefined, undefined, 'm-12px']
  },
  {
    className: '[padding]-1rem',
    cssRules: 'padding',
    value: '1rem',
    prefix: undefined,
    raw: [undefined, '[padding]', '1', 'rem', undefined, undefined, '[padding]-1rem']
  }
]
```

## License

MIT © 2024-Present
