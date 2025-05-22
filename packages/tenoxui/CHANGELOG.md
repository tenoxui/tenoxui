# Changelog

## `v1.0.0` - `2025-05-22`

### Development

Released `v1.0.0` after :

- `v1.0.0-alpha.{0-8}`
- `v1.0.0-pre.{0,2}`

## `v1.0.0-pre.0` - `2025-05-17`

### Added

- Update remaining `any` types
- After major release, dependencies become external
- New dist files, `bundle.*` for `iife` and `umd` variants

### Development

- Bump `@tenoxui/core` to `v2.0.0`
- Bump `@tenoxui/core` to `v0.7.0`
- Added peer dependencies for both `core` and `moxie`
- Use both packages as dependencies and external module

## `v1.0.0-alpha.8` - `2025-05-15`

### Added

- `reservedVariantChars` and `prefixLoaderOptions` options. New options for `@tenoxui/core`

### Development

- Bump `@tenoxui/core` to `v2.0.0-alpha.5`

## `v1.0.0-alpha.7` - `2025-05-14`

## Changed

- Refactor `render` method

## Added

- Use `!` mark before any class names to add `!important` mark to output rules

### **Removed**

- Simple mode (including `simpleMode` option and `simple()` method)

### Development

- Bump `@tenoxui/moxie` to `v0.6.7`
- Bump `@tenoxui/core` to `v2.0.0-alpha.4`
- Update test

## `v1.0.0-alpha.6` - `2025-05-12`

### Added

- New `selectorPrefix` option to add prefix before all selectors

### Changed

- `classNameOrder` option become `typeOrder` for better purpose

### **Deprecated**

- `customVariants` option, in updated `core` module now support custom variants directly in `variants` option
- `isCustomPrefix` helper method

### Development

- Bump `@tenoxui/moxie` to `v0.6.6`
- Bump `@tenoxui/core` to `v2.0.0-alpha.3`
- New tests

## `v1.0.0-alpha.5` - `2025-05-11`

### Fixed

- Not correctly process multiple properties (array properties) on `aliases`.

## `v1.0.0-alpha.4` - `2025-05-10`

### Changed

- Use `tenoxui/moxie@0.6.5`
- Update exports

## `v1.0.0-alpha.3` - `2025-05-10`

### Development

- Bump `tenoxui/core` to `v2.0.0-alpha.2`
- Added some changes to match the new core version's types

## `v1.0.0-alpha.2` - `2025-05-06`

### Added

- `beutifyRules` support for nested rules

## `v1.0.0-alpha.1` - `2025-05-04`

### Added

- New option `classNameOrder` to set the order of the class name based on the `type`
- New method `sortedClassNameItem` for sorting generated data from `TenoxUI.process`
