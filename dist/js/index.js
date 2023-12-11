/*!
 *
 * TenoxUI CSS Framework v0.2.0
 *
 * copyright (c) 2023 NOuSantx
 *
 * license: https://github.com/nousantx/tenoxui/blob/main/LICENSE
 *
 */
import property from "./property.js";
let Classes = Object.keys(property).map(
  (className) => `[class*="${className}-"]`
);
// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
let AllClasses = document.querySelectorAll(Classes.join(", "));
function newProp(name, values) {
  if (typeof name !== "string" || !Array.isArray(values)) {
    console.warn(
      "Invalid arguments for newProp. Please provide a string for name and an array for values."
    );
    return;
  }
  this[name] = values;
  Classes.push(`[class*="${name}-"]`);
  AllClasses = document.querySelectorAll(Classes.join(", "));
}
newProp.prototype.tryAdd = function () {
  if (!this || Object.keys(this).length === 0) {
    console.warn("Invalid newProp instance:", this);
    return;
  }
  Object.assign(property, this);
};
export function MakeProp(Types, Property) {
  // Check if 'Types' is a string
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }
  // Check if 'Property' is an array
  if (!Array.isArray(Property)) {
    throw new Error("Property must be an array");
  }
  new newProp(Types, Property).tryAdd();
}
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
      } // CSS Variables support
      else if (value.startsWith("[") && value.endsWith("]")) {
        // Check if the value is a CSS variable enclosed in square brackets
        const cssVariable = value.slice(1, -1);
        this.element.style[property] = `var(--${cssVariable})`;
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
// MultyStyles function: Give multi style or class into one selector.
makeTenoxUI.prototype.applyMultiStyles = function (styles) {
  // Splitting the styles
  const styleArray = styles.split(/\s+/);
  // Applying the styles using forEach and `applyStyles`
  styleArray.forEach((style) => {
    this.applyStyles(style);
  });
};
// MultiStyles function
export function MakeStyles(className, styles) {
  // Select all elements with the specified class
  const elements = document.querySelectorAll(className);
  // Check if there are any elements with the specified class
  if (elements.length === 0) {
    console.warn(`No elements found with class: ${className}`);
    return;
  }
  // Iterate through each element and apply styles
  elements.forEach((element) => {
    // Make new styler for each element
    const styler = new makeTenoxUI(element);
    // Apply styles using `applyMultiStyles`
    styler.applyMultiStyles(styles);
  });
}
// Define the TenoxUI function to apply the styles
export default function TenoxUI() {
  // Iterate over elements with AllClasses
  AllClasses.forEach((element) => {
    // Get the list of classes for the current element
    const classes = element.classList;
    // Make TenoxUI
    const makeTx = new makeTenoxUI(element);
    // Iterate over classes and apply styles using makeTenoxUI
    classes.forEach((className) => {
      makeTx.applyStyles(className);
    });
  });
}
TenoxUI();
