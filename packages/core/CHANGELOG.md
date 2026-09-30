# Changelog

## `v3.2.0` - `2025-11-16`

### **Changed**

- `value`, `variant`, `utility`, and `process` plugin hooks now can accept any returned value, except `undefined`
- Better `TenoxUI.matcher` instance
- Renaming `matcher` to `regexp` on `TenoxUI.regexp()` method and related instances
- Renaming `raw` to `match` in `processUtility` result and plugin context
- Changed plugin `init` hook context : `utilities` => `getUtilities()`, `variants` => `getVariants`

### **Removed**

- All exports from `src/utils`

### Added

- Better caching
- New `processClassName()` method to process singular class name
- New plugin hook `done`, for final transformation of the `process` method results
- New plugin hook `beforeUtility`, processing `context` data, run before `utility` hook
- New plugin hook `afterUtility`, processing `context` data, run after `utility` hook
- New plugin `init` hook contexts: `process.className` and `process.classNames`
- Add support for `Array` of string on `patterns` on `Plugin.regexp()` and `createMatcher`

### Fixed

- `addUtility`, `addVariant`, `addUtilities`, and `addVariants` hooks on `init()` plugin hook shouldn't return anything

### Development

- Update `README` file
- Use `tsdown` for bundler

## `v3.1.0` - `2025-10-29`

### **Changed**

- Rename **ALL** value `property` with `utility` for consistency
- Simplified plugin hooks names

## `v3.0.0` - `2025-10-02`

Major release `v3`

### **Removed**

- Removed barely used methods: `getPluginsByPriority`, `getPluginsByName`, `removePlugins`, `processWithPlugins` and `clearCache`
- Excessive context duplication for most plugin hooks and moved into single hook, `onInit`
- `transform` plugin hook

### Added

- New plugin hooks: `onInit`
- New methods: `addUtility`, `addUtilities`, `addVariant`, `addVariants`, `removeUtility`, `removeVariant` and `invalidateCache`

### Changed

- Moved some methods into singular helper functions
- `package.json` keywords
- Simplified returned value from `parse` method

### Fixed

- Removed old dependencies on `package.json`

## `v3.0.0-alpha.6` - `2025-09-22`

### **Removed**

- Removed unnecessary methods: `getPluginsByPriority` and `getPluginsByName`

### Changed

- Moved some methods into singular helper functions
- `package.json` keywords

### Fixed

- Removed old dependencies on `package.json`

## `v3.0.0-alpha.5` - `2025-09-14`

### Fixed

- The `utilities` and `variants`'s keys should be escaped before given to the final `matcher`

### Development

- Add more unit tests

## `v3.0.0-alpha.4` - `2025-08-30`

### Changed

- `processor` parameter in `process` plugin to `processUtility`.

### Added

- `processValue` and `processVariant` parameters for `process` plugin.
- Add generic types of `ProcessResult` for main class `TenoxUI` and `Config` type to add more typescript support.

### Development

- Remove `@nousantx/someutils`

## `v3.0.0-alpha.3` - `2025-08-04`

## **Changed**

- Simplified data structure from `processUtilities`
- Plugin ecosystem enhancements

## Added

- New `transform` plugin for final data processing, higher than `process` plugin. Useful when generating final data from the framework.
- `raw` field on returned data from `processUtilities`

## `v3.0.0-alpha.2` - `2025-07-02`

## **Changed**

- New default value output, `raw` and `data` is a separate

## Development

- Update types

## `v3.0.0-alpha.1` - `2025-06-30`

### **Changed**

- New import for types
- Updating some `any` types

## `v3.0.0-alpha.0` - `2025-06-30`

### **Changed**

- **Refactor the entire API**

### Development

- Dropped `@tenoxui/moxie` engine, and recreate it (plan for later) as plugin for new Core API.

---

This changelog is made manually since `29/04/2025`.
