# Changelog

## `v0.4.0` - `Unreleased`

### Added

- New unit tests
- `parse` method now can recognize parentheses and curly bracket as prefix value, previously only recognize square bracket value (e.g. nth-(4):bg-red, max-{445px}:flex)

### Removed

- Ability to use property shorthand inside bracket type
- Alias feature, can be handled better
- `property` parameter in `ValueParams` type

### Fixed

- Remaining `-dummy` on `secondValue` in `parse` method
- Better value handling on function property and value in `processShorthand` method

## `v0.3.0` - `2025-03-13`

### Changed

- Changed `type` into `group` in `processValue` method.

### Fixed

- `parse` method will parse prefix as type and value if there similar type or real value isn't specified.

### Removed

- `breakpoints` and `generateMediaQuery` is practically unnecessary for this core package.

---

This changelog is made manually since `13/03/2025`.
