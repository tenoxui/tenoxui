# TenoxUI CSS

TenoxUI is lightweight, utility-first based CSS framework.

## Features

- Support **all** CSS properties - You can use all css properties directly in the element's class name. (e.g. `[background]-red`, `[-webkit-animation,animation]-1s`)

- Shorthand - Adding shorthand for exact css property to simplify the usage. (e.g. `bg-red`)

- Value aliases - Use value like `my-size` to store css value `calc(10rem - var(--my-size, 8rem))`. (e.g. `p-my-size`)

- Define custom class - Create mass utilities with `property-based` class names

- Responsive & Pseudo class - Creating responsive and `pseudo-class` like effect with `inline-style`

- Extended to `inline-style`, `inline-css`, `static-css` or whatever you like!

## Overview

### CSS by Class Names

Adding CSS property or variable directly from the element's className :

```html
<div class="[background]-red"></div>
<div class="[color,--my-color]-blue"></div>
<div class="[-webkit-animation,animation]-1s"></div>
<div class="[--my-color]-green [color]-$my-color"></div>
```

### Shorthand/Type Property

Use shorthand for the CSS proeprties or variables :

```javascript
export default {
  property: {
    bg: 'background',
    text: 'color',
    anim: ['animation', 'webkitAnimation'],
    'my-color': '--my-color'
  }
}
```

And, it will looks like this :

```html
<div class="bg-red"></div>
<div class="text-blue"></div>
<div class="anim-1s"></div>
<div class="my-color-green text-$my-color"></div>
```

## Global Configuration

This configuration is supported by both `tenoxui` and `@tenoxui/static` packages. **For more configuration, please check out each packages documentation**.

Overall, both pacakges configuration has this similar configuration :

```javascript
export default {
  property: {},
  values: {},
  classes: {},
  aliases: {},
  breakpoints: []
}
```

Here's the breakdown :

- `property`: This field will store your `shorthand` for exact CSS property or variable.
- `values`: This field will store your value aliases for the `shorthand` to use.
- `classes`: You can create utility-first class names inside this field easily.
- `aliases`: Store class names aliases to make it easier to write big class names.
- `breakpoints`: Defining responsive point and its name prefix.

### Using the Config

You can use the configuration as shown below :

```javascript
// tenoxui
import { tenoxui, MakeTenoxUI } from 'tenoxui'
tenoxui(config)
// tenoxui pacakge has @tenoxui/core dependencies by default
new MakeTenoxUI(config)

// @tenoxui/core
import { MakeTenoxUI } from '@tenoxui/core'
new MakeTenoxUI(config)

// @tenoxui/static
import { TenoxUI } from '@tenoxui/static'
new TenoxUI(config)
```

## Documentation

Few example for configuring your TenoxUI.

### Creating Shorthand

Inside `config.property`, you can store your shorthands to make it easier to write class names. Example :

```javascript
export default {
  proeprty: {
    bg: 'backgroundColor',
    p: 'padding',
    img: 'backgroundImage'
  }
}
```

Usage :

```html
<div class="bg-red"></div>
<div class="p-10px"></div>
<div class="img-[url(/my-image.png)]"></div>
```

Without shorthands :

```html
<div class="[background]-red"></div>
<div class="[padding]-10px"></div>
<div class="[backgroundImage]-[url(/my-image.png)]"></div>
```

### Customazing Rules for Shorthand

Still inside `config.property`, you can add custom rules for the output style :

```javascript
export default {
  proeprty: {
    bg: {
      property: 'background',
      value: 'rgb({0} / var(--opacity))'
    },
    p: {
      property: 'padding',
      value: 'calc({0} + 2rem)'
    },
    img: {
      property: 'backgroundImage',
      value: 'url({0})'
    }
  }
}
```

```html
<div class="bg-[255_0_0]"></div>
<div class="p-1rem"></div>
<div class="img-[/my-image.png]"></div>
```

### Adding Value Aliases

Using `config.values`, you can store value aliases to make writing class easier. Example :

```javascript
export default {
  property: {
    bg: 'background',
    w: 'width',
    h: 'height'
  },
  values: {
    // accessible for all properties and shorthands
    full: '100%',
    primary: '#ccf654',
    'my-size': 'calc(20px + 1rem)',
    // specific shorthand
    h: {
      full: '50%',
      'my-size': '10px'
    }
  }
}
```

Usage example:

```html
<div class="w-full h-full bg-primary"></div>
```

Same as :

```css
div {
  width: 100%;
  height: 50%;
  background: #ccf654;
}
```

### Creating Mass Utilities

Inside `config.classes`, you can create mass utility-first class names depends on exact CSS properties or even variables. Example :

```javascript
export default {
  classes: {
    // CSS variable
    '--shadow': {
      'shadow-md': '...' // Output _ .shadow-md { --shadow: ... }
    },
    // Regular css property
    margin: {
      'm-1': '2px',
      'm-2': '4px',
      'm-3': '6px'
      // more utilities
    },
    display: {
      flex: 'flex',
      iflex: 'inline-flex',
      'flex-center': 'flex' // stacking style for class name
    },
    alignItems: {
      // the flex-center class name will have both display -
      // and align-items properties for the output.
      // Output _ .flex-center { display: flex; align-items: center }
      'flex-center': 'center'
    }
  }
}
```

Usage :

```html
<div class="m-2 flex"></div>
<div class="shadow-md flex-center"></div>
```

### Creating Class Names Aliases

Under `config.aliases`, we can write alias for big class names. Example :

```javascript
export default {
  property: {
    bg: 'background',
    text: 'color',
    p: 'padding',
    br: 'borderRadius',
    d: 'display',
    jc: 'justifyContent',
    ai: 'alignItems'
  },
  aliases: {
    btn: 'bg-red text-blue p-1rem br-6px d-flex [jc,ai]-center'
  }
}
```

Usage :

```html
<div class="btn">with alias</div>
<div class="bg-red text-blue p-1rem br-6px d-flex [jc,ai]-center">without alias</div>
```

### Adding Responsiveness

Under `config.breakpoints`, you can define prefixes that store the exact screen size you want to handle. Example :

```javascript
export default {
  property: {
    bg: 'background'
  },
  breakpoints: [
    { name: 'max-md', max: 540 },
    { name: 'md', min: 540 },
    { name: 'md-only', min: 540, max: 678 }
    { name: 'lg', min: 679 },
  ]
}
```

Usage :

```html
<div class="bg-red"></div>
<div class="md:bg-blue lg:bg-green"></div>
<div class="max-md:bg-yellow"></div>
<div class="md-only:bg-orange"></div>
```

## License

MIT © 2024-Present
