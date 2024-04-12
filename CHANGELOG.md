# Changelog

## [0.7.1] - 12-04-2024

- Update `applyHovers` funtion, removing `notHover` parameter for giving styles firstly before hovering

## [0.7] - 12-04-2024

- Add `applyHover` and `applyHovers` function
- Remove `makeColor` function
- Remove unused types and properties for better size
- Add declaration file

## [0.6.1] - 23-03-2024

- Nested in nested problem
- Not applying the class style in esm module ReactJS
- Change `makeTx` variable on `tenoxui` function to `styler`
- Improving `makeTenoxUI` constructor in esm variant
- Update `package.json` scripts

## [0.6] - 13-03-2024

- Single `property` when make a new type and property now dont need wrapped inside an array
- `Nested Style` now available
- Update ESM issues can't rendering on client side
- HEX color value must started using `#`, not using the color code directly
- Changed `regexp` on `applyStyles` function to recognize `#` for HEX color value
- `makeTenoxUI` function can be imported in ESM variant

## [0.5.1] - 28-02-2024

- Fix `tenoxui` function not adding new props to `allProperty`.
- Make `tenoxui` function in `tenoxui.esm` only work on client side
- Fix `place-items` property on `property.js` file

## [0.5] - 24-01-2024

- Finalizing `backdrop-filter` and `transform` property
- Added some lib for some new functionality
- Change `rotate` and `scale` property into `transform` value
- Finalize Javascript Framework
- React JS Compability.

## [0.4.24] - 10-01-2024

- Update some functionality on `tenoxui.esm.js`
- `text-transform` not spelling correctly.

## [0.4.4] ~ [0.4.22] - 4-01-2024

- Just update and changing some rules in `package.json`.

## [0.4.3] - 3-01-2024

- Change `MakeProp` to `addType`
- Change `MultiProps` to `defineProps`
- Change `MakeStyle` to `makeStyle`
- Change `MultiStyles` to `makeStyles`

## [0.4.2] - 3-01-2024

- Change some functionality for prop and styling rules.

## [0.4.1] - 24-12-2023

- `grid-row` and `grid-col` bug fix not recognize.

## [0.4.0] - 12-12-2023

- Separated `cjs` and `esm`, both will have different file now.

## [0.3.0] - 12-12-2023

- Finishing feature `MultiProps` and `MultiStyles`

## [0.2.1] - 12-12-2023

- Trying to migrate to Typescript XD.
- Added `MultiProps` and `MultiStyles` feature.
- Deleting HTML test directory.

## [0.2.0] - 11-12-2023

- Added new feature `MakeStyles` that allow you apply multi styles with classes into element using desired selector.
- Optimizing `color` feature, and-
- Removing non-bracket `CSS Variable` for `color` related type.
- Fixing versioning from `v0.1.4` still appear on `v0.1.5`

## [0.1.5] - 10-12-2023

- Added `css variable` for all property and type, not just color property.
- Added `aspect-ratio` property.
- Adding some `css variable` for value that has two word or separated by hyphen, such as `flex-start` and `column-reverse`

## [0.1.4] - 10-12-2023

- Fixing versioning from v0.1.3

## [0.1.3] - 10-12-2023

- Add `background` feature, `-size`, `-clip`, `-repeat`, and more.
- Add `float` property
- Patch `position` and `display
- Upcoming feature: `css variable` compability for all property and type
- Some change on CSS file

## [0.1.2] - 9-12-2023

- Add new feature: `Custom Property`
- `AllClasses` now is more optimized. The className is taken from type name on `property` and combined it to previous class selector.
- The example of custom property will on `test/html/custom-property.html`

## [0.1.1] - 9-12-2023

- New text property
- Flexbox optimize
- Add new type `box` which will set the `width` and `height` at the same time

## [0.1.0] - 8-12-2023

- Update to v0.1.0
- Adding `%` unit to match pattern
- Change match Regex pattern
- Add Grid System and simple example
- Added new property: `overflow`, `border-style`, `filter`, `cursor`, `position`, `scale`, and `rotate`

## [0.0.5] - 8-12-2023

- Currently, the value can just recognize numerical value, like `10px`, `3.4s`, or `45deg`. and now, it can recognize alphabetical value.

## [0.0.4] - 7-12-2023

- In this patch, `property` in `property.js` will declared as arrays, because there may be `type` that have more than 2 `property`.

## [0.0.3] - 7-12-2023

- Preparing to migrate from using `switch case` to `proptotype` instead.
- Adding `property.js` and `selector.css`.

## [0.0.2] - 6-12-2023

- Added color from CSS Variable name, supported css variables `tc-`, `bg-`, and `border-`.
- Fixing some bugs related to `color.js`.
- Adding new feature `transform` for `scale`, `transformX`, `transformY`, and `rotate`.

## [0.0.1] - 5-12-2023

- Initial release.
