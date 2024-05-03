# Changelog

## [v0.8] - [2024-3-05]

- Custom value feature
- Added types declaration
- Remove `addType` and `applyHover` function
- Stopped maintain `src/css`
- Types change :
  - `"scale": "transform"` => `"scale": "scale"`
  - `"rt": "transform"` => `"rt": "rotate"`
  - `"overX": "overflowX"` => `"over-x": "overflowX"`
  - `"overY": "overflowY"` => `"over-y": "overflowY"`
- Removed common used types :
  - `top`
  - `left`
  - `right`
  - `bottom`
  - `box-sizing`
  - `visibility`

## [v0.7.1] - [2024-12-04]

- Update `applyHovers` funtion, removing `notHover` parameter for giving styles firstly before hovering

## [v0.7] - [2024-12-04]

- Add `applyHover` and `applyHovers` function
- Remove `makeColor` function
- Remove unused types and properties for better size
- Add declaration file

## [v0.6.1] - [2024-23-03]

- Nested in nested problem
- Not applying the class style in esm module ReactJS
- Change `makeTx` variable on `tenoxui` function to `styler`
- Improving `makeTenoxUI` constructor in esm variant
- Update `package.json` scripts

## [v0.6] - [2024-13-03]

- Single `property` when make a new type and property now dont need wrapped inside an array
- `Nested Style` now available
- Update ESM issues can't rendering on client side
- HEX color value must started using `#`, not using the color code directly
- Changed `regexp` on `applyStyles` function to recognize `#` for HEX color value
- `makeTenoxUI` function can be imported in ESM variant

## [v0.5.1] - [2024-28-02]

- Fix `tenoxui` function not adding new props to `allProperty`.
- Make `tenoxui` function in `tenoxui.esm` only work on client side
- Fix `place-items` property on `property.js` file

## [v0.5] - [2024-24-01]

- Finalizing `backdrop-filter` and `transform` property
- Added some lib for some new functionality
- Change `rotate` and `scale` property into `transform` value
- Finalize Javascript Framework
- React JS Compability.

## [v0.4.24] - [2024-10-01]

- Update some functionality on `tenoxui.esm.js`
- `text-transform` not spelling correctly.

## [v0.4.4] ~ [v0.4.22] - [2024-4-01]

- Just update and changing some rules in `package.json`.

## [v0.4.3] - [2024-3-01]

- Change `MakeProp` to `addType`
- Change `MultiProps` to `defineProps`
- Change `MakeStyle` to `makeStyle`
- Change `MultiStyles` to `makeStyles`

## [v0.4.2] - [2024-3-01]

- Change some functionality for prop and styling rules.

## [v0.4.1] - [2023-24-12]

- `grid-row` and `grid-col` bug fix not recognize.

## [v0.4.0] - [2023-12-12]

- Separated `cjs` and `esm`, both will have different file now.

## [v0.3.0] - [2023-12-12]

- Finishing feature `MultiProps` and `MultiStyles`

## [v0.2.1] - [2023-12-12]

- Trying to migrate to Typescript XD.
- Added `MultiProps` and `MultiStyles` feature.
- Deleting HTML test directory.

## [v0.2.0] - [2023-11-12]

- Added new feature `MakeStyles` that allow you apply multi styles with classes into element using desired selector.
- Optimizing `color` feature, and-
- Removing non-bracket `CSS Variable` for `color` related type.
- Fixing versioning from `v0.1.4` still appear on `v0.1.5`

## [v0.1.5] - [2023-10-12]

- Added `css variable` for all property and type, not just color property.
- Added `aspect-ratio` property.
- Adding some `css variable` for value that has two word or separated by hyphen, such as `flex-start` and `column-reverse`

## [v0.1.4] - [2023-10-12]

- Fixing versioning from v0.1.3

## [v0.1.3] - [2023-10-12]

- Add `background` feature, `-size`, `-clip`, `-repeat`, and more.
- Add `float` property
- Patch `position` and `display
- Upcoming feature: `css variable` compability for all property and type
- Some change on CSS file

## [v0.1.2] - [2023-9-12]

- Add new feature: `Custom Property`
- `AllClasses` now is more optimized. The className is taken from type name on `property` and combined it to previous class selector.
- The example of custom property will on `test/html/custom-property.html`

## [v0.1.1] - [2023-9-12]

- New text property
- Flexbox optimize
- Add new type `box` which will set the `width` and `height` at the same time

## [v0.1.0] - [2023-8-12]

- Update to v0.1.0
- Adding `%` unit to match pattern
- Change match Regex pattern
- Add Grid System and simple example
- Added new property: `overflow`, `border-style`, `filter`, `cursor`, `position`, `scale`, and `rotate`

## [v0.0.5] - [2023-8-12]

- Currently, the value can just recognize numerical value, like `10px`, `3.4s`, or `45deg`. and now, it can recognize alphabetical value.

## [v0.0.4] - [2023-7-12]

- In this patch, `property` in `property.js` will declared as arrays, because there may be `type` that have more than 2 `property`.

## [v0.0.3] - [2023-7-12]

- Preparing to migrate from using `switch case` to `proptotype` instead.
- Adding `property.js` and `selector.css`.

## [v0.0.2] - [2023-6-12]

- Added color from CSS Variable name, supported css variables `tc-`, `bg-`, and `border-`.
- Fixing some bugs related to `color.js`.
- Adding new feature `transform` for `scale`, `transformX`, `transformY`, and `rotate`.

## [v0.0.1] - [2023-5-12]

- Initial release.

### Why not using any notation? I want. But, It's still small project, so... i think this is enough :D
