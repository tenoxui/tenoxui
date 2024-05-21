# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.9.0] - [2024-5-20]

### Added

- Added `use` function to add types and properties.
- `$` for using values from css variables

### Changed

- Passing css variables into element now needed to add the `--` prefix and it will get the value from css variable. Example: `tc-[--neutral]`.
- On `applyStyle` method, changed how the custom styling works for `filter`, `backdrop-filter`, and `transform`
- You can't use `filter`, `backdrop-filter`, and `transform` as stacked class like `<div class="blur-3.7px grayscale-50%"></div>`, use this instead `<div class="filter-[blur(3.7px)\_grayscale(50%)]"></div>`. If you only need one class, it's okay.
- Changed Types and Proeprties :
  1. `"text-s": "fontStyle"` => `"font-s": "fontStyle"`
  2. `"text-s": "fontStyle"` => `"font-s": "fontStyle"`
  3. `"fx-wrap": "flexWrap",` => `"flex-wrap": "flexWrap"`
  4. `"fx-basis": "flexBasis"` => `"flex-basis": "flexBasis"`
  5. `"fx-grow": "flexGrow"` => `"flex-grow": "flexGrow"`
  6. `"fx-shrink": "flexShrink"` => `"flex-shrink": "flexShrink"`
  7. Change all `filter` function value from `filter` to `ftr`
  8. Change all `backdrop-filter` function value from `backdropFilter` to `bFt`
  9. Change all `transform` function value from `transform` to `tra`

### Deprecated

- `property` is deprecated from tenoxui, and maybe moved into `@tenoxui/class` package
- `filter`, `backdrop-filter`, and `transform` now can't be stacked using one-by-one classnames

### Removed

- `newProp` class
- `defineProps` function
- Removed `background-image` custom value from `applyStyle` method.
- All custom values now handled using square bracket `[]`, and the usage of curly bracket may be deprecated.
- Removed types and properties :
  1. `fx: "flex",`
  2. `ts: "textStyle"`
  3. `"bg-blend": "backgroundBlendMode",`
  4. `"bg-loc-x": "backgroundPositionX",`
  5. `"bg-loc-y": "backgroundPositionY",`
  6. `"row-gap": "rowGap",`
  7. `"col-gap": "columnGap",`
  8. `"as": "alignSelf",`
  9. `"js": "justifySelf",`
