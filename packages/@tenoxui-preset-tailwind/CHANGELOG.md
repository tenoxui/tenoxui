# Changelog

## `v1.0.0-alpha.3` - `2025-05-18`

### Added

- Class names order from tailwindcss to give the right order of generated CSS
- `order` option in `preset` to enable typeOrder, default `false`
- `border-style` in `divide-*` utility
- `ps-*` and `pe-*` utilities
- `vh` and `vw` value aliases for `100vh` and `100vw`

### Fixed

- Most of colored type doesn't support `current` as value
- Some colored type uses `secondUnit` instead of `secondValue` as included parameter

## `v1.0.0-alpha.2` - `2025-05-18`

### Added

- Add reserved `reservedVariantChars` related to tailwindcss variants
- `*` and `**` variants
- New utilities: `space-x-*`, `space-y-*`, `divide-x-*`, `divide-y-*`, `divide-*`, `bg-radial-*`, and `bg-conic-*`

### Changed

- Merging `customVariants` with default `variants`
- Update `variants` name, such as `at-max` => `@max`

### Fixed

- Forgot to include `gradient`-related variables

## `v1.0.0-alpha.1` - `2025-05-11`

### Added

- TailwindCSS `preflight` and default `properties`

### Fixed

- `leading-*` | `text-{size}/*` utility shouldn't compute value if the input was number. (prev: `leading-1.5` => `0.365rem` | now: `leading-1.5` => `1.5`)

## `v1.0.0-alpha.0` - `2025-05-10`

### Development

- Initial release.
