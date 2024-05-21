/*!
 * tenoxui/css v0.10.0 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

// types and properties type
type Property = { [key: string]: string | string[] };
// Breakpoint type
type Breakpoint = { name: string; min?: number; max?: number }[];
// Classes type
type Classes = String[];
// selector type
type AllClasses = NodeListOf<HTMLElement>;

// global variable to passing all values from `tenoxui`
let allProps: Property,
  breakpoints: Breakpoint,
  classes: Classes,
  allClasses: AllClasses;

// breakpoints
breakpoints = [
  { name: "max-sm", max: 639.9 },
  { name: "sm", min: 640 },
  { name: "max-md", max: 767.9 },
  { name: "md", min: 768 },
  { name: "max-lg", max: 1023.9 },
  { name: "lg", min: 1024 },
  { name: "max-xl", max: 1279.9 },
  { name: "xl", min: 1280 }
];

// tenoxui style handler
class makeTenoxUI {
  // basically selector :D
  private element: HTMLElement;
  // all types and properties
  private styles: Property;

  // TenoxUI constructor
  constructor(element: HTMLElement, styledProps?: Property) {
    // basically selector
    this.element = element;
    // all types and properties
    this.styles = styledProps || {};
  }

  // `applyStyle`: Handle the styling and custom value for property
  public applyStyle(type: string, value: string, unit: string): void {
    // handle custom CSS properties directly
    if (type.startsWith("[--") && type.endsWith("]")) {
      // remove the square brackets
      const cssProperty = type.slice(1, -1);
      // add css variables into element
      this.element.style.setProperty(cssProperty, value + unit);
    }

    // get type's from allProps constant
    let properties = this.styles[type];
    // If properties matched the `type` or `property` from `allProps`
    if (properties) {
      // If properties has only one css property and it was string, not wrapped inside an array
      if (!Array.isArray(properties)) {
        // Convert the string value from property into an array
        properties = [properties];
      }
      properties.forEach((property: string | number) => {
        // filter property styles handler
        if (property === "ftr") {
          this.element.style.filter = `${type}(${value}${unit})`;
        }
        // backdrop filter styles handler
        else if (property === "bFt") {
          //? backdrop-filter function shorthand
          const filters = [
            "blur",
            "sepia",
            "saturate",
            "grayscale",
            "brightness",
            "invert",
            "contrast"
          ];
          const backdropFunctions: { [key: string]: string } = {};
          filters.forEach(filter => {
            backdropFunctions[`back-${filter}`] = filter;
          });
          const backdropFunction = backdropFunctions[type];
          if (backdropFunction) {
            this.element.style.backdropFilter = `${backdropFunction}(${value}${unit})`;
          }
        }
        // Transform single value
        else if (property === "tra") {
          const transformFunctions: { [key: string]: string } = {
            translate: "translate",
            "move-x": "translateX",
            "move-y": "translateY",
            matrix: "matrix",
            "matrix-3d": "matrix3d",
            "scale-3d": "scale3d",
            "scale-x": "scaleX",
            "scale-y": "scaleY",
            "skew-x": "skewX",
            "skew-y": "skewY"
          };
          const transformFunction = transformFunctions[type];
          if (transformFunction) {
            this.element.style.transform = `${transformFunction}(${value}${unit})`;
          }
        }
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is started with `$`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable
        else if (value.startsWith("$")) {
          // remove the "$" prefix
          const cssValue = value.slice(1);
          // use css variables as value
          this.element.style[property as number] = `var(--${cssValue})`;
        }
        /*
         * Custom values support 🪐
         *
         * Check className if the `value` is wrapped with square bracket `[]`,
         * if so then this is treated as custom value and ignore default value.
         */
        // Check if the value is a CSS variable enclosed in square bracket `[]`
        else if (value.startsWith("[") && value.endsWith("]")) {
          // remove the wrapper and replace `\_` with space (if there any)
          const values = value.slice(1, -1).replace(/\\_/g, " ");

          //? css variable value handler
          // if value start with `--`, treat value as css variable
          if (values.startsWith("--")) {
            this.element.style[property as number] = `var(${values})`;
          }
          // else, will use custom `values`
          else {
            this.element.style[property as number] = values;
          }
        } else {
          /*
           * Default value handler 🎏
           * All types will have this as default values, no additional value
           */
          this.element.style[property as number] = `${value}${unit}`;
        }
      });
    }
    // console.log(this.styles);
  }

  // responsive styles helper
  private applyResponsiveStyles(
    breakpoint: string,
    type: string,
    value: string,
    unit: string
  ): void {
    // applyStyle helper
    const applyStyle = () => {
      this.applyStyle(type, value, unit);
    };

    // apply responsive styles
    const applyResponsiveStyles = () => {
      // viewport size / screen size helper
      const viewportWidth = window.innerWidth;
      // helper for matching the className with correct breakpoint
      const matchedBreakpoint = breakpoints.find(bp => {
        if (bp.name === breakpoint) {
          if (bp.min !== undefined && bp.max !== undefined) {
            return viewportWidth >= bp.min && viewportWidth <= bp.max;
          }
          if (bp.min !== undefined && viewportWidth >= bp.min) {
            return true;
          }
          if (bp.max !== undefined && viewportWidth <= bp.max) {
            return true;
          }
        }
        return false;
      });

      // apply responsive if matched breakpoint
      if (matchedBreakpoint) {
        applyStyle();
      } else {
        // Clear the style if it doesn't match the breakpoint anymore (unsure bout this)
        this.element.style[type] = "";
      }
    };

    // init the styles
    applyResponsiveStyles();
    // Add event listener to update styles when the viewport is resized
    window.addEventListener("resize", applyResponsiveStyles);
  }

  public applyStyles(className: string): void {
    // Using RegExp to handle the value
    const match = className.match(
      /(?:([a-z-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    );

    if (match) {
      // breakpoint = responsive handler. Example: `sm:`, `lg:`, and etc.
      const breakpoint = match[1];
      // type = property class. Example: p-, m-, flex-, fx-, filter-, etc.
      const type = match[2];
      // value = possible value. Example: 10, red, blue, etc.
      const value = match[3];
      // unit = possible unit. Example: px, rem, em, s, %, etc.
      const unitOrValue = match[5];

      /*
       * classname handler :p
       * if styles has breakpoint, handle style using responsive styles function. Else, use default stylee.
       */
      // Responsive styles handler
      if (breakpoint) {
        this.applyResponsiveStyles(breakpoint, type, value, unitOrValue);
      } else {
        // Apply default styles
        this.applyStyle(type, value, unitOrValue);
      }
    }
  }

  // Multi styler function, style through javascript.
  public applyMultiStyles(styles: string): void {
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
    // styler helper
    const styler = new makeTenoxUI(element, allProps);
    styler.applyMultiStyles(styles);
  };
  // default style handler
  if (typeof styles === "string") {
    // If styles is a string, apply it to the specified selector
    const elements = document.querySelectorAll(selector);
    elements.forEach((element: Element) =>
      applyStylesToElement(element as HTMLElement, styles)
    );
  }
  // error handling (unnecessary actually :D)
  else {
    console.warn(
      `Invalid styles format for "${selector}". Make sure you provide style correctly`
    );
  }
}

// type for nested hell styles :)
interface typeObjects {
  [key: string]: string | typeObjects;
}
type Styles = typeObjects | Record<string, typeObjects>;

// Function to apply styles from selectors
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  const definedStyles: Styles = {};
  // Helper function to apply styles into elements
  const applyStylesToElement = (
    element: HTMLElement,
    styles: string | Record<string, string>
  ): void => {
    // Define new styler
    const styler = new makeTenoxUI(element, allProps);
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
        elements.forEach(element => {
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
  stylesObjects.forEach(stylesObject => {
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
        elements.forEach(element => {
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

// applyHovers function
function applyHovers(hovers: object) {
  Object.entries(hovers).forEach(
    ([selector, [notHover, isHover, styles = ""]]: string[]) => {
      // selector
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: Element) => {
        // makeTenoxUI instance
        const styler = new makeTenoxUI(element as HTMLElement, allProps);
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
// `use` function to define custom breakpoints, types and properties
function use(customConfig: { breakpoint?: Breakpoint; property?: Property[] }) {
  // custom breakpoints
  if (customConfig.breakpoint) {
    breakpoints = [...breakpoints, ...customConfig.breakpoint];
  }

  // types and properties to execute
  if (customConfig.property) {
    allProps = { ...allProps, ...Object.assign({}, ...customConfig.property) };
  }
}

// Applying the style to all elements ✨
function tenoxui(...customPropsArray: object[]) {
  let styles = Object.assign({}, allProps, ...customPropsArray);

  // passing for global values
  allProps = styles;

  // Generate className from property key name, or property type
  classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);

  // css variable className
  // classes.push(`[class*="[--"]`);

  // selectors from classes
  allClasses = document.querySelectorAll(classes.join(", "));
  // Iterate over elements with AllClasses
  allClasses.forEach((element: Element) => {
    // Get the list of classes for the current element
    const htmlELement = element as HTMLElement;
    const classes = htmlELement.classList;
    // styler helper
    const styler = new makeTenoxUI(htmlELement, allProps);
    // Iterate over classes and apply styles using makeTenoxUI
    classes.forEach(className => {
      styler.applyStyles(className);
    });
  });
}

export {
  allProps,
  makeStyle,
  makeStyles,
  applyHovers,
  makeTenoxUI,
  use,
  tenoxui as default
};
