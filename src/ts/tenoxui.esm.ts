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

  // Utility function to convert camelCase to kebab-case
  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }

  // `applyStyle`: Handle the styling and custom value for property
  public addStyle(type: string, value: string, unit: string): void {
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
         * CSS Variable type
         *
         * Check if the defined property start with `--`,
         * like { "my-shadow": "--shadow-color" }.
         * Then, instead of trating it as css property, it will set property for that css variable. Simple right :D
         */
        if (typeof property === "string" && property.startsWith("--")) {
          // Set the CSS variable
          this.element.style.setProperty(property, value + unit);
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
  }

  // responsive styles helper
  private handleResponsive(breakpoint: string, type: string, value: string, unit: string): void {
    // applyStyle helper
    const applyStyle = () => {
      this.addStyle(type, value, unit);
    };
    // store the initial styles
    // const initialStyle = this.element.style.getPropertyValue(
    // this.styles[type] as string
    // );

    // apply responsive styles
    const handleResponsive = () => {
      // viewport size / screen size helper
      const viewportWidth = window.innerWidth;
      // helper for matching the className with correct breakpoint
      const matchPoint = breakpoints.find(bp => {
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
      if (matchPoint) {
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
    handleResponsive();
    // Add event listener to update styles when the viewport is resized
    window.addEventListener("resize", handleResponsive);
  }

  // Method to handle pseudo-class styles
  private pseudoStyles(type: string, value: string, unit: string, pseudoEvent: string, revertEvent: string): void {
    // store the initial styles for selected element
    const initialStyle = this.element.style.getPropertyValue(this.camelToKebab(this.styles[type] as string));

    // applyStyle helper
    const applyStyle = () => {
      this.addStyle(type, value, unit);
    };

    // helper for resetting the styles to the stored initial style
    const revertStyle = () => {
      this.element.style.setProperty(this.camelToKebab(this.styles[type] as string), initialStyle);
    };

    // add event listener to start the event
    this.element.addEventListener(pseudoEvent, event => {
      // apply style if the event fulfilled
      applyStyle();
    });

    // event listener to reverting the styles when done
    this.element.addEventListener(revertEvent, revertStyle);
  }

  // Method to apply multiple styles
  public applyStyles(className: string): void {
    // the regexp for matches all possible classname, using AI actually :D
    const match = className.match(
      /(?:([a-z-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    );

    // matching all classnames
    if (match) {
      // prefix = prefix for type. Example: md:, sm:, hover:, etc.
      const prefix = match[1];
      // type = property class. Example: p-, m-, flex-, fx-, filter-, etc.
      const type = match[2];
      // value = possible value. Example: 10, red, blue, etc.
      const value = match[3];
      // unit = possible unit. Example: px, rem, em, s, %, etc.
      const unitOrValue = match[5];

      // handle prefix of the element classname
      if (prefix) {
        switch (prefix) {
          // hover effect handler
          case "hover":
            this.pseudoStyles(type, value, unitOrValue, "mouseover", "mouseout");
            break;
          // focus effect handler
          case "focus":
            this.pseudoStyles(type, value, unitOrValue, "focus", "blur");
            break;
          // else was responsive handler
          default:
            this.handleResponsive(prefix, type, value, unitOrValue);
        }
      }
      // default styles handler
      else {
        this.addStyle(type, value, unitOrValue);
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
function makeStyle(selector: string, styles: string): void {
  const applyStylesToElement = (element: HTMLElement, styles: string): void => {
    const styler = new makeTenoxUI(element, allProps);
    styler.applyMultiStyles(styles);
  };
  // If styles is a string, apply it to the specified selector
  const elements = document.querySelectorAll(selector);
  elements.forEach((element: Element) => applyStylesToElement(element as HTMLElement, styles));
}

// Define type for the styles
interface TypeObjects {
  [key: string]: string | TypeObjects;
}

// Styles type
type Styles = TypeObjects | Record<string, TypeObjects[]>;

// Function to apply styles from selectors
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  const definedStyles: Styles = {};

  // Helper function to apply styles to an element
  const applyStylesToElement = (element: HTMLElement, styles: string | Record<string, string>): void => {
    // Define new styler
    const styler = new makeTenoxUI(element, allProps);

    // If the styles is a string, like: "p-20px m-1rem fs-2rem" / Stacked classes
    if (typeof styles === "string") {
      // Handle using `applyMultiStyles`
      styler.applyMultiStyles(styles);
    } else {
      // Handle nested styles / if the value is a new object
      Object.entries(styles).forEach(([prop, value]) => {
        styler.addStyle(prop, value, "");
      });
    }
  };

  // Recursive function to handle nested styles
  const applyNestedStyles = (parentSelector: string, styles: Styles): void => {
    Object.entries(styles).forEach(([childSelector, childStyles]) => {
      const fullSelector = `${parentSelector} ${childSelector}`.trim();
      const elements = document.querySelectorAll<HTMLElement>(fullSelector);

      if (typeof childStyles === "object" && !Array.isArray(childStyles)) {
        // Recursively apply nested styles
        applyNestedStyles(fullSelector, childStyles);
      } else {
        // Apply direct styles if not overridden by nested styles / default style
        elements.forEach(element => {
          if (typeof childStyles === "string") {
            const styleArray = childStyles.split(" ");
            const resolvedStyles = styleArray
              .map(style => {
                // If the style is a reference to another class, get its styles
                return styleRegistry[style] ? styleRegistry[style].join(" ") : style;
              })
              .join(" ");
            applyStylesToElement(element, resolvedStyles);
          } else if (typeof childStyles === "object" && !Array.isArray(childStyles)) {
            applyStylesToElement(element, childStyles);
          } else {
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
      elements.forEach(element => {
        if (typeof styles === "string") {
          // Resolve stacked styles by looking them up in the registry
          const styleArray = styles.split(" ");
          const resolvedStyles = styleArray
            .map(style => {
              // If the style is a reference to another class, get its styles
              return styleRegistry[style] ? styleRegistry[style].join(" ") : style;
            })
            .join(" ");
          applyStylesToElement(element, resolvedStyles);
        } else if (typeof styles === "object" && !Array.isArray(styles)) {
          applyStylesToElement(element, styles);
        } else {
          console.warn("Invalid styles type:", styles);
        }
      });

      // Handle nested styles
      if (typeof styles === "object" && !Array.isArray(styles)) {
        applyNestedStyles(selector, styles);
      }
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
export { allProps, makeStyle, makeStyles, makeTenoxUI, use, tenoxui as default };
