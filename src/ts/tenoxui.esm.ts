/*!
 * TenoxUI CSS v0.10.0
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

// types and properties type
type Property = { [key: string]: string | string[] };
// Breakpoint type
type Breakpoint = { name: string; min?: number; max?: number }[];
// Classes type
type Classes = String[];
// selector type
type AllClasses = NodeListOf<HTMLElement>;
// styles registry
type StylesRegistry = Record<string, string[]>;

// global variable to passing all values from `tenoxui`
let allProps: Property,
  breakpoints: Breakpoint,
  classes: Classes,
  allClasses: AllClasses,
  styleRegistry: StylesRegistry = {};

// Define the breakpoints
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
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is started with `$`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable
        if (value.startsWith("$")) {
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
    // store the initial styles
    // const initialStyle = this.element.style.getPropertyValue(
    // this.styles[type] as string
    // );

    // apply responsive styles
    const applyResponsiveStyles = () => {
      // viewport size / screen size helper
      const viewportWidth = window.innerWidth;
      // helper for matching the className with correct breakpoint
      const matchedBreakpoint = breakpoints.find(bp => {
        // it's hard to explain :p
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
        // reapply the initial styles when not not inside breakpoints anymore
        this.element.style[type] = "";
        // this.element.style.setProperty(
        //  this.styles[type] as string,
        //  initialStyle
        // );
      }
    };

    // init the styles
    applyResponsiveStyles();
    // Add event listener to update styles when the viewport is resized
    window.addEventListener("resize", applyResponsiveStyles);
  }

  // hover effect handler
  private applyHoverStyles(type: string, value: string, unit: string): void {
    // get the initial style before hover
    const initialStyle = this.element.style.getPropertyValue(
      this.styles[type] as string
    );

    // spplyStyle helper
    const applyStyle = () => {
      this.applyStyle(type, value, unit);
    };

    // applyStyle when the mouse enter
    this.element.addEventListener("mouseover", applyStyle);
    // give back the initialStyle when the mouse leave
    this.element.addEventListener("mouseout", () => {
      this.element.style.setProperty(this.styles[type] as string, initialStyle);
    });
  }

  // styler handler
  public applyStyles(className: string): void {
    const match = className.match(
      /(?:([a-z-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    );

    if (match) {
      // breakpoint = responsive handler. Example: `sm:`, `lg:`, and etc.
      const prefix = match[1];
      // type = property class. Example: p-, m-, flex-, fx-, filter-, etc.
      const type = match[2];
      // value = possible value. Example: 10, red, blue, etc.
      const value = match[3];
      // unit = possible unit. Example: px, rem, em, s, %, etc.
      const unitOrValue = match[5];

      // handle prefix of the element classname
      if (prefix) {
        // handle hover effect classname
        if (prefix.startsWith("hover")) {
          this.applyHoverStyles(type, value, unitOrValue);
        }
        // handle responsive classname
        else {
          this.applyResponsiveStyles(prefix, type, value, unitOrValue);
        }
      }
      // use default styler
      else {
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

// Define type for nested styles
interface TypeObjects {
  [key: string]: string | TypeObjects;
}
type Styles = TypeObjects | Record<string, TypeObjects[]>;

// Function to apply styles from selectors
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  const definedStyles: Styles = {};

  // Helper function to apply styles to an element
  const applyStylesToElement = (
    element: HTMLElement,
    styles: string | Record<string, string>
  ): void => {
    // Define new styler
    const styler = new makeTenoxUI(element, allProps);

    // If the styles is a string, like: "p-20px m-1rem fs-2rem" / Stacked classes
    if (typeof styles === "string") {
      // Handle using `applyMultiStyles`
      styler.applyMultiStyles(styles);
    } else {
      // Handle nested styles / if the value is a new object
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
      } else {
        // Default handler if style is a string / default styler (e.g., "p-1rem fs-1rem")
        elements.forEach(element => {
          if (
            typeof childStyles === "string" ||
            (typeof childStyles === "object" && !Array.isArray(childStyles))
          ) {
            applyStylesToElement(element, childStyles);
          }
          // error handling for childStyles
          else {
            console.warn("Invalid nested style for:", childStyles);
          }
        });
      }
    });
  };

  // Handle styling logic, nested style, or only default
  stylesObjects.forEach(stylesObject => {
    Object.entries(stylesObject).forEach(([selector, styles]) => {
      // Store defined styles for reuse
      if (typeof styles === "string") {
        // Split the style string by spaces to support multiple classes
        const styleArray = styles.split(" ");
        styleRegistry[selector] = styleArray;
        definedStyles[selector] = styles;
      } else {
        definedStyles[selector] = styles;
      }

      // Select elements based on the selector
      const elements = document.querySelectorAll<HTMLElement>(selector);
      // iterate elements
      elements.forEach(element => {
        if (typeof styles === "string") {
          // Resolve stacked styles by looking them up in the registry
          const styleArray = styles.split(" ");
          const resolvedStyles = styleArray
            .map(style => {
              // If the style is a reference to another class, get its styles
              return styleRegistry[style]
                ? styleRegistry[style].join(" ")
                : style;
            })
            .join(" ");
          applyStylesToElement(element, resolvedStyles);
        } else if (typeof styles === "object" && !Array.isArray(styles)) {
          applyStylesToElement(element, styles);
        } else {
          console.warn("Invalid styles type:", styles);
        }
      });
    });
  });

  // Return the defined styles
  return definedStyles;
}

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
function tenoxui(...customPropsArray: Property[]) {
  let styles = Object.assign({}, allProps, ...customPropsArray);

  // passing for global values
  allProps = styles;

  // Generate className from property key name, or property type
  classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);

  // css variable global classes
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

export { allProps, makeStyles, makeTenoxUI, use, tenoxui as default };
