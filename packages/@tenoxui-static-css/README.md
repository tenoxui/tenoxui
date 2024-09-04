# Static TenoxUI CSS Generator

TenoxUI CSS Generator is a powerful and flexible tool that automatically generates CSS rules from class names found in your HTML or JSX. It allows you to define custom properties, values, and classes, making it easy to create and maintain a consistent styling system across your project (tenoxui but css).

## Features

- Generates CSS rules from class names in HTML and JSX file (currently)
- Generates only what you need
- Support all css value and unit
- Support all tenoxui class definitions
- ESModule support (soon)
- Small, fast, easy to configure

## Installation

```bash
npm install @nousantx/static-css-tenoxui
```

## Usage

1. Create a configuration file (e.g., `tenoxui.config.js`):

```javascript
const path = require('path');

module.exports = {
  property: {
    // regular type & property
    bg: "backgroundColor",
    text: "color",
    p: "padding",
    br: "borderRadius",
    // multiple property
    size: ["width", "height"],
    // variable property
    "border-color": "--bdr-clr",
    // custom value property
    gradient: {
      property: "backgroundImage",
      value: "linear-gradient(to right, purple, {value})"
    },
    flex: {
      property: ["justifyContent", "alignItems"],
      value: "{value}"
    }
  },
  // custom value
  values: {
    primary: "#ccf654", // usage _ text-primary = .text-primary { color: #ccf654; }
    rex: "#0000ff"
  },
  // custom classes. property-based className
  classes: {
    display: {
      "se-flex": "flex",
      iflex: "inline-flex", // .iflex { display: inline-flex; }
      "b-tenox": "block"
    },
    alignItems: {
      "se-flex": "center"
    }
    // output `se-flex` _ .se-flex { display: flex; align-items: center; }
  },
  // input file
  input: ["index.html", "src/**/*.jsx"],
  // where's the output should written
  output: "dist/styles.css"
};
```

- `property`: Define custom property mappings
- `values`: Define custom value mappings
- `classes`: Define custom class definitions
- `input`: Array of glob patterns for input files
- `output`: Path for the generated CSS file

2. Create a script to run the generator (e.g., `generate-css.js`):

```javascript
const { GenerateCSS } = require('@nousantx/static-css-tenoxui');
const config = require('./tenoxui.config.js');

const generator = new GenerateCSS(config);
generator.generateFromFiles();
```

3. Or, run with the cli
```bash
static-tcss
```

It will scan `tenoxui.config.js` file at the project root. But, you can specify the config file by adding `-c` flag, example :

```bash
static-tcss -c tenoxui.config.js
# or
static-tcss -c tenoxui.config.cjs
```

Adding watch-mode by adding `-w` or `--watch` flag :

```bash
static-tcss -w -c tenoxui.config.js 
```
