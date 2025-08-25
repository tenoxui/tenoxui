# Changelog

## `v1.0.0-alpha.4` - `2025-08-26`

### **Changed**

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
