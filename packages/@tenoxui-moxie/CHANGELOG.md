# Changelog

## `v0.5.0-alpha.2` - `2025-04-23`

### Changed

- Refactor `parse` method

## `v0.5.0-alpha.1` - `2025-04-22`

### Fixed

- Remove remaining separator from valueless class name

## `v0.5.0-alpha.0` - `2025-04-22`

### Added

- Function `property` (including function `value`) now have access to `raw` data of the class name its processing.

### Changed

- Return `null` when `key` is defined but in string property.
- Return reconstructed class name on `parse` method
- Refactor direct properties class name. functionality, return the CSS properties and variables instead of direct CSS rules.

### Deprecated

- Deprecating `alwaysUseHyphens` support, because if set to false, causing so many class names error.

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
