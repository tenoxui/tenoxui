/*!
 * TenoxUI CSS Framework v0.4.23 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
import property from "./lib/property.js";

let Classes = Object.keys(property).map(
  (className) => `[class*="${className}-"]`
);

function NewProp(name, values) {
  if (typeof name !== "string" || !Array.isArray(values)) {
    console.warn(
      "Invalid arguments for newProp. Please provide a string for name and an array for values."
    );
    return;
  }
  this[name] = values;
  Classes.push(`[class*="${name}-"]`);
  document.querySelectorAll(Classes.join(", "));
}

NewProp.prototype.tryAdd = function () {
  if (!this || Object.keys(this).length === 0) {
    console.warn("Invalid newProp instance:", this);
    return;
  }

  Object.assign(property, this);
};

export function addType(Types, Property) {
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }

  if (!Array.isArray(Property)) {
    throw new Error("Property must be an array");
  }

  new NewProp(Types, Property).tryAdd();
}
function MakeTenoxUI(element) {
  this.element = element;
  this.styles = property;
}
export default function tenoxui() {
  let Classes = Object.keys(property).map(
    (className) => `[class*="${className}-"]`
  );

  let AllClasses = document.querySelectorAll(Classes.join(", "));

  MakeTenoxUI.prototype.applyStyle = function (type, value, unit) {
    const properties = this.styles[type];

    if (properties) {
      properties.forEach((property) => {
        if (property === "filter") {
          const existingFilter = this.element.style[property];
          this.element.style[property] = existingFilter
            ? `${existingFilter} ${type}(${value}${unit})`
            : `${type}(${value}${unit})`;
        } else if (property === "flex") {
          this.element.style[property] = `1 1 ${value}${unit}`;
        } else if (
          property === "gridRow" ||
          property === "gridColumn" ||
          property === "gridRowStart" ||
          property === "gridColumnStart" ||
          property === "gridRowEnd" ||
          property === "gridColumnEnd"
        ) {
          this.element.style[property] = `span ${value}${unit}`;
        } else if (type === "grid-row" || type === "grid-col") {
          this.element.style[property] = `repeat(${value}${unit}, 1fr)`;
        } else if (type === "auto-grid-row" || type === "auto-grid-col") {
          this.element.style[
            property
          ] = `repeat(auto-fit, minmax(${value}${unit}, 1fr))`;
        } else if (value.startsWith("[") && value.endsWith("]")) {
          const cssVariable = value.slice(1, -1);
          this.element.style[property] = `var(--${cssVariable})`;
        } else {
          this.element.style[property] = `${value}${unit}`;
        }
      });
    }
  };

  MakeTenoxUI.prototype.applyStyles = function (className) {
    const match = className.match(
      /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:\[[^\]]+\]))([a-zA-Z%]*)/
    );

    if (match) {
      const type = match[1];
      const value = match[2];
      const unitOrValue = match[4];
      this.applyStyle(type, value, unitOrValue);
    }
  };

  MakeTenoxUI.prototype.applyMultiStyles = function (styles) {
    const styleArray = styles.split(/\s+/);
    styleArray.forEach((style) => {
      this.applyStyles(style);
    });
  };

  AllClasses.forEach((element) => {
    const classes = element.classList;
    const styler = new MakeTenoxUI(element);
    classes.forEach((className) => {
      styler.applyStyles(className);
    });
  });
}

export function makeStyle(selector, styles) {
  const applyStylesToElement = (element, styles) => {
    const styler = new MakeTenoxUI(element);
    styler.applyMultiStyles(styles);
  };

  if (typeof styles === "string") {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => applyStylesToElement(element, styles));
  } else if (typeof styles === "object") {
    Object.entries(styles).forEach(([classSelector, classStyles]) => {
      const elements = document.querySelectorAll(classSelector);
      elements.forEach((element) => applyStylesToElement(element, classStyles));
    });
  } else {
    console.warn(
      `Invalid styles format for "${selector}". Make sure you provide style correctly`
    );
  }
}

export function defineProps(propsObject) {
  Object.entries(propsObject).forEach(([propName, propValues]) => {
    if (Array.isArray(propValues)) {
      const propInstance = new NewProp(propName, propValues);
      propInstance.tryAdd();
    } else {
      console.warn(
        `Invalid property values for "${propName}". Make sure you provide values as an array.`
      );
    }
  });
}

export function makeStyles(stylesObject) {
  Object.entries(stylesObject).forEach(([selector, styles]) => {
    makeStyle(selector, styles);
  });
}

export function moreColor() {
  const makeColor = (element, pattern, property, format) => {
    const match = element.className.match(pattern);

    if (match) {
      element.style[property] = format(match);
    }
  };

  const colorClass = document.querySelectorAll(
    '[class*="bg-"], [class*="tc-"], [class*="border-"]'
  );

  const colorTypes = {
    bg: "background",
    tc: "color",
    border: "borderColor",
  };

  const colorFormats = {
    rgb: (match) => `rgb(${match.slice(1, 4).join(",")})`,
    rgba: (match) => `rgba(${match.slice(1, 5).join(",")})`,
    hex: (match) => `#${match[1]}`,
  };

  colorClass.forEach((element) => {
    for (const type in colorTypes) {
      for (const format in colorFormats) {
        const pattern = new RegExp(`${type}-${format}\\(([^)]+)\\)`);
        makeColor(element, pattern, colorTypes[type], colorFormats[format]);
      }
      const hexPattern = new RegExp(`${type}-([0-9a-fA-F]{3,6})`);
      makeColor(element, hexPattern, colorTypes[type], colorFormats["hex"]);
    }
  });
}

moreColor();
tenoxui();
