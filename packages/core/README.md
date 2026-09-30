# `@tenoxui/core`

A powerful, extensible utility-first CSS framework engine with plugin architecture and advanced parsing capabilities.

## Features

- **Flexible Parsing**: Advanced regexp-based class name parsing with customizable patterns
- **Zero Dependencies**: Lightweight core with minimal overhead
- **Variant System**: Built-in support for responsive, state, and custom variants
- **Utility Management**: Dynamic utility and variant addition/removal
- **Plugin Architecture**: Extend functionality with custom plugins at multiple execution stages
- **Type-Safe**: Full TypeScript support with generic types
- **Caching**: Optimized performance with intelligent caching

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

**Output:**

```javascript
;[
  {
    className: 'hover:bg-blue',
    utility: 'backgroundColor',
    value: 'blue',
    variant: '&:hover',
    raw: ['hover:bg-blue', 'hover', 'bg', 'blue']
  },
  {
    className: 'p-4',
    utility: 'padding',
    value: '4',
    variant: null,
    raw: ['p-4', undefined, 'p', '4']
  },
  {
    className: 'md:text-xl',
    utility: 'color',
    value: 'xl',
    variant: '@media (min-width: 768px)',
    raw: ['md:text-xl', 'md', 'text', 'xl']
  }
]
```

## Core Concepts

### Utilities and Variants

**Utilities** are the core building blocks that map short names to CSS properties:

```javascript
const ui = new TenoxUI({
  utilities: {
    m: 'margin',
    p: 'padding',
    bg: 'backgroundColor',
    text: 'color',
    'custom-prop': '--my-custom-property' // CSS variables supported
  }
})
```

**Variants** allow conditional application based on states, media queries, or custom conditions:

```javascript
const ui = new TenoxUI({
  variants: {
    hover: '&:hover',
    focus: '&:focus',
    md: '@media (min-width: 768px)',
    dark: '@media (prefers-color-scheme: dark)',
    'group-hover': '.group:hover &'
  }
})
```

### Pattern Matching

TenoxUI uses regex patterns to parse class names. The default pattern is:

```
/^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
```

When you add new utilities or variants, they're automatically incorporated into the matcher:

```javascript
const ui = new TenoxUI()
console.log('Before:', ui.matcher.regexp)
// /^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/

ui.addUtility('bg', 'backgroundColor')
ui.addUtility('m', 'margin')
ui.addVariant('hover', '&:hover')
ui.addVariant('**', '&:**')

console.log('After:', ui.matcher.regexp)
// /^(?:(?<variant>hover|\*\*):)?(?<property>bg|m)(?:-(?<value>[\w.-]+?))?$/
```

The pattern components:

- **variant**: Optional prefix before `:` (e.g., `hover` in `hover:bg-blue`)
- **property**: The utility name (e.g., `bg` in `bg-blue`)
- **value**: Optional suffix after `-` (e.g., `blue` in `bg-blue`)

## API Reference

### Constructor

```typescript
new TenoxUI<TUtilities, TVariants, TProcessResult, TProcessUtilitiesResult>(config?)
```

**Configuration:**

- `config.utilities` - Object mapping utility names to CSS properties or functions
- `config.variants` - Object mapping variant names to selectors/conditions
- `config.plugins` - Array of plugins to extend functionality

### Instance Methods

#### Utility Management

**`addUtility(name, value)`**

Add a single utility:

```javascript
ui.addUtility('bg', 'backgroundColor')
```

**`addUtilities(utilities)`**

Add multiple utilities at once:

```javascript
ui.addUtilities({
  bg: 'backgroundColor',
  text: 'color',
  border: 'borderColor'
})
```

**`removeUtility(name)`**

Remove a utility:

```javascript
ui.removeUtility('bg')
```

#### Variant Management

**`addVariant(name, value)`**

Add a single variant:

```javascript
ui.addVariant('xl', '@media (min-width: 1280px)')
```

**`addVariants(variants)`**

Add multiple variants:

```javascript
ui.addVariants({
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)'
})
```

**`removeVariant(name)`**

Remove a variant:

```javascript
ui.removeVariant('hover')
```

#### Processing Methods

**`parse(className)`**

Parse a class name and extract its components:

```javascript
const parsed = ui.parse('hover:bg-blue')
// Returns: ['hover:bg-blue', 'hover', 'bg', 'blue']
```

**`processValue(value)`**

Process and transform a value through plugin hooks:

```javascript
const ui = new TenoxUI({
  plugins: [
    {
      value: (value) => (value === 'hello' ? '10px' : value)
    }
  ]
})

ui.processValue('hello') // '10px'
ui.processValue('world') // 'world'
```

**`processVariant(variantName)`**

Process and transform a variant through plugin hooks:

```javascript
const ui = new TenoxUI({
  variants: { md: '@media (min-width: 768px)' },
  plugins: [
    {
      variant: (variant) => (variant === 'custom' ? '@media (min-width: 900px)' : null)
    }
  ]
})

ui.processVariant('md') // '@media (min-width: 768px)'
ui.processVariant('custom') // '@media (min-width: 900px)'
```

**`processUtility(context)`**

Process a single utility with its variant and value:

```javascript
const result = ui.processUtility({
  variant: 'hover',
  utility: 'bg',
  value: 'blue',
  className: 'hover:bg-blue'
})
// Returns processed utility object
```

**`processClassName(className)`**

Process a single class name:

```javascript
ui.processClassName('bg-red')
```

**`process(classNames)`**

Process multiple class names (string or array):

```javascript
// String with space-separated classes
ui.process('bg-blue text-white p-4')

// Array of class names
ui.process(['bg-blue', 'text-white', 'p-4'])
```

#### Utility Methods

**`regexp()`**

Get current patterns and regexp for class name parsing:

```javascript
const { patterns, regexp } = ui.regexp()
// patterns: { variant: '...', utility: '...', value: '...' }
// regexp: /^(?:(?<variant>...):)?(?<property>...)(?:-(?<value>...))?$/
```

**`use(...plugins)`**

Add plugins to the instance:

```javascript
ui.use(myPlugin, anotherPlugin)
```

**`invalidateCache()`**

Manually invalidate the regexp cache (triggers rebuild):

```javascript
ui.invalidateCache()
```

## Plugin System

TenoxUI's plugin system allows you to extend and customize behavior at various execution stages.

### Plugin Interface

```typescript
interface Plugin {
  name: string // Required: Plugin identifier
  priority?: number // Optional: Execution priority (higher = first)

  // Lifecycle hooks (in execution order)
  init?: (context: InitContext) => void
  regexp?: (context: ParseContext) => { patterns?: RegexPatterns; regexp?: RegExp } | null
  parse?: (className: string, context: ParseContext) => unknown | null
  value?: (value: string) => string | null
  variant?: (variant: string) => string | null
  utility?: (context: ProcessUtilityContext) => TProcessUtilityResult | null | undefined
  process?: (className: string) => TProcessResult | null | undefined | void
}
```

### Plugin Execution Flow

Plugins execute in this order:

1. **`init`** - Called once when plugin is registered
2. **`regexp`** - Called when regexp patterns are built/rebuilt
3. **`parse`** - Called for each class name during parsing
4. **`value`** - Called when processing utility values
5. **`variant`** - Called when processing variants
6. **`utility`** - Called when processing complete utilities
7. **`process`** - Called for each class name during batch processing

### Plugin Hooks

#### `init`

**Type:** `(context: InitContext) => void`

Called once during plugin registration. Useful for setup and initialization.

```javascript
const myPlugin = {
  name: 'my-plugin',
  init({ getUtilities, addUtility, invalidateCache }) {
    console.log('Current utilities:', getUtilities())

    // Add utilities dynamically
    addUtility('m', 'margin')

    // Rebuild matcher if needed
    if (someCondition) {
      invalidateCache()
    }
  }
}
```

**Available context:**

- `getUtilities()` - Get all utilities
- `getVariants()` - Get all variants
- `addUtility(name, value)` - Add single utility
- `addUtilities(utilities)` - Add multiple utilities
- `addVariant(name, value)` - Add single variant
- `addVariants(variants)` - Add multiple variants
- `parser(className)` - Main parse method
- `regexp()` - Main regexp method
- `process` - Processing methods (`value`, `variant`, `utility`, `className`, `classNames`)
- `invalidateCache()` - Rebuild matcher

#### `regexp`

**Type:** `(context: ParseContext) => { patterns?: RegexPatterns; regexp?: RegExp } | null`

Modify the regex patterns used for parsing class names.

```javascript
const arbitraryValuesPlugin = {
  name: 'arbitrary-values',
  regexp: ({ patterns }) => ({
    patterns: {
      ...patterns,
      value: patterns.value + '|\\[.+?\\]' // Support [arbitrary] values
    }
  })
}

ui.use(arbitraryValuesPlugin)
// Now supports: bg-[#ff0000], m-[10px], etc.
```

#### `parse`

**Type:** `(className: string, context: ParseContext) => unknown | null`

Custom parsing logic for specific class name patterns.

```javascript
const customParsePlugin = {
  name: 'custom-parse',
  parse: (className, { patterns, regexp }) => {
    // Handle special class name format
    if (className.startsWith('custom-')) {
      const value = className.slice(7)
      return [className, undefined, 'custom', value]
    }
    return null // Let default parser handle it
  }
}
```

#### `value`

**Type:** `(value: string) => string | null`

Transform values during processing.

```javascript
const remPlugin = {
  name: 'rem-converter',
  value: (value) => {
    // Convert numeric values to rem
    if (/^\d+$/.test(value)) {
      return `${parseInt(value) * 0.25}rem`
    }
    return null // Keep original value
  }
}

// m-4 → margin: 1rem
// p-8 → padding: 2rem
```

#### `variant`

**Type:** `(variant: string) => string | null`

Transform variants during processing.

```javascript
const dynamicMediaPlugin = {
  name: 'dynamic-media',
  variant: (variant) => {
    // Support md-100, md-200, etc.
    if (variant.startsWith('md-')) {
      const size = variant.split('-')[1]
      return `@media (min-width: ${parseInt(size) * 10}px)`
    }
    return null
  }
}

// md-100:bg-blue → @media (min-width: 1000px)
```

#### `utility`

**Type:** `(context: ProcessUtilityContext) => TProcessUtilityResult | null | undefined`

Process or transform utility data before final output.

```javascript
const functionalUtilityPlugin = {
  name: 'functional-utility',
  utility: ({ className, utility, value, variant, raw }) => {
    // Support function-based utilities
    if (typeof utility === 'function') {
      const result = utility(value)
      return {
        className,
        utility: result.property,
        value: result.value,
        variant,
        raw
      }
    }
    return null // Let default processing handle it
  }
}
```

#### `process`

**Type:** `(className: string) => TProcessResult | null | undefined | void`

Handle specific class names with custom logic.

```javascript
const customClassPlugin = {
  name: 'custom-class',
  // Ensure class name is recognized by the matcher
  regexp: ({ patterns }) => ({
    patterns: {
      utility: patterns.utility + '|my-special-class'
    }
  }),
  process: (className) => {
    if (className === 'my-special-class') {
      return {
        className,
        utility: 'margin',
        value: '10px',
        variant: null
      }
    }
    return null
  }
}
```

### Creating Plugins

Here's a complete plugin example:

```javascript
const advancedPlugin = {
  name: 'advanced-plugin',
  priority: 10, // Execute before lower priority plugins

  init({ addUtilities, invalidateCache }) {
    // Add utilities on initialization
    addUtilities({
      special: 'customProperty'
    })
    invalidateCache()
  },

  regexp({ patterns }) {
    // Support arbitrary values with square brackets
    return {
      patterns: {
        value: patterns.value + '|\\[.+?\\]'
      }
    }
  },

  value(value) {
    // Extract arbitrary values
    if (value.startsWith('[') && value.endsWith(']')) {
      return value.slice(1, -1)
    }
    return null
  },

  utility(context) {
    // Add custom metadata
    if (context.utility === 'customProperty') {
      return {
        ...context,
        isCustom: true
      }
    }
    return null
  }
}

ui.use(advancedPlugin)
```

## Advanced Usage Examples

### 1. Arbitrary Values Support

```javascript
const arbitraryPlugin = {
  name: 'arbitrary-values',

  regexp({ patterns }) {
    return {
      patterns: {
        value: patterns.value + '|\\[.+?\\]'
      }
    }
  },

  value(value) {
    if (value.startsWith('[') && value.endsWith(']')) {
      return value.slice(1, -1)
    }
    return null
  }
}

ui.use(arbitraryPlugin)

// Now supports:
// m-[10px] → margin: 10px
// bg-[#ff0000] → backgroundColor: #ff0000
// p-[2rem] → padding: 2rem
```

### 2. Important Modifier

```javascript
const importantPlugin = {
  name: 'important',

  regexp: ({ regexp }) => ({
    regexp: new RegExp(`!?${regexp.source.slice(1, -1)}!?`)
  }),

  utility: (ctx) => ({
    ...ctx,
    isImportant: ctx.className.startsWith('!') || ctx.className.endsWith('!')
  })
}

ui.use(importantPlugin)

ui.process('m-10 m-10!')
// [
//   { isImportant: false, ... },
//   { isImportant: true, ... }
// ]
```

### 3. Functional Utilities

```javascript
const ui = new TenoxUI({
  utilities: {
    m: 'margin',
    p: (value) => ({
      property: 'padding',
      value: !isNaN(value) ? `${value * 0.25}rem` : value
    })
  },
  plugins: [
    {
      name: 'functional-utility',
      utility({ className, utility, value, variant, raw }) {
        if (typeof utility === 'function') {
          const result = utility(value)
          return {
            className,
            utility: result.property,
            value: result.value,
            variant,
            raw
          }
        }
      }
    }
  ]
})

ui.process('m-10 p-10')
// [
//   { utility: 'margin', value: '10', ... },
//   { utility: 'padding', value: '2.5rem', ... }
// ]
```

### 4. Responsive Variants with Values

```javascript
const responsivePlugin = {
  name: 'responsive-with-values',

  variant(variant) {
    // Support md-100, lg-200, etc.
    const match = variant.match(/^(sm|md|lg|xl)-(\d+)$/)
    if (match) {
      const [, breakpoint, size] = match
      return `@media (min-width: ${size}px)`
    }
    return null
  }
}

ui.use(responsivePlugin)

// md-800:text-lg → @media (min-width: 800px)
```

### 5. Negative Values

```javascript
const negativePlugin = {
  name: 'negative-values',

  parse(className, { patterns, regexp }) {
    const match = className.match(/^(-)?(\w+):?(\w+)?-(-)?(.+)$/)
    if (match && match[1]) {
      const [, negative, variant, property, negValue, value] = match
      return [className, variant, property, `-${value}`]
    }
    return null
  }
}

ui.use(negativePlugin)

// -m-4 → margin: -4
// -top-10 → top: -10
```

## Type Safety

TenoxUI is fully typed with TypeScript:

```typescript
import { TenoxUI, Plugin } from '@tenoxui/core'

// Define custom types
type MyUtilities = {
  m: 'margin'
  p: 'padding'
}

type MyVariants = {
  hover: '&:hover'
  md: string
}

// Create typed instance
const ui = new TenoxUI<MyUtilities, MyVariants>({
  utilities: {
    m: 'margin',
    p: 'padding'
  },
  variants: {
    hover: '&:hover',
    md: '@media (min-width: 768px)'
  }
})
```

## Best Practices

1. **Plugin Priority**: Use priority to control execution order when plugins depend on each other
2. **Cache Invalidation**: Call `invalidateCache()` after adding utilities/variants to rebuild the matcher
3. **Error Handling**: Plugins should handle errors gracefully; TenoxUI catches and logs plugin errors
4. **Return Values**: Return `null` or `undefined` to pass control to the next plugin or default behavior
5. **Performance**: Use the `regexp` hook sparingly as it rebuilds the matcher
6. **Type Safety**: Leverage TypeScript generics for type-safe plugin development

## License

MIT © 2025-present TenoxUI
