# Changelog

## `v0.7.1` - `2025-05-22`

### Changed

- Make all params of `ProcessedStyle` on functional hooks optional

### Added

- Access `regexp` function directly from the instance, new method `regexp`

### Fixed

- `processShorthand` didn't check if functional hook shorthands returned `array`

## `v0.7.0` - `2025-05-16`

### Added

- User can return direct data as `ProcessedStyle` from the shorthand

### Changed

- Refactor some utility functions

### **Removed**

- Default `moxie-*` utility

## `v0.6.8` - `2025-05-15`

### Fixed

- The `prefixChars` and `property` keys should be escaped first before included to final `regexp`

## `v0.6.7` - `2025-05-13`

### Added

- `prefix` now supports value after `/`
- New option `prefixChars` for adding custom characters to `prefix` pattern

## `v0.6.6` - `2025-05-12`

### Added

- New condition for object `type` in `processShorthand` method

### Fixed

- Object shorthand should be able to create valueless utility when `type.property` and `type.value` is both string and `type.value` doesn't have `{0}`
- `process` method returned double class names on valueless type

## `v0.6.5` - `2025-05-07`

### Fixed

- `parse` method not parsing the entire string.

## `v0.6.4` - `2025-05-05`

### Fixed

- Same class name causes longer class name not being processed on `processCustomClass`.

## `v0.6.3` - `2025-05-04`

### Added

- New `DirectValue` types in `property`

### Fixed

- Can't use direct values on string properties even the `type` has `value:`

## `v0.6.2` - `2025-05-02`

### Changed

- `parseValuePattern` now can handle multiple `{0}` and `{1...}` from single pattern

## `v0.6.1` - `2025-04-27`

### Added

- check if the `this.property[type]` has `property` if defined as an object
- `constructRaw` method.

### Changed

- `className` field in the `process` output now automatically escaped.
- `processShorthand` and `processCustomClass` now return full class names (`prefix` is not included before).

### Deprecated

- `parse` method wont return `constructedClass` anymore, but it remain the same in the `process` method output.

## `v0.6.0` - `2025-04-25`

### Added

- `value` in shorthand feature now can be defined as array, that stores only specific values. (e.g. `font: { value: ["thin", "normal", "medium"], property: ... }`)

## `v0.5.0` - `2025-04-24`

> Stable release after pre-releasing: `v0.5.0-alpha.0`, `v0.5.0-alpha.1`, and `v0.5.0-alpha.2`

### In Summary

- Full rewrite of `parse` logic
- Internal API adjustments to function shorthand (`bg: () => ...`)
- Deprecated `alwaysUseHyphens` support
- Improved stability and parsing reliability

## `v0.5.0-alpha.2` - `2025-04-23`

### Changed

- Refactor `parse` method

## `v0.5.0-alpha.1` - `2025-04-22`

### Fixed

- Remove remaining separator from valueless class name

## `v0.5.0-alpha.0` - `2025-04-22`

### Added

- Function `property` (including function `value`) now have access to `raw` data of the class name its processing. (e.g. `bg: ({ value, raw }) => ...`)

### Changed

- Return `null` when `key` is defined but in string property.
- Return reconstructed class name on `parse` method
- Refactor direct properties class name. functionality, return the CSS properties and variables instead of direct CSS rules.

### Deprecated

- Deprecating `alwaysUseHyphens` support, because if set to false, causing many error when parsing class names

## `v0.4.4` - `2025-04-19`

### Changed

- `moxie-*` utility doesn't allow `secondValue` by default
- `escapeCSSSelector` method will escape any numbers at the start of the inputted

### Fixed

- Don't stringify `null` `cssRules` on `processShorthand`
- Return `null` (if `secondValue` is present) on properties and values that is string or shorthand value that doesn't have `{1`.

### Removed

- Remove `type` field from `package.json`

## `v0.4.3` - `2025-04-17`

### Added

- Added `className` inside one of the returned items in `parse()` method
- New method `regexp`, return standalone `regex` pattern for constructing the final `regex` pattern.
- Added condition to not processing `cssRules` that is `null`

### Changed

- `generateClassNameRegEx()` method now relying on new `regexp()` method.

## `v0.4.2` - `2025-04-01`

### Fixed

- Shouldn't replace `\_` with blank space, only `_`

## `v0.4.1` - `2025-03-29`

### Changed

- Arbitrary value (that starts with `[` or `(`) will not replace `\_` with blank space, only `_`.

## `v0.4.0` - `2025-03-23`

### Changed

- `getTypePrefixes` now returning an array
- Enhance `hyphens` checks on `parse`

### Added

- New unit tests.
- New option: use `alwaysUseHyphens` to only accept class name with hyphens like `bg-red`, `p-1rem` and so on, instead of `p1rem`, `m2` and so on. (default: `true`)
- `parse` method now can recognize parentheses and curly bracket as prefix value, previously only recognize square bracket value (e.g. nth-(4):bg-red, max-{445px}:flex).

### Removed

- Ability to use property shorthand inside bracket type.
- Alias feature, can be handled better
- `property` parameter in `ValueParams` type.

### Fixed

- Remaining `-dummy` on `secondValue` in `parse` method.
- Better value handling on function property and value in `processShorthand` method.

## `v0.3.0` - `2025-03-13`

### Changed

- Changed `type` into `group` in `processValue` method.

### Fixed

- `parse` method will parse prefix as type and value if there similar type or real value isn't specified.

### Removed

- `breakpoints` and `generateMediaQuery` is practically unnecessary for this core package.

---

This changelog is made manually since `13/03/2025`.
