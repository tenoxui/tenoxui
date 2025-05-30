# TenoxUI

TenoxUI is JavaScript library for creating extensible, flexible, and highly customized, **utility-first CSS framework**.

## Installation

```bash
npm install tenoxui
```

## Example Usage

```javascript
import { TenoxUI } from 'tenoxui'

const css = new TenoxUI({
  property: {
    bg: 'background',
    m: 'margin',
    p: ({ value }) => `padding: ${value * 0.25 + 'rem'}`
  },
  variants: {
    hover: '&:hover',
    dark: '@media (prefers-color-scheme: dark)'
  },
  breakpoints: {
    md: '48rem'
  }
})

console.log(
  css.render([
    'bg-red',
    'm-10px',
    'p-4',
    'p-3.5',
    'hover:bg-#ccf654',
    'dark:bg-[rgb(255_0_0)]',
    'md:bg-blue',
    'max-md:m-3.5rem'
  ])
)
```

Output :

```css
.bg-red {
  background: red;
}
.m-10px {
  margin: 10px;
}
.p-4 {
  padding: 1rem;
}
.p-3\.5 {
  padding: 0.875rem;
}
.hover\:bg-\#ccf654:hover {
  background: #ccf654;
}
@media (prefers-color-scheme: dark) {
  .dark\:bg-\[rgb\(255_0_0\)\] {
    background: rgb(255 0 0);
  }
}
@media (width >= 48rem) {
  .md\:bg-blue {
    background: blue;
  }
}
@media (width < 48rem) {
  .max-md\:m-3\.5rem {
    margin: 3.5rem;
  }
}
```

## License

MIT © 2024-Present
