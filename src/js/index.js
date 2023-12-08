/**!
 * copyright (c) 2023 nousantx
 */

import property from "./property.js";
function makeTenoxUI(element) {
  this.element = element;
  this.styles = property;
}

makeTenoxUI.prototype.applyStyle = function (type, value, unit) {
  const properties = this.styles[type];

  if (properties) {
    properties.forEach((property) => {
      // Filter Custom Property
      if (property === "filter") {
        const existingFilter = this.element.style[property];
        this.element.style[property] = existingFilter
          ? `${existingFilter} ${type}(${value}${unit})`
          : `${type}(${value}${unit})`;
      }
      // Make custom property for flex
      else if (property === "flex") {
        this.element.style[property] = `1 1 ${value}${unit}`;
      } // Grid System Property
      else if (
        property === "gridRow" ||
        property === "gridColumn" ||
        property === "gridRowStart" ||
        property === "gridColumnStart" ||
        property === "gridRowEnd" ||
        property === "gridColumnEnd"
      ) {
        this.element.style[property] = `span ${value}${unit}`;
      } else if (type === "grid-row" || type === "grid-col") {
        this.element.style[property] = `repeat(${value}${unit}, 1fr))`;
      } else if (type === "auto-grid-row" || type === "auto-grid-col") {
        this.element.style[
          property
        ] = `repeat(auto-fit, minmax(${value}${unit}, 1fr))`;
      }
      // Default value and unit
      else {
        this.element.style[property] = `${value}${unit}`;
      }
    });
  }
};

makeTenoxUI.prototype.applyStyles = function (className) {
  // Match all type and
  const match = className.match(
    /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:\[[^\]]+\]))([a-zA-Z%]*)/
  );

  if (match) {
    // type = property class. Example: p-, m-, flex-, fx-, filter-, etc.
    const type = match[1];
    // value = possible value. Example: 10, red, blue, etc.
    const value = match[2];
    // unit = possible unit. Example: px, rem, em, s, %, etc.
    const unitOrValue = match[4];
    // Combine all to one class. Example 'p-10px', 'flex-100px', 'grid-row-6', etc.
    this.applyStyle(type, value, unitOrValue);
  }
};

// TenoxUI Selector
const AllClasses = document.querySelectorAll(
  '[class*="p-"], [class*="pt-"], [class*="pb-"], [class*="pr-"], [class*="pl-"], [class*="m-"], [class*="mt-"], [class*="mb-"], [class*="mr-"], [class*="ml-"], [class*="fs-"], [class*="fw-"], [class*="z-"], [class*="t-"], [class*="b-"], [class*="r-"], [class*="l-"], [class*="br-"], [class*="bw-"], [class*="w-"], [class*="w-mx-"], [class*="w-mn-"], [class*="h-"], [class*="h-mx-"], [class*="h-mn-"], [class*="fx-"], [class*="gap-"], [class*="ti-"], [class*="rt-"], [class*="backdrop-blur-"], [class*="ph-"], [class*="pv-"], [class*="mv-"], [class*="mh-"], [class*="text-space-"], [class*="word-space-"], [class*="line-height-"], [class*="radius-tl-"], [class*="radius-tr-"], [class*="radius-bl-"], [class*="radius-br-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="gs-"], [class*="blur-"], [class*="opa-"], [class*="x-"], [class*="bw-left-"], [class*="bw-right-"], [class*="bw-top-"], [class*="bw-bottom-"], [class*="scale-"], [class*="grid-row-"], [class*="grid-col-"], [class*="grid-item-row-"], [class*="grid-item-col-"]'
);

AllClasses.forEach((element) => {
  const classes = element.classList;
  const makeTx = new makeTenoxUI(element);
  classes.forEach((className) => {
    makeTx.applyStyles(className);
  });
});
