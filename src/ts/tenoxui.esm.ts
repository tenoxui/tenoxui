/*!
 * tenoxui/css v0.8.0 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

// TenoxUI all types and properties
import property from "./lib/property.js";

let Classes: String[], AllClasses: NodeListOf<HTMLElement>;

// Generate className from property key name, or property type
Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);

// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
AllClasses = document.querySelectorAll(Classes.join(", "));

// Props maker function :)
class newProp {
  constructor(name: string, values: string[]) {
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
  tryAdd(): void {
    if (!this || Object.keys(this).length === 0) {
      console.warn("Invalid newProp instance:", this);
      return;
    }
    // Added new `type` and `property` to the All Property
    Object.assign(property, this);
  }
}

// TenoxUI make style class
class makeTenoxUI {
  element: HTMLElement;
  styles: any;

  // TenoxUI constructor
  constructor(element: HTMLElement) {
    this.element = element;
    this.styles = property;
  }
  // `applyStyle`: Handle the styling and custom value for property
  applyStyle(type: string, value: string, unit: string): void {
    // the styles with let, not constant, because the properties no longer using array, optionally it can just be string
    let properties = this.styles[type];
    // If properties matched the `type` or `property` from `allProperty`
    if (properties) {
      // If properties has only one css property and it was string, not wrapped inside an array
      if (!Array.isArray(properties)) {
        // Convert the string value from property into an array
        properties = [properties];
      }
      properties.forEach((property: string) => {
        // Filter Custom Property
        if (property === "ftr") {
          const existingFilter = this.element.style[property];
          this.element.style[property] = existingFilter
            ? `${existingFilter} ${type}(${value}${unit})`
            : `${type}(${value}${unit})`;
        }
        // Make custom property for flex
        else if (type === "flex-auto") {
          this.element.style[property] = `1 1 ${value}${unit}`;
        }
        // backdrop filter styles handler
        else if (property === "bFt") {
          const filters = [
            "blur",
            "sepia",
            "saturate",
            "grayscale",
            "brightness",
            "invert",
            "contrast",
          ];
          const backdropFunctions = {};
          filters.forEach((filter) => {
            backdropFunctions[`back-${filter}`] = filter;
          });
          const backdropFunction = backdropFunctions[type];
          if (backdropFunction) {
            this.element.style.backdropFilter = `${backdropFunction}(${value}${unit})`;
          }
        }
        // Transform single value
        else if (property === "tra") {
          const transformFunctions = {
            translate: "translate",
            "move-x": "translateX",
            "move-y": "translateY",
            matrix: "matrix",
            "matrix-3d": "matrix3d",
            "scale-3d": "scale3d",
            "scale-x": "scaleX",
            "scale-y": "scaleY",
            "skew-x": "skewX",
            "skew-y": "skewY",
          };
          const transformFunction = transformFunctions[type];
          if (transformFunction) {
            this.element.style.transform = `${transformFunction}(${value}${unit})`;
          }
        }
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is wrapped with curly bracket `{}`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable enclosed in curly brackets `{}`
        else if (value.startsWith("{") && value.endsWith("}")) {
          // Slice value from the curly brackets
          const cssVariable = value.slice(1, -1);
          this.element.style[property] = `var(--${cssVariable})`;
        }
        /*
         * Custom values support 🪐
         *
         * Check className if the `value` is wrapped with square bracket `[]`,
         * if so then this is treated as custom value and ignore default value.
         */
        // Check if the value is a CSS variable enclosed in square bracket `[]`
        else if (value.startsWith("[") && value.endsWith("]")) {
          const values = value.slice(1, -1).replace(/\\_/g, " ");
          // if value start with `--`, generate value as css variable
          if (values.startsWith("--")) {
            this.element.style[property] = `var(${values})`;
          }
          // else, will use default `values`
          else {
            this.element.style[property] = values;
          }
        } else {
          /*
           * This is default value handler
           * All types will have this as default values, no additional value
           */
          this.element.style[property] = `${value}${unit}`;
        }
      });
    }
  }
  // Handle all possible values
  applyStyles(className: string): void {
    // Using RegExp to handle the value
    const match = className.match(
      /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\{[^\}]+\}))([a-zA-Z%]*)/
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
  applyMultiStyles(styles: string): void {
    // Splitting the styles
    const styleArray = styles.split(/\s+/);
    // Applying the styles using forEach and `applyStyles`
    styleArray.forEach((style: string) => {
      this.applyStyles(style);
    });
  }
}

// Applied multi style into all elements with the specified element, possible to all selector
function makeStyle(
  selector: string,
  styles: string | Record<string, string>
): void {
  const applyStylesToElement = (element: HTMLElement, styles: string): void => {
    const styler = new makeTenoxUI(element);
    styler.applyMultiStyles(styles);
  };
  if (typeof styles === "string") {
    // If styles is a string, apply it to the specified selector
    const elements = document.querySelectorAll(selector);
    elements.forEach((element: HTMLElement) =>
      applyStylesToElement(element, styles)
    );
  } else if (typeof styles === "object") {
    // If styles is an object, iterate through its key-value pairs
    Object.entries(styles).forEach(([classSelector, classStyles]) => {
      const elements = document.querySelectorAll(classSelector);
      elements.forEach((element: HTMLElement) =>
        applyStylesToElement(element, classStyles)
      );
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
function defineProps(
  ...propsObjects: Record<string, string | string[]>[]
): void {
  propsObjects.forEach((propsObject) => {
    // Iterate over object entries
    Object.entries(propsObject).forEach(([propName, propValues]) => {
      // Check if propValues is an array or string
      if (typeof propValues !== "string" && !Array.isArray(propValues)) {
        console.warn(
          `Invalid property values for "${propName}". Make sure you provide values as an array.`
        );
      }
      // if the propValues is a string, convert into array
      const processedValues: string[] =
        typeof propValues === "string"
          ? [propValues]
          : (propValues as string[]);

      // Create a new CustomProperty
      const propInstance = new newProp(propName, processedValues);
      // Add it to AllProperty at once
      propInstance.tryAdd();
    });
  });
}

interface typeObjects {
  [key: string]: string | typeObjects;
}
type Styles = typeObjects | Record<string, typeObjects>;
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  const definedStyles: Styles = {};
  // Helper function to apply styles into elements
  const applyStylesToElement = (
    element: HTMLElement,
    styles: string | Record<string, string>
  ): void => {
    // Define new styler
    const styler = new makeTenoxUI(element);
    // If the styles is a string, like: "p-20px m-1rem fs-2rem" / Stacked classes
    if (typeof styles === "string") {
      // Handled using `applyMultiStyles`
      styler.applyMultiStyles(styles);
    } else {
      // Handle nested styles / if the value is new object
      Object.entries(styles).forEach(([prop, value]) => {
        styler.applyStyle(prop, value, "");
      });
    }
  };
  // Recursive function to handle nested styles
  const applyNestedStyles = (parentSelector: string, styles: Styles): void => {
    // Handle nested style
    Object.entries(styles).forEach(([childSelector, childStyles]) => {
      const elements = document.querySelectorAll<HTMLElement>(
        `${parentSelector} ${childSelector}`
      );
      // Apply nested styles if the value is an object / new object as value
      if (typeof childStyles === "object" && !Array.isArray(childStyles)) {
        applyNestedStyles(`${parentSelector} ${childSelector}`, childStyles);
      }
      // Apply direct styles if not overridden by nested styles / default style
      else {
        // Default handler if style is a string / default styler (e.g. "p-1rem fs-1rem")
        elements.forEach((element) => {
          if (
            typeof childStyles === "string" ||
            (typeof childStyles === "object" && !Array.isArray(childStyles))
          ) {
            applyStylesToElement(element, childStyles);
          } else {
            console.warn("Invalid nested style for :", childStyles);
          }
        });
      }
    });
  };
  // Handle styling logic, nested style or only default
  stylesObjects.forEach((stylesObject) => {
    Object.entries(stylesObject).forEach(([selector, styles]) => {
      // If the styles is an object or nested style, use `applyNestedStyles` function to apply nested style logic
      if (typeof styles === "object" && !Array.isArray(styles)) {
        applyNestedStyles(selector, styles);
      }
      // If the styles is not overridden by nested style, apply styles using default styler
      else {
        // Stacking selector and
        const elements = document.querySelectorAll<HTMLElement>(selector);
        // Apply direct styles into element using default styler
        elements.forEach((element) => {
          if (
            typeof styles === "string" ||
            (typeof styles === "object" && !Array.isArray(styles))
          ) {
            applyStylesToElement(element, styles);
          } else {
            console.warn("Invalid styles type:", styles);
          }
        });
      }
      // Store defined styles for reuse
      definedStyles[selector] = styles;
    });
  });

  // returning defined styles
  return definedStyles;
}

// hover handler test function (update v0.7)
// applyHovers function
function applyHovers(hovers: object) {
  Object.entries(hovers).forEach(
    ([selector, [notHover, isHover, styles = ""]]: string[]) => {
      // selector
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: HTMLElement) => {
        // makeTenoxUI instance
        const styler = new makeTenoxUI(element);
        // applying default styles
        // styler.applyMultiStyles(`${notHover} ${styles}`);
        styler.applyMultiStyles(styles);
        // when the element is hovered
        element.addEventListener("mouseenter", () => {
          // apply hover style
          styler.applyMultiStyles(isHover);
        });
        // default style / when element not hovered
        element.addEventListener("mouseleave", () => {
          // apply default style
          styler.applyMultiStyles(notHover);
        });
      });
    }
  );
}

// Applying the style to all elements ✨
function tenoxui(): void {
  // Make classes from type name from properties key name
  Classes = Object.keys(property).map(
    (className) => `[class*="${className}-"]`
  );
  // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
  AllClasses = document.querySelectorAll(Classes.join(", "));
  // Iterate over elements with AllClasses
  AllClasses.forEach((element: HTMLElement) => {
    // Get the list of classes for the current element
    const classes = element.classList;
    // Make TenoxUI
    const styler = new makeTenoxUI(element);
    // Iterate over classes and apply styles using makeTenoxUI
    classes.forEach((className) => {
      styler.applyStyles(className);
    });
  });
}

export {
  Classes,
  AllClasses,
  defineProps,
  makeStyle,
  makeStyles,
  applyHovers,
  makeTenoxUI,
};
export default tenoxui;
