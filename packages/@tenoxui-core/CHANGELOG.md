# Changelog

## `v2.0.3` - `2025-05-27`

### Changed

- All string `variants` will handled directly without `prefixLoader`

### Fixed

- `variant` with same prefix isn't handled properly.

## `v2.0.2` - `2025-05-22`

- Types are not generated and not included on distribution

## `v2.0.1` - `2025-05-21`

### Fixed

– Failed to parse `alias` with same prefix name

## `v2.0.0` - `2025-05-17`

### Development

- Use `@tenoxui/moxie` as external module
- Bump `@tenoxui/moxie` to `v0.7.0` and as dependencies

## `v2.0.0-alpha.5` - `2025-05-15`

### Added

- `prefixChars` option to pass reserved prefix characters to the main engine and `prefixLoader`
- `prefixLoaderOptions` option to customize `prefixLoader` configuration

### Development

- Add new package: `@nousantx/someutils@0.7.1`

## `v2.0.0-alpha.4` - `2025-05-14`

### Added

- Use `!` mark before any class names to mark them as `important` rules

### Development

- Bump `@tenoxui/moxie` to `v0.6.7`

## `v2.0.0-alpha.3` - `2025-05-12`

### Changed

- `customVariants` option, the `prefixLoader` now will process directly from `variants`. So now, user can define their `customVariants` directly from `variants` option

### Development

- Bump `@tenoxui/moxie` to `v0.6.6`

## `v2.0.0-alpha.2` - `2025-05-10`

### **Removed**

- `pseudo-element` and `pseudo-classes` variants (define yourself!)
- Default breakpoints

## `v2.0.0-alpha.1` - `2025-05-01`

### Added

- Types import from `@tenoxui/moxie`
- `prefix` field on `processAlias` return

### Removed

- `is` function

## `v2.0.0` (dev start) - `2025-04-29`

### Notes

- `tenoxui/core` is starting development for major release v2.0.0

---

This changelog is made manually since `29/04/2025`.
