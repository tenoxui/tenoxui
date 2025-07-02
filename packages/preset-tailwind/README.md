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

const css = new TenoxUI(preset())

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

## Exports

```javascript
import {
  preset,
  defaultProperties,
  preflight,
  property,
  values,
  classes,
  variants,
  breakpoints,
  typeOrder
} from '@tenoxui/preset-tailwind'
```

### `preset`

A function for building the configuration. Returns final configuration that is ready to use (`property`, `values`, `classes`, `breakpoints`, `variants`, and `typeOrder`). Usage :

```javascript
new TenoxUI(preset())
```

### `defaultProperties` and `preflight`

Both of them are the tailwindcss style **resetter**. `preflight` is selector-class paired object that you can use to generate tailwindcss preflight. On the other hand, `defaultProperties` will store all the necessary `initial value` to enhance tailwindcss functionality. Usage :

```javascript
const css = new TenoxUI(preset())

css.render(
  // include the resetter here
  defaultProperties,
  preflight,
  // add you class names
  ['text-red-500', 'flex', 'shadow-md']
)
```

### `property` and `classes`

A big chunk object that stores all of the utilities that you can use. `property` is the main rules for **dynamic** rules, like utility that needs to compute value, deciding where to put those input CSS value, like `text-{length|color}`. While the `classes` stores **static** utilities that not needed any input value, like `inline-block`, etc. Usage :

```javascript
import { property, classes } from '@tenoxui/preset-tailwind'

const css = new TenoxUI({
  property: property(0.25 /* default sizing value */),
  classes
})

css.render(
  // start writing your class names
  ['text-red-500', 'flex', 'shadow-md']
)
```

### `variants`, `breakpoints`, `values`, and `typeOrder`

Other ready-to-ise TenoxUI configuration you can use. Maybe you want to use only `variants` from this pacakge, you can import this instead the whole preset. Example :

```javascript
import { variants, values, breakpoints } from '@tenoxui/preset-tailwind'

const css = new TenoxUI({
  values,
  variants,
  breakpoints,
  property: {
    bg: 'background'
  }
})
```

> The `typeOrder` variable can't be used outside the preset, because this variable stores the order list of the utilities, like `flex` utility should be generated before `bg` utility.

## License

MIT
