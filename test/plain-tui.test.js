/*!
 * TenoxUI CSS Framework v0.5.1 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
// All TenoxUI `type` and `property`
let property = {
  p: ["padding"],
};
// Make classes from type name from properties key name
let Classes = Object.keys(property).map(
  (className) => `[class*="${className}-"]`
);
// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
let AllClasses = document.querySelectorAll(Classes.join(", "));
// Props maker function :)
class newProp {
  constructor(name, values) {
    // Error handling, the type must be a string, properties must be an array
    if (typeof name !== "string" || !Array.isArray(values)) {
      console.warn(
        "Invalid arguments for newProp. Please provide a string for name and an array for values."
      );
      return;
    }
    this[name] = values;
    // Combine the type and property to allProperty after defined it to Classes and AllClasses
    Classes.push(`[class*="${name}-"]`);
    AllClasses = document.querySelectorAll(Classes.join(", "));
  }
  // Function to handle add `type` and `property`
  tryAdd() {
    if (!this || Object.keys(this).length === 0) {
      console.warn("Invalid newProp instance:", this);
      return;
    }
    // Added new `type` and `property` to the All Property
    Object.assign(property, this);
  }
}
function addType(Types, Property) {
  // Check if 'Types' is a string
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }
  // Check if 'Property' is an array
  if (!Array.isArray(Property)) {
    throw new Error("Property must be an array");
  }
  // Add new property
  new newProp(Types, Property).tryAdd();
}
// TenoxUI make style class
class makeTenoxUI {
  // TenoxUI constructor
  constructor(element) {
    this.element = element;
    this.styles = property;
  }
  // `applyStyle`: Handle the styling and custom value for property
  applyStyle(type, value, unit) {
    const properties = this.styles[type];
    // If properties matched the `type` or `property` from `allProperty`
    if (properties) {
      properties.forEach((property) => {
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is wrapped with `[]`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable enclosed in square brackets
        if (value.startsWith("[") && value.endsWith("]")) {
          // Slice value from the box and identify the
          const cssVariable = value.slice(1, -1);
          this.element.style[property] = `var(--${cssVariable})`;
        }
        // Default value and unit
        else {
          this.element.style[property] = `${value}${unit}`;
        }
      });
    }
  }

  // Handle all possible values
  applyStyles(className) {
    // Using RegExp to handle the value
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
  }
  // Multi styler function, style through javascript.
  applyMultiStyles(styles) {
    // Splitting the styles
    const styleArray = styles.split(/\s+/);
    // Applying the styles using forEach and `applyStyles`
    styleArray.forEach((style) => {
      this.applyStyles(style);
    });
  }
}
// Applied multi style into all elements with the specified element, possible to all selector
function makeStyle(selector, styles) {
  const applyStylesToElement = (element, styles) => {
    const styler = new makeTenoxUI(element);
    styler.applyMultiStyles(styles);
  };
  if (typeof styles === "string") {
    // If styles is a string, apply it to the specified selector
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => applyStylesToElement(element, styles));
  } else if (typeof styles === "object") {
    // If styles is an object, iterate through its key-value pairs
    Object.entries(styles).forEach(([classSelector, classStyles]) => {
      const elements = document.querySelectorAll(classSelector);
      elements.forEach((element) => applyStylesToElement(element, classStyles));
    });
  }
  // Error Handling for makeStyle
  else {
    console.warn(
      `Invalid styles format for "${selector}". Make sure you provide style correctly`
    );
  }
}
// MultiProps function: Add multiple properties from the provided object
function defineProps(propsObject) {
  // Iterate over object entries
  Object.entries(propsObject).forEach(([propName, propValues]) => {
    // Check if propValues is an array
    if (Array.isArray(propValues)) {
      // Create a new CustomProperty
      const propInstance = new newProp(propName, propValues);
      // Add it to AllProperty at once
      propInstance.tryAdd();
    }
    // Error Handling for `defineProps`
    else {
      console.warn(
        `Invalid property values for "${propName}". Make sure you provide values as an array.`
      );
    }
  });
}
// Apply multiple styles into elements using selector, all selector is possible
function makeStyles(stylesObject) {
  Object.entries(stylesObject).forEach(([selector, styles]) => {
    makeStyle(selector, styles);
  });
}
// Applying the style to all elements ✨
function tenoxui() {
  // Make classes from type name from properties key name
  let Classes = Object.keys(property).map(
    (className) => `[class*="${className}-"]`
  );
  // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
  let AllClasses = document.querySelectorAll(Classes.join(", "));
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
tenoxui(); // init: tenoxui
//# sourceMappingURL=/src/js/tenoxui.js.map
