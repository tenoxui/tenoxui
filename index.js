/*!
 * TenoxUI v0.0.1
 * Copyright (c) 2023 NOuSantx | Vantenox ID. All Rights Reserved.
 * License : https://github.com/NOuSantx/tenoxui/blob/main/LICENSE
 * Maintained by NOuSantx & Vantenox ID
 */

// import applyTenox from "./plugins/applyTenox.js";
import { AllProperty } from "./src/js/allProperty.min.js";
import applyTenox from "./plugins/applyTenox.js";

let Classes = [
  '[class*="p-"], [class*="pt-"], [class*="pb-"], [class*="pr-"], [class*="pl-"], [class*="m-"], [class*="mt-"], [class*="mb-"], [class*="mr-"], [class*="ml-"], [class*="fs-"], [class*="fw-"], [class*="z-"], [class*="t-"], [class*="b-"], [class*="r-"], [class*="l-"], [class*="br-"], [class*="bw-"], [class*="w-"], [class*="w-mx-"], [class*="w-mn-"], [class*="h-"], [class*="h-mx-"], [class*="h-mn-"], [class*="fx-"], [class*="gap-"], [class*="ti-"], [class*="rt-"], [class*="backdrop-blur-"], [class*="ph-"], [class*="pv-"], [class*="mv-"], [class*="mh-"], [class*="text-space-"], [class*="word-space-"], [class*="line-height-"], [class*="radius-tl-"], [class*="radius-tr-"], [class*="radius-bl-"], [class*="radius-br-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="gs-"], [class*="blur-"], [class*="opa-"], [class*="x-"], [class*="bw-left-"], [class*="bw-right-"], [class*="bw-top-"], [class*="bw-bottom-"], [class*="scale-"], [class*="filter-"], [class*="brightness-"], [class*="sepia-"], [class*="grayscale-"], [class*="contrast-"], [class*="saturate-"], [class*="hue-rotate-"], [class*="bs-"]',
];

// Get all class from HTML Element
export let AllClasses = document.querySelectorAll(Classes.join(", "));
// Custom Property FUnction
export function CustomProperty(name, values) {
  this[name] = values;
  // Apply new `Type` and add it to `AllClasses`
  Classes.push(`[class*="${name}-"]`);
  AllClasses = document.querySelectorAll(Classes.join(", "));
}

// Add custom property to `AllProperty`
CustomProperty.prototype.applyTenoxCustom = function () {
  Object.assign(AllProperty, this);
};

// Style Declare
export default function TenoxUI(element) {
  this.element = element;
  // { {class-name} : ['class-property'] }
  this.styles = AllProperty;
}

// Styles Ruler
TenoxUI.prototype.applyStyle = function (type, value, unit) {
  const properties = this.styles[type];
  if (properties) {
    properties.forEach((property) => {
      // Custom `filter` property styles
      if (property === "filter") {
        // Check if the filter property is already set
        const existingFilter = this.element.style[property];
        // Concatenate the new filter value with the existing value
        this.element.style[property] = existingFilter
          ? `${existingFilter} ${type}(${value}${unit})`
          : `${type}(${value}${unit})`;
      }

      // Border Style
      // else if (property === "borderStyle") {
      //   this.element.style[property] = `${value}`;
      //   console.log(this);
      // }
      // Custom `flex` property
      else if (property === "flex") {
        this.element.style[property] = `1 1 ${value}${unit}`;
      }
      // Default Styles for `AllProperty`
      else {
        this.element.style[property] = `${value}${unit}`;
      }
    });
  }
};
// Match all possible class.
TenoxUI.prototype.applyStyles = function (className) {
  // Matching all class with all possible Value
  const match = className.match(/([a-zA-Z]+)-([a-zA-Z0-9.-]+)([a-zA-Z]*)/);

  if (match) {
    // type = property class
    const type = match[1];
    // value = possible value. Example: 10, 50, 100, etc
    const value = match[2];
    // unit = possible unit. Example: px, rem, em, s, etc
    const unitOrValue = match[4];
    // Manual: How to apply the style to an element
    this.applyStyle(type, value, unitOrValue);
  }
};
// Apply the style
applyTenox();
// Apply the style for new `CustomProperty`
export const TenoxCustomApplier = () => {
  applyTenox();
};
