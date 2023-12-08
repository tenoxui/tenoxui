/**
 * copyright (c) 2023 nousantx
 */ import property from "./property.js";

const property = property;
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

function TenoxColor() {
  const setColor = (element, pattern, property, format) => {
    const match = element.className.match(pattern);
    if (match) {
      element.style[property] = format(match);
    }
  };
  // Class
  const ColorableClass = document.querySelectorAll(
    '[class*="bg-"], [class*="tc-"], [class*="border-"]'
  );
  ColorableClass.forEach((element) => {
    // For CSS variables
    setColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `var(--${match[1]})`
    );
    setColor(
      element,
      /tc-([a-zA-Z0-9-]+)/,
      "color",
      (match) => `var(--${match[1]})`
    );
    setColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `var(--${match[1]})`
    );
    // For RGB colors
    setColor(
      element,
      /bg-rgb\((\d+),(\d+),(\d+)\)/,
      "background",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    setColor(
      element,
      /tc-rgb\((\d+),(\d+),(\d+)\)/,
      "color",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    setColor(
      element,
      /border-rgb\((\d+),(\d+),(\d+)\)/,
      "borderColor",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    // For RGBA colors
    setColor(
      element,
      /bg-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "background",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );
    setColor(
      element,
      /tc-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "color",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );
    setColor(
      element,
      /border-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "borderColor",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );

    // For HEX colors
    setColor(
      element,
      /bg-([0-9a-fA-F]{3,6})/,
      "background",
      (match) => `#${match[1]}`
    );
    setColor(
      element,
      /tc-([0-9a-fA-F]{3,6})/,
      "color",
      (match) => `#${match[1]}`
    );
    setColor(
      element,
      /border-([0-9a-fA-F]{3,6})/,
      "borderColor",
      (match) => `#${match[1]}`
    );
    // All Posible Color In Css
    setColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `${match[1]}`
    );
    setColor(element, /tc-([a-zA-Z0-9-]+)/, "color", (match) => `${match[1]}`);
    setColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `${match[1]}`
    );
  });
}
TenoxColor();
