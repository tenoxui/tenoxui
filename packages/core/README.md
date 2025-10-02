# `@tenoxui/core`

A powerful, extensible utility-first CSS framework engine with plugin architecture and advanced parsing capabilities.

## Features

- **Flexible Parsing**: Advanced regex-based class name parsing
- **Zero Dependencies**: Lightweight core with minimal overhead
- **Variant System**: Built-in support for responsive, state, and custom variants
- **Utility Management**: Dynamic utility and variant addition/removal
- **Plugin Architecture**: Extend functionality with custom plugins
- **Type-Safe**: Full TypeScript support with generic types
- **Caching**: Optimized performance with intelligent regex caching

## Installation

```bash
npm install @tenoxui/core
```

## Quick Start

```javascript
import { TenoxUI } from '@tenoxui/core'

// Initialize TenoxUI
const ui = new TenoxUI({
  utilities: {
    m: 'margin',
    p: 'padding',
    bg: 'backgroundColor',
    text: 'color'
  },
  variants: {
    hover: '&:hover',
    focus: '&:focus',
    md: '@media (min-width: 768px)'
  }
})

console.log(ui.process('hover:bg-blue p-4 md:text-xl'))
```

Output:

```javascript
[
  {
    className: 'hover:bg-blue',
    property: 'backgroundColor',
    value: 'blue',
    variant: '&:hover',
    raw: ...
  },
  {
    className: 'p-4',
    property: 'padding',
    value: '4',
    variant: null,
    raw: ...
  },
  {
    className: 'md:text-xl',
    property: 'color',
    value: 'xl',
    variant: '@media (min-width: 768px)',
    raw: ...
  }
]
```

## Core Concepts

### Adding Utility/Rule and Variant

In TenoxUI, you can define your utility or rules inside `utilities` field. Example:

```javascript
const ui = new TenoxUI({
  utilities: {
    m: 'margin',
    p: 'padding',
    bg: 'backgroundColor',
    text: 'color'
    // ...
  }
})
```

Variants allow you to apply utilities conditionally based on state, media queries, or custom conditions. You can define your variants inside `variants` config:

```javascript
const ui = new TenoxUI({
  variants: {
    hover: '&:hover',
    focus: '&:focus',
    md: '@media (min-width: 768px)',
    dark: '@media (prefers-color-scheme: dark)'
    // ...
  }
})
```

Both `utilities` and `variants` are the essentials inside

### Parsing Method

TenoxUI uses `regex` pattern to parse input class names. By default, the `regex` pattern is simple as:

```
/^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
```

And bt default, your input `utilities` and `variants` will also included to the main matcher. For example:

```javascript
const ui = new TenoxUI()
console.log('Before:', ui.matcher)
ui.addUtility('bg', '...')
ui.addUtility('m', '...')
ui.addVariant('hover', '...')
ui.addVariant('**', '...')
console.log('After:', ui.matcher)
```

Output:

```
Before: /^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
After: /^(?:(?<variant>hover|\*\*):)?(?<property>bg|m)(?:-(?<value>[\w.-]+?))?$/
```

This pattern will be used by the main `parser` to parse, match, and determine what `variant`, `utility`, and `value` defined from the input class name.

## API Reference

### Constructor

```typescript
new TenoxUI<TUtilities, TVariants, TProcessResult, TProcessUtilitiesResult>(config?)
```

**Parameters:**

- `config.utilities`: Object mapping utility names to CSS properties
- `config.variants`: Object mapping variant names to selectors/conditions
- `config.plugins`: Array of plugins to extend functionality

### Methods

#### `use(...plugins)`

Add plugins to the instance:

```javascript
ui.use(myPlugin, anotherPlugin)
```

#### `addUtility(name, value)`

Add a single utility:

```javascript
ui.addUtility('bg', 'background')
```

#### `addUtilities(utilities)`

Add multiple utilities:

```javascript
ui.addUtilities({
  bg: 'background',
  text: 'color'
})
```

#### `addVariant(name, value)`

Add a single variant:

```javascript
ui.addVariant('xl', '@media (min-width: 1280px)')
```

#### `addVariants(variants)`

Add multiple variants:

```javascript
ui.addVariants({
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)'
})
```

#### `removeUtility(name)`

Remove a utility:

```javascript
ui.removeUtility('bg')
```

#### `removeVariant(name)`

Remove a variant:

```javascript
ui.removeVariant('hover')
```

#### `parse(className, safelist?)`

Parse a class name and extract its components:

```javascript
const parsed = ui.parse('hover:bg-blue')
// Returns: [match, variant, property, value]
```

#### `processUtilities(context)`

Process a single utility with its variant and value:

```javascript
const result = ui.processUtilities({
  variant: 'hover',
  property: 'bg',
  value: 'blue',
  className: 'hover:bg-blue'
})
```

#### `process(classNames)`

Process one or multiple class names:

```javascript
// string class names
const results = ui.process('bg-blue text-white p-4')

// array class names
const results = ui.process(['bg-blue', 'text-white', 'p-4'])
```

#### `regexp()`

Get the current regex patterns and matcher:

```javascript
const { patterns, matcher } = ui.regexp()
```

#### `invalidateCache()`

Manually invalidate the regex cache:

```javascript
ui.invalidateCache()
```

## Plugin System

TenoxUI's plugin system allows you to extend and customize behavior at various execution stages.

### Plugin Execution Order

1. **onInit**: Called once when plugin is registered
2. **regexp**: Called when regex matcher is built/rebuilt
3. **parse**: Called for each class name during parsing
4. **processValue**: Called when processing utility values
5. **processVariant**: Called when processing variants
6. **processUtilities**: Called when processing complete utilities
7. **process**: Called for each class name during batch processing
8. **transform**: Called for batch transformations

### Creating a Plugin

```javascript
const myPlugin = {
  name: 'my-plugin',
  priority: 10, // Higher priority = executed first

  onInit(context) {
    // Initialize plugin
    console.log('Plugin initialized')
  },

  regexp(context) {
    // Modify regex patterns
    return {
      patterns: {
        ...context.patterns,
        value: '[\\w.-]+|\\[.+?\\]' // Support arbitrary values
      }
    }
  },

  parse(className, context) {
    // Custom parsing logic
    if (className.startsWith('custom-')) {
      return ['custom', null, 'custom', className.slice(7)]
    }
  },

  processValue(value) {
    // Transform values
    if (value.startsWith('[') && value.endsWith(']')) {
      return value.slice(1, -1)
    }
  },

  processUtilities(context) {
    // Custom utility processing
    if (context.property === 'special') {
      return {
        ...context,
        customField: 'custom value'
      }
    }
  },

  process(className) {
    // Handle specific class names
    if (className === 'special-class') {
      return { type: 'special', className }
    }
  }
}

// Use the plugin
ui.use(myPlugin)
```

## Advanced Usage

### Regex Transformation

Create a plugin to support arbitrary values using square brackets:

```javascript
const arbitraryValuesPlugin = {
  name: 'arbitrary-values',

  regexp({ patterns }) {
    return {
      patterns: {
        value: patterns.value + '|\\[.+?\\]'
      }
    }
  },

  processValue(value) {
    if (value.startsWith('[') && value.endsWith(']')) {
      return value.slice(1, -1)
    }
  }
}

console.log(ui.matcher)
ui.use(arbitraryValuesPlugin)
console.log(ui.matcher)
```

Output:

```
/^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
/^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+|\[.+?\]?))?$/
```

With the new `matcher`, now your framework can support arbitrary value such as `m-[10px]`, `bg-[red]`, etc.

### Value Transformations

Transform values on the fly:

```javascript
const valueTransformPlugin = {
  name: 'value-transform',

  processValue(value) {
    // Convert numeric values to rem
    if (/^\d+$/.test(value)) {
      return `${parseInt(value) * 0.25}rem`
    }
  }
}

ui.use(valueTransformPlugin)

// p-4 → padding: 1rem
// m-8 → margin: 2rem
```

### Functional Utilities

Creating plugin for dynamic and complex functional utility support:

```javascript
const ui = new TenoxUI({
  utilities: {
    // basic utility
    m: 'margin',
    // functional utility example
    p: (val) => [
      'padding',
      // multilply numbered value with 0.25
      !isNaN(val) ? val * 0.25 + 'rem' : val
    ]
  },
  plugins: [
    {
      name: 'functional-utility',
      processUtilities({ className, property, value, variant, raw }) {
        if (typeof property === 'function') {
          const [prop, val] = property(value) // process functional utility

          return {
            className,
            property: prop,
            value: val,
            variant,
            raw
          }
        }
      }
    }
  ]
})

console.log(ui.process('m-10 p-10'))
```

Output:

```javascript
[
  {
    className: 'm-10',
    property: 'margin',
    value: '10',
    variant: null,
    raw: ...
  },
  {
    className: 'p-10',
    property: 'padding',
    value: '2.5rem',
    variant: null,
    raw: ...
  }
]
```

The `p-10` utility multiply its value (`10`) by `0.25` and the added `rem` as unit (and become `2.5rem`), while the `m-10` utility keep the value `10` as it is.

## License

MIT © 2025-present TenoxUI
