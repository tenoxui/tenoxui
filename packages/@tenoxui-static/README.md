# `@tenoxui/static`

This package contains CSS rule generator if you don't want to use `inline-style` approach. Recommended for build.

## Installation

```bash
npm i @tenoxui/static
```

### Usage

```javascript
import { TenoxUI } from '@tenoxui/static'
// usage
// new TenoxUI(config)

// example
const tenoxui = new TenoxUI({
  property: {
    bg: 'background'
  }
})

// process the class names and include them to be processed later
tenoxui.processClassNames(['bg-red', 'bg-yellow'])

const stylesheet = tenoxui.generate()

console.log(stylesheet)

/* Output :
.bg-red { background: red }
.bg-yellow { background: yellow }
*/
```

## Configuration Options

```javascript
new TenoxUI({
  property: {},
  values: {},
  classes: {},
  aliases: {},
  breakpoints: [],
  reserveClass: [],
  apply: {}
})
```

You can read documentation for `property`, `values`, `classes`, `aliases`, and `breakpoints` on the [main README.md](https://github.com/tenoxui/tenoxui)

### `reserveClass`

Reserve any class names to include on the output :

```javascript
export default {
  property: {
    bg: 'background'
  },
  reserveClass: ['bg-red', 'bg-yellow']
}
```

Output :

```css
.bg-red {
  background: red;
}
.bg-yellow {
  background: yellow;
}
```

### `apply`

`apply` is where you can add custom css selector, or even stacking them like regular CSS. Same as `reserveClass` field, all of the rules inside `apply` will included in the output. Example :

```javascript
export default {
  property: {
    bg: 'background',
    text: 'color'
  },
  apply: {
    ':root': '[--black]-#000 [--white]-#fff',
    body: 'bg-$white text-$black',
    '@media (prefers-color-scheme: dark)': {
      ':root': '[--white]-#000 [--black]-#fff'
    }
  }
}
```

Output :

```css
:root {
  --black: #000;
  --white: #fff;
}
body {
  background: var(--white);
  color: var(--black);
}
@media (prefers-color-scheme: dark) {
  :root {
    --white: #000;
    --black: #fff;
  }
}
```

## Constructor

```typescript
class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoint[]
  private reserveClass: string[]
  private styleMap: Map<string, Set<string>>
  private apply: Record<string, StyleValue>

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    reserveClass = [],
    apply = {}
  }: TenoxUIParams = {}) {
    this.property = property
    this.values = values
    this.classes = classes
    this.aliases = aliases
    this.breakpoints = breakpoints
    this.reserveClass = reserveClass
    this.styleMap = new Map()
    this.apply = apply

    // ...
  }
}
```

## Public Methods

First, let's initialize `tenoxui` first :

```javascript
import { TenoxUI } from '@tenoxui/static'
const tenoxui = new TenoxUI({
  property: {
    bg: 'background'
  }
  /* other config here */
})
```

### `parseClassName`

Main TenoxUI class name parser.

#### Types

```typescript
function parseClassName(
  className: string
):
  | [
      prefix: string | undefined,
      type: string,
      value: string | undefined,
      unit: string | undefined,
      secValue: string | undefined,
      secUnit: string | undefined
    ]
  | null {}
```

#### Usage

```javascript
tenoxui.parseClassName('bg-red') // [ undefined, 'bg', 'red', '', undefined, undefined ]
tenoxui.parseClassName('bg-[rgb(255_0_0)]') // [ undefined, 'bg', '[rgb(255_0_0)]', '', undefined, undefined ]
tenoxui.parseClassName('[background]-[rgb(255_0_0)]') // [ undefined, '[background]', '[rgb(255_0_0)]', '', undefined, undefined ]
tenoxui.parseClassName('p-10px') // [ undefined, 'p', '10', 'px', undefined, undefined ]
tenoxui.parseClassName('hover:m-10px/1rem') // [ 'hover', 'm', '10', 'px', '1', 'rem' ]
```

### `processShorthand`

Process regular shorthands and direct CSS properties or variables.

#### Types

```typescript
type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string
}

processShorthand(
  type: string,
  value: string,
  unit: string = '',
  prefix?: string,
  secondValue?: string,
  secondUnit?: string
): ProcessedStyle | null;
```

#### Usage

1. Regular shorthand

   ```javascript
   tenoxui.processShorthand('bg', 'red')
   ```

   Output :

   ```javascript
   {
     className: 'bg-red',
     cssRules: 'background',
     value: 'red',
     prefix: undefined
   }
   ```

2. Direct properties

   ```javascript
   tenoxui.processShorthand('[--red,background,border-color]', 'red', '', 'hover')
   ```

   Output :

   ```javascript
   {
     className: '[--red,background,border-color]-red',
     cssRules: '--red: red; background: red; border-color: red',
     value: null,
     prefix: 'hover'
   }
   ```

### `processCustomClass`

Process class names defined under `config.classes`.

#### Types

```typescript
type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string
}

processCustomClass(className: string, prefix?: string): ProcessedStyle | null;
```

#### Usage

Let's initialize some classes :

```javascript
const tenoxui = new TenoxUI({
  classes: {
    display: {
      flex: 'flex',
      'flex-center': 'flex'
    },
    justifyContent: {
      'flex-center': 'center'
    }
  }
})
```

1. Regular shorthand

   ```javascript
   tenoxui.processCustomClass('flex')
   ```

   Output :

   ```javascript
   {
     className: 'flex-center',
     cssRules: 'display: flex; justify-content: center',
     value: null,
     prefix: undefined
   }
   ```

2. Direct properties

   ```javascript
   tenoxui.processCustomClass('flex-center', 'hover')
   ```

   Output :

   ```javascript
   {
     className: 'flex-center',
     cssRules: 'display: flex; justify-content: center',
     value: null,
     prefix: 'hover'
   }
   ```

### `processAlias`

Process class names defined under `config.aliases`.

#### Types

```typescript
type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string
}

processAlias(className: string, prefix?: string): ProcessedStyle | null;
```

#### Usage

Let's initialize some classes :

```javascript
const tenoxui = new TenoxUI({
  property: {
    bg: 'background',
    text: 'color',
    p: 'padding'
  },
  classes: {
    borderRadius: {
      'rounded-md': '6px'
    }
  },
  aliases: {
    btn: 'bg-red text-blue p-10px rounded-md'
  }
})
```

Example :

```javascript
tenoxui.processCustomClass('btn')
```

Output :

```javascript
{
  className: 'btn',
  cssRules: 'background: red; color: blue; padding: 10px; border-radius: 6px',
  value: null,
  prefix: ''
}
```

### `processClassNames`

Include the class names into the global `styleMap` and ensure them to be processed later.

#### Types

```javascript
processClassNames(classNames: string[]): void;
```

#### Usage

```javascript
tenoxui.processClassNames(['bg-red', 'bg-yellow'])
```

### `getStyle`

Return current `styleMap`

#### Types

```typescript
getStyle(): Map<string, Set<string>>;
```

#### Usage

```javascript
tenoxui.processClassNames(['bg-red'])

console.log(tenoxui.getStyle()) // Map(1) { 'bg-red' => Set(1) { 'background: red' } }
```

### `addStyle`

Add custom CSS rule to the `styleMap`.

#### Parameter

```typescript
addStyle(className: string, cssRules: string | string[], value?: string | null, prefix?: string | null, isCustomSelector?: boolean | null): void;
```

Breakdown :

1. `className`

   By default, this is what class name for the rule. However, you can include other selector as you want, but you have to set `isCustomSelector` (last parameter) to `true`. Usage example :

   ```javascript
   tenoxui.addStyle('bg-red') // => .bg-red
   tenoxui.addStyle('.bg-red') // => ..bg-red (double '.')
   tenoxui.addStyle('.bg-red', '', '', '', true) // .bg-red ()
   ```

2. `cssRules` & `value`

   These parameters is depends on each other, to ensure the functionality. Inside `cssRules`, you can define direct CSS rule such as :

   ```
   background: red; color: blue; padding: 10px;
   ```

   But, you have to set the `value` parameter to `null`. However, you can set the `cssRules` into array of CSS properties or variables, it allows you to set same value for multiple properties defined inside `cssRules` parameter. For example :

   ```javascript
   tenoxui.addStyle('...', 'background: red; color: blue', null) // => background: red; color: blue
   tenoxui.addStyle('...', ['background', 'color', '--my-color'], 'blue') // => background: blue; color: blue; --my-color: blue
   ```

3. `prefix` (default: `null`)

   This is what prefix you will add to the `className`, but you have to make sure the `isCustomSelector` is `false`.

4. `isCustomSelector` (default: `false`)
   By default, the `className` is treated as class selector, but you can set this to `true` to prevent it treated as class selector.

#### Usage

```javascript
tenoxui.addStyle('my-selector', 'background: red; color: blue', null, null, false)
tenoxui.addStyle('.my-selector:hover', ['--color', 'background'], 'red', null, true)

console.log(ui.getStyle())

// Output
Map(2) {
  '.my-selector' => Set(1) { 'background: red; color: blue' },
  '.my-selector:hover' => Set(1) { '--color: red; background: red' }
}
```

### `generate`

Generate CSS style rules that stored inside `styleMap`

### Usage

```javascript
tenoxui.processClassNames(['bg-red', 'bg-yellow'])

console.log(tenoxui.generate())

/* Output :
.bg-red { background: red }
.bg-yellow { background: yellow }
*/
```
