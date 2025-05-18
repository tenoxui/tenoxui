Changelog

## `v1.0.0-alpha.4` - `2025-05-19`

### Changed

- `underline-offset` utility now use `px` for default `unit`
- New `size` key in `bg-*` utility to set `background-size` property (e.g. `bg-[size:...]`)
- New `color` key in `border-{direction}-*` utility to set `border-{direction}-color` property (e.g. `border-x-(color:...)`)

### Added

- Added `size`, `space-x`, `space-y`, `box-sizing`, and `display` to `typeOrder`
- Added `_size` utility for creating custom sizing property or variable
- Added `_color` utility for creating custom color property or variable
- Added `_all` utility for creating custom property or variable

### Fixed

- Direct type like `border-x` that supposed to generate `border-inline-width: 1px` generating `border: x`
- `line-height` property now will be multiply by `sizing` if the input `value` is a `number` and not arbitrary value (starts with `[` or `(`)
- `grid-cols` & `grid-rows` can't use arbitrary value

### **Removed**

- Old function related to `createColorType` in `utils/createValue.ts`

## `v1.0.0-alpha.3` - `2025-05-18`

### Added

- Class names order from tailwindcss to give the right order of generated CSS
- `order` option in `preset` to enable typeOrder, default `false`
- `border-style` in `divide-*` utility
- `ps-*` and `pe-*` utilities
- `vh` and `vw` value aliases for `100vh` and `100vw`
- Since `tenoxui/moxie@0.7`, the prefix `parser` now can also use `secondValue`, so added new condition for `customVariants` to disable it

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
