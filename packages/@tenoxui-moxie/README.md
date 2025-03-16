# `@tenoxui/moxie`

`tenoxui/moxie` is a tiny and lightweight CSS generation engine for creating custom `utility-first` CSS framework easily.

## Features

- **Customize Everything** - `moxie` is very easy to configure, scalable for small and large project easily

- **Utility-First Based** - Support any `utility-first` naming convention you like (`m-2`, `m2`, or `m-2px`)

- **It's Small!** - The bundle itself is less than `4kB gzipped` (currently :D)

## Installation

Get started with `moxie` by running this command :

```bash
npm install @tenoxui/moxie
```

## Usage Example

```javascript
import { TenoxUI } from '@tenoxui/moxie'

const ui = new TenoxUI({
  // defining shorthands
  property: {
    // type: property
    m: 'margin', // basic shorthand
    p: {
      property: 'padding',
      value: ({ value, unit }) =>
        `${!isNaN(value + unit) ? 0.25 * Number(value) + 'rem' : value + unit}`
    }
  }
})

console.log(
  ui.process([
    'm-2px',
    'hover:m-2rem',
    'p-4', // 0.25 * 4 = 1rem
    'p-10px' // direct value
  ])
)

/* Output
[
  {
    className: 'm-2px',
    cssRules: 'margin',
    value: '2px',
    prefix: undefined
  },
  {
    className: 'm-2rem',
    cssRules: 'margin',
    value: '2rem',
    prefix: 'hover'
  },
  {
    className: 'p-4',
    cssRules: 'padding',
    value: '1rem',
    prefix: undefined
  },
  {
    className: 'p-10px',
    cssRules: 'padding',
    value: '10px',
    prefix: undefined
  }
]
*/
```

## API

### Exports

This package only have one main export and some types :

```typescript
// index.d.ts
import type { Config, TenoxUIConfig, ProcessedStyle } from './types'
export * from './types'
export { Config, TenoxUIConfig }
export declare class TenoxUI {
  // ...
}
export default TenoxUI
```

### Constructor

```javascript
export class TenoxUI {
  constructor({ property = {}, values = {}, classes = {} } = {}) {
    this.property = property
    this.values = values
    this.classes = classes
  }
}
```

### Public Methods

#### `parse`

A method for parsing class name.

```typescript
parse(className: string) {}
```

Example :

```javascript
const ui = new TenoxUI({
  m: 'margin',
  p: 'padding'
})

console.log(ui.parse('m-2px')) // => [ undefined, 'm', '2', 'px', undefined, undefined ]
console.log(ui.parse('hover:p-2rem/10px')) // => [ 'hover', 'p', '2', 'rem', '10', 'px' ]
```

#### `processValue`

A method for processing input value.

```typescript
processValue(type: string, value: string, unit: string): string {}
```

Example :

```javascript
const ui = new TenoxUI({
  property: {
    bg: {
      property: 'backgroundColor',
      value: 'rgb({0} / var(--bg-opacity, 1))'
    }
  },
  values: {
    // global values
    'red-500': '255 0 0',
    // type specific value
    bg: {
      'red-500': '0 0 255'
    }
  }
})

console.log(ui.processValue('', '10', 'rem')) // 10rem
console.log(ui.processValue('', '[calc(24_*_5)]')) // calc(24 * 5)
console.log(ui.processValue('', '$my-color')) // var(--my-color)
console.log(ui.processValue('', 'red-500')) // 255 0 0
console.log(ui.processValue('bg', 'red-500')) // 0 0 255
```

#### `processShorthand`

A method for processing rules from `property` field.

```typescript
processShorthand(
  type: string | undefined,
  value: string | undefined,
  unit: string | undefined,
  prefix: string | undefined,
  secondValue?: string | undefined,
  secondUnit?: string | undefined,
  isHyphen?: boolean
): ProcessedStyle | null {}
```

Example :

```javascript
const ui = new TenoxUI({
  property: {
    bg: {
      property: 'backgroundColor',
      value: 'rgb({0} / {1 | 100}%)'
    }
  },
  values: {
    'red-500': '255 0 0'
  }
})

console.log(ui.processShorthand('bg', 'red-500'))
console.log(ui.processShorthand('bg', '(0_255_0)', '', 'hover', '20', ''))

/* Output
{
  className: 'bg-red-500',
  cssRules: 'background-color',
  value: 'rgb(255 0 0 / 100%)',
  prefix: undefined
}
{
  className: 'bg-(0_255_0)/20',
  cssRules: 'background-color',
  value: 'rgb(0 255 0 / 20%)',
  prefix: 'hover'
}
*/
```

#### `processCustomClass`

A method for processing rules from `classes` field.

```typescript
processCustomClass(
  className: string | undefined,
  value?: string | undefined,
  unit?: string | undefined,
  prefix?: string | undefined,
  secValue?: string | undefined,
  secUnit?: string | undefined,
  isHyphen?: boolean
): ProcessedStyle | null {}
```

Example :

```javascript
const ui = new TenoxUI({
  classes: {
    display: {
      flex: 'flex',
      iflex: 'inline-flex'
    },
    '--bg-opacity': {
      bg: '{1}% || 1'
    },
    backgroundColor: {
      bg: 'rgb({0} / var(--bg-opacity)) || red'
    }
  },
  values: {
    'red-500': '255 0 0'
  }
})

console.log(ui.processCustomClass('bg'))
console.log(ui.processCustomClass('bg', 'red-500'))
console.log(ui.processCustomClass('bg', '(0_255_0)', '', 'hover', '40'))

/* Output
{
  className: 'bg',
  cssRules: '--bg-opacity: 1; background-color: red',
  value: null,
  prefix: ''
}
{
  className: 'bg-red-500',
  cssRules: '--bg-opacity: 1; background-color: rgb(255 0 0 / var(--bg-opacity))',
  value: null,
  prefix: ''
}
{
  className: 'bg-\\(0_255_0\\)\\/40',
  cssRules: '--bg-opacity: 40%; background-color: rgb(0 255 0 / var(--bg-opacity))',
  value: null,
  prefix: 'hover'
}
*/
```

#### `process`

A main method for parsing and processing class names automatically.

```typescript
process(classNames: string | string[]): ProcessedStyle[] {}
```

Example :

```javascript
const ui = new TenoxUI({
  property: {
    m: 'margin',
    p: 'padding',
    bg: 'backgroundColor',
    size: ['width', 'height']
  },
  classes: {
    display: {
      flex: 'flex',
      iflex: 'inline-flex'
    }
  }
})

console.log(
  ui.process([
    // shorthands
    'm-0',
    'p-1rem',
    'bg-blue',
    'size-30px',
    // classes
    'flex',
    'iflex'
  ])
)

/* Output
[
  {
    className: 'm-0',
    cssRules: 'margin',
    value: '0',
    prefix: undefined
  },
  {
    className: 'p-1rem',
    cssRules: 'padding',
    value: '1rem',
    prefix: undefined
  },
  {
    className: 'bg-blue',
    cssRules: 'background-color',
    value: 'blue',
    prefix: undefined
  },
  {
    className: 'size-30px',
    cssRules: [ 'width', 'height' ],
    value: '30px',
    prefix: undefined
  },
  {
    className: 'flex',
    cssRules: 'display: flex',
    value: null,
    prefix: ''
  },
  {
    className: 'iflex',
    cssRules: 'display: inline-flex',
    value: null,
    prefix: ''
  }
]
*/
```

## License

This project is licensed under **MIT License**. See [here](https://github.com/tenoxui/tenoxui/blob/main/LICENSE).
