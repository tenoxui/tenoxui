# `@tenoxui/preset-tailwind`

> This package provides TailwindCSS preset configurations for TenoxUI. It is not affiliated with, endorsed by, or sponsored by Tailwind Labs Inc. "Tailwind" and "TailwindCSS" are trademarks of Tailwind Labs Inc.

A ready-to-use TailwindCSS (v4.1.5) preset for TenoxUI. For TailwindCSS documentation, please visit the official [TailwindCSS Website](https://tailwindcss.com).

## Disclaimer

TailwindCSS is developed by [Tailwind Labs Inc](https://tailwindcss.com). This package implements compatible preset configurations but is not an official TailwindCSS product.

## Installation

```bash
npm i tenoxui @tenoxui/preset-tailwind
```

## Usage Example

```javascript
import { TenoxUI } from 'tenoxui'
import { preset } from '@tenoxui/preset-tailwind'

const css = new TenoxUI({ ...preset() })

console.log(css.render(['bg-red-500', 'mt-4', 'md:p-10']))
```

You should get this output :

```css
.bg-red-500 {
  background-color: oklch(63.7% 0.237 25.331);
}
.mt-4 {
  margin-top: 1rem;
}
@media (width >= 48rem) {
  .md\:p-10 {
    padding: 2.5rem;
  }
}
```

## License

MIT
