# Static TenoxUI CSS Generator

TenoxUI CSS Generator is a powerful and flexible tool that automatically generates CSS rules from class names found in your HTML or JSX. It allows you to define custom properties, values, and classes, making it easy to create and maintain a consistent styling system across your project (tenoxui but css).

## Features

- Utility-first
- Generates CSS rules from class names
- Generates only what you define
- Support all css value and unit
- Support all tenoxui class definitions
- Small, fast, easy to configure

## Installation

```bash
npm install @tenoxui/static-css
```

## Usage

### Adding a Config

Create a configuration file (e.g., `tenoxui.config.js` or define with extensions `.mjs`/`.cjs`):

```javascript
module.exports = {
  // input file
  input: ["index.html", "src/**/*.jsx"],
  // where's the output should written
  output: "dist/styles.css",
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
      value: "linear-gradient(to right, purple, {value})",
    },
    flex: {
      property: ["justifyContent", "alignItems"],
      value: "{value}",
    },
  },
  // custom value
  values: {
    primary: "#ccf654", // usage _ text-primary = .text-primary { color: #ccf654; }
    rex: "#0000ff",
  },
  // custom classes. property-based className
  classes: {
    display: {
      "se-flex": "flex",
      iflex: "inline-flex", // .iflex { display: inline-flex; }
      "b-tenox": "block",
    },
    alignItems: {
      "se-flex": "center",
    },
    // output `se-flex` _ .se-flex { display: flex; align-items: center; }
  },
};
```

- `input`: Array of glob patterns for input files
- `output`: Path for the generated CSS file
- `property`: Define custom property mappings
- `values`: Define custom value mappings
- `classes`: Define custom class definitions

### CLI Mode

```
▶ npx tui-css -h
Usage: tui-css [options]

Options:
  -V, --version        output the version number
  -c, --config <path>  Path to the configuration file
  -w, --watch          Watch for file changes
  -o, --output <path>  Output file path (overrides config file)
  -v, --verbose        Verbose output
  --init               Initialize a new configuration file
  -h, --help           display help for command
```

- `--init`

  Using `--init` flag will generate `tenoxui.config.js` template inside your project.

- `-c` or `--config`

  Set the path to the tenoxui config. Example:
  `tui-css -c tenoxui.config.mjs`
  `tui-css --config tenoxui.config.cjs`

- `-o` or `--output`

  Set output file path. Example:
  `tui-css -o dist/output.css`
  `tui-css --output src/css/index.css`

- `-w` or `--watch`

  Use watch mode. Example:
  `tui-css -w`
  `tui-css --watch`

- `-v` or `--verbose`

  Displaying slight preview for generated css. Example:
  `tui-css -v`
  `tui-css --verbose`
