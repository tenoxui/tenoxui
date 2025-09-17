# Changelog

## `v1.0.0-alpha.14` - `2025-09-17`

### Changed

- Clearer `onMatcherCreated` param
- Rename `regexp` into `onInit`

### Added

- `addUtilities` and `addVariants` hooks to `regexp` plugin

### Fixed

- All patterns from `typeSafelist`, `valuePatterns`, and `variantPatterns` shouldn't automatically escaped, only keys of `utilities` and `variants` that needs to be escaped automatically
- The `regexp` plugin runs multiple times for `addTypeSafelist`, `addValuePatterns`, and `addVariantPatterns` hooks, called on every class names, causing duplication for final `RegExp` pattern.

## `v1.0.0-alpha.13` - `2025-09-16`

### Changed

- Moved the `PluginSystem` from `lib/processor` directly to main `Moxie` function

### Added

- New plugin for dynamically add patterns to the matcher

### Fixed

- Should return `results` even when data is empty on `lib/transformer`
- Sanitized rules, shouldn't add color (`;`) to nested rules on string rules

### **Removed**

- `debug` field on `createRegexp` function, unnecessary.

## `v1.0.0-alpha.12` - `2025-09-15`

### Added

- Add default `renderer` and quick ready-to-use TenoxUI initializer

## `v1.0.0-alpha.11` - `2025-09-14`

### Added

- New given arguments to `onMatcherCreated` callback option
- New `matcherOptions` option for new `createMatcher` and `createRegexp` functions
- `valuePatterns` option can accept `RegExp` directly

### Fixed

- Should create `Processor` for once for re-use
- String utility should have a value (not direct string utility, e.g. `{ flex: 'display: flex' }`, but something like `{ bg: 'background' }`)

## `v1.0.0-alpha.{9,10}` - `2025-09-06`

### Fixed

- Should escape the selector first before splitting on `Object` class name, and the split result must have more than one item
- Should return `null` on invalid variants

### Development

- Add new unit tests

## `v1.0.0-alpha.8` - `2025-09-06`

### Changed

- Only utility function that can accept value with `key`s
- Normalize error output's `reason`
- Shouldn't replace `&` with raw or full `className` if it was an object, only replace the actual class name and separate `prefix` or `suffix`
- Other improvements

## `v1.0.0-alpha.7` - `2025-08-31`

### Fixed

- Mismatched types for `Utilities`
- Should remove `props:` in transformer even the `key` only have single property on `ObjectRules` transformer

### Development

- Add new tests for `ObjectRules` transformer

## `v1.0.0-alpha.6` - `2025-08-29`

### Fixed

- `.d.ts` files isn't generated on production

## `v1.0.0-alpha.5` - `2025-08-27`

### Added

- Static utilities feature
- New `valuePatterns` config to set custom patterns for `value` matcher

### Changed

- Update some `reason` on error utility outputs

### **Removed**

- Value mapping feature from `values` config, can be added through a plugin.
- Default value patterns for CSS variable (`$value`) and hex color value (`#value`)

## `v1.0.0-alpha.4` - `2025-08-26`

### Changed

- Moved some helper functions from `lib/processor.ts` to `utils/processorUtils.ts`

### **Fixed**

- Forgot to remove remaining `console.log`

## `v1.0.0-alpha.3` - `2025-08-25`

### Added

- Better and clearer error utility returns
- New `props:` mark for allowing multiple properties or variables separated by comas (`,`)

### **Fixed**

- The unmatched value with its RegExp should return data from `createErrorResult` instead of just `null`

### Development

- Update types & unit tests

## `v1.0.0-alpha.2` - `2025-08-22`

### Added

- Functional utility can return direct css properties or variables
- Allow variants without `@slot` by default (will added automatically)
- Plugin system for more customization

## `v1.0.0-alpha.1` - `2025-08-09`

### **Changed**

- More robust and clean API

### Added

- Default data-to-css transformer

## `v1.0.0-alpha.0` (dev start) - `2025-07-03`

### Notes

- `@tenoxui/plugin-moxie` is starting development for major release v1.0.0

---

This changelog is made manually since `03/07/2025`.
