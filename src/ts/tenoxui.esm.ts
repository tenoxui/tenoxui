/*!
 * TenoxUI CSS v0.11.0-alpha.3
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

// Define type interface for the `makeStyles`
interface TypeObjects {
  [key: string]: string | TypeObjects;
}
// Styles type
type Styles = TypeObjects | Record<string, TypeObjects[]>;
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
// defined styles
type DefinedValue = { [key: string]: string };

let ALL_PROPS: Property; // global variable to passing all `types` and `properties` from `tenoxui`
let BREAKPOINTS: Breakpoint; // global breakpoints
let CLASSES: Classes; // store generated selector for tenoxui from defined types and properties
let ALL_CLASSES: AllClasses; // select all possible classname from `CLASSES`
let VALUE_REGISTRY: DefinedValue; // global value registry to store all custom values
let GLOBAL_STYLES_REGISTRY: string | Styles = {}; // all defined classname from the `makeStyles` function as an object

// tenoxui style handler
class makeTenoxUI {
  // basically selector :D
  private ELEMENT: HTMLElement;
  // all types and properties
  private STYLES: Property;

  // TenoxUI constructor
  constructor(element: HTMLElement, styledProps?: Property) {
    // basically selector
    this.ELEMENT = element;
    // all types and properties
    this.STYLES = styledProps || {};
  }

  // Utility function to convert camelCase to kebab-case
  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }

  // `addStyle`: Handle the styling and custom value for property
  public addStyle(type: string, value: string, unit: string): void {
    /* Warning! */
    /* You will see a lot of if statement from here :p */

    let PROPERTIES = this.STYLES[type];
    // resolve value: use `defined value` if available or regular `value`
    let RESOLVE_VALUE = VALUE_REGISTRY[value] || value;

    // custom values for each `type`
    // if the `DEFINED_VALUE` was an object, the drfined values inside of it will only work for its type.
    if (VALUE_REGISTRY[type] && typeof VALUE_REGISTRY[type] === "object") {
      let TYPE_VALUES = VALUE_REGISTRY[type];

      // return `RESOLVE_VALUE`
      RESOLVE_VALUE = TYPE_VALUES[value] || RESOLVE_VALUE;
    }

    // computed value
    let NEXT_VALUE = RESOLVE_VALUE + unit;

    /*
     * [ Feature ] - CSS Variable Value 🎋
     *
     * Check className if the `value` is started with `$`,
     * if so then this is treated as css variable, css value.
     *
     * example :
     * usage: `m-$size`
     * output: `margin: var(--size)`
     */

    if (value.startsWith("$")) {
      // remove the "$" prefix
      NEXT_VALUE = `var(--${value.slice(1)})`;
    } else if (value.startsWith("[") && value.endsWith("]")) {
      /*
       * [ Feature ] - Custom Values Support 🪐
       *
       * Check className if the `value` is wrapped with square bracket `[]`,
       * if so then this is treated as custom value and ignore default value.
       *
       * example :
       * usage: `m-[calc(10rem\_-\_100px)]`
       * output: `margin: calc(10rem - 100px)`
       */

      // Handle custom values wrapped in square brackets
      NEXT_VALUE = value.slice(1, -1).replace(/\\_/g, " ");
      // Check if the value is a CSS variable
      if (NEXT_VALUE.startsWith("--")) {
        NEXT_VALUE = `var(${NEXT_VALUE})`;
      }
    }

    // handle custom CSS properties directly
    if (type.startsWith("[--") && type.endsWith("]")) {
      // add css variables into element
      this.ELEMENT.style.setProperty(type.slice(1, -1), NEXT_VALUE);
    }

    // If properties matched the `type` or `property` from `ALL_PROPS`
    if (PROPERTIES) {
      // Ensure properties is an array
      if (!Array.isArray(PROPERTIES)) {
        PROPERTIES = [PROPERTIES];
      }

      // iterate the PROPERTIES's values
      PROPERTIES.forEach((property: string | keyof CSSStyleDeclaration) => {
        /*
         * [ Feature ] - CSS Variable `type` 📖
         *
         * Check if the defined property start with `--`,
         * like { "my-shadow": "--shadow-color" }.
         * Then, instead of trating it as css property, it will set property for that css variable. Simple right :D
         */

        if (typeof property === "string" && property.startsWith("--")) {
          this.ELEMENT.style.setProperty(property, NEXT_VALUE);
        } else {
          /*
           * [ Feature ] - Default value handler 🎏
           * All types will have this as default values, no additional value
           */
          this.ELEMENT.style[property] = NEXT_VALUE;
        }
      });
    }
  }

  // [ Feature ] - Responsive Handler
  private handleResponsive(breakpoint: string, type: string, value: string, unit: string): void {
    // APPLY helper
    const APPLY = () => {
      this.addStyle(type, value, unit);
    };
    // apply responsive styles
    const handleResponsive = () => {
      // viewport size / screen size helper
      const VIEWPORT = window.innerWidth;
      // helper for matching the className with correct breakpoint
      const MATCH_POINT = BREAKPOINTS.find(bp => {
        // it's hard to explain :p
        if (bp.name === breakpoint) {
          if (bp.min !== undefined && bp.max !== undefined) {
            return VIEWPORT >= bp.min && VIEWPORT <= bp.max;
          }
          if (bp.min !== undefined && VIEWPORT >= bp.min) {
            return true;
          }
          if (bp.max !== undefined && VIEWPORT <= bp.max) {
            return true;
          }
        }
        return false;
      });

      // apply responsive if matched breakpoint
      if (MATCH_POINT) {
        APPLY();
      } else {
        // reapply the initial styles when not not inside breakpoints anymore
        this.ELEMENT.style[type] = "";
      }
    };

    // init the styles
    handleResponsive();
    // Add event listener to update styles when the viewport is resized
    window.addEventListener("resize", handleResponsive);
  }

  // [ Feature ] - Pseudo Class Handler
  private pseudoHandler(type: string, value: string, unit: string, pseudoEvent: string, revertEvent: string): void {
    // store the initial value from the psudo selector class
    let STYLE_INIT_VALUE = this.ELEMENT.style.getPropertyValue(this.camelToKebab(this.STYLES[type] as string));

    // apply the styles using event listenener
    this.ELEMENT.addEventListener(pseudoEvent, event => {
      this.addStyle(type, value, unit);
    });

    // revert event when done / re-write the style's value from initial style
    this.ELEMENT.addEventListener(revertEvent, () => {
      this.ELEMENT.style.setProperty(this.camelToKebab(this.STYLES[type] as string), STYLE_INIT_VALUE);
    });
  }

  // [ Feature ] - Pseudo Class Handler (object)
  private pseudoObjectHandler(CLASS_NAME: string, pseudoEvent: string, revertEvent: string): void {
    // is the classname has period (".") or not
    let STYLED_CLASS_VALUE =
      // default selector
      GLOBAL_STYLES_REGISTRY[CLASS_NAME] ||
      // if stored selector had period (".")
      GLOBAL_STYLES_REGISTRY[`.${CLASS_NAME}`];

    if (STYLED_CLASS_VALUE) {
      // store the style initial attribute
      let STYLE_ATTR_VALUE = this.ELEMENT.getAttribute("style") || "";

      // apply styles
      this.ELEMENT.addEventListener(pseudoEvent, () => {
        this.applyMultiStyles(STYLED_CLASS_VALUE);
      });

      // revert event when done / re-write the style's value from initial style
      this.ELEMENT.addEventListener(revertEvent, () => {
        this.ELEMENT.setAttribute("style", STYLE_ATTR_VALUE);
      });
    }
  }

  // [ Feature ] - Main classname handler for tenoxui
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
            this.pseudoHandler(type, value, unitOrValue, "mouseover", "mouseout");
            break;
          // focus effect handler
          case "focus":
            this.pseudoHandler(type, value, unitOrValue, "focus", "blur");
            break;
          // else was responsive handler
          default:
            this.handleResponsive(prefix, type, value, unitOrValue);
        }
      } else {
        // default styles handler
        this.addStyle(type, value, unitOrValue);
      }
    }

    // custom class hover handler
    else if (className.startsWith("hover:") || className.startsWith("focus:")) {
      // pseudo event
      let PSEUDO_CLASS = className.split(":")[0];
      // classname to exec
      let CLASS_NAME = className.split(":")[1];

      // only exec when the className match GLOBAL_STYLE
      if (GLOBAL_STYLES_REGISTRY[CLASS_NAME] || GLOBAL_STYLES_REGISTRY[`.${CLASS_NAME}`]) {
        // hover event handler
        if (PSEUDO_CLASS === "hover") {
          this.pseudoObjectHandler(CLASS_NAME, "mouseover", "mouseout");
        }
        // focus event handler
        else if (PSEUDO_CLASS === "focus") {
          this.pseudoObjectHandler(CLASS_NAME, "focus", "blur");
        }
      }
    }
  }

  // Multi styler function, style through javascript.
  public applyMultiStyles(styles: string): void {
    // Applying the styles using forEach and `applyStyles`
    styles.split(/\s+/).forEach((style: string) => {
      this.applyStyles(style);
    });
  }
}

/*
 * [ Feature ] - `makeStyle` and `makeStyles` function
 *
 * Imitate css-in-js functionality, but less feature.
 */

// apply multi style into all elements with the specified selector
function makeStyle(selector: string, styles: string): void {
  const applyStylesToElement = (element: HTMLElement, styles: string): void => {
    // styler helper
    const styler = new makeTenoxUI(element, ALL_PROPS);
    styler.applyMultiStyles(styles);
  };
  // If styles is a string, apply it to the specified selector
  const elements = document.querySelectorAll(selector);
  elements.forEach((element: Element) => applyStylesToElement(element as HTMLElement, styles));
}

// Function to apply styles from selectors
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  let STORED_STYLES: Styles = {};
  let STYLE_REGISTRY: StylesRegistry = {};
  // Helper function to apply styles to an element
  const applyStylesToElement = (element: HTMLElement, styles: string | Record<string, string>): void => {
    // styler helper
    const styler = new makeTenoxUI(element, ALL_PROPS);

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
  const applyNestedStyles = (PARENT_SELECTOR: string, styles: Styles): void => {
    Object.entries(styles).forEach(([CHILD_SELECTOR, CHILD_STYLE]) => {
      let ELEMENT_CLASS = `${PARENT_SELECTOR} ${CHILD_SELECTOR}`.trim();
      let elements = document.querySelectorAll<HTMLElement>(ELEMENT_CLASS);

      if (typeof CHILD_STYLE === "object" && !Array.isArray(CHILD_STYLE)) {
        // Recursively apply nested styles
        applyNestedStyles(ELEMENT_CLASS, CHILD_STYLE);
      } else {
        // Apply direct styles if not overridden by nested styles / default style
        elements.forEach(element => {
          if (typeof CHILD_STYLE === "string") {
            let STYLE_ARRAY = CHILD_STYLE.split(" ");
            let STYLE_RESOLVE = STYLE_ARRAY.map(style => {
              // If the style is a reference to another class, get its styles
              return STYLE_REGISTRY[style] ? STYLE_REGISTRY[style].join(" ") : style;
            }).join(" ");
            applyStylesToElement(element, STYLE_RESOLVE);
          } else if (typeof CHILD_STYLE === "object" && !Array.isArray(CHILD_STYLE)) {
            applyStylesToElement(element, CHILD_STYLE);
          } else {
            console.warn("Invalid nested style for:", CHILD_STYLE);
          }
        });
      }
    });
  };

  // Handle styling logic, nested style, or only default
  stylesObjects.forEach(STYLE_OBJECT => {
    Object.entries(STYLE_OBJECT).forEach(([selector, styles]) => {
      // Store defined styles for reuse
      if (typeof styles === "string") {
        // Split the style string by spaces to support multiple classes
        const STYLE_ARRAY = styles.split(" ");
        STYLE_REGISTRY[selector] = STYLE_ARRAY;
        STORED_STYLES[selector] = styles;
      } else {
        STORED_STYLES[selector] = styles;
      }

      // Select elements based on the selector
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach(element => {
        if (typeof styles === "string") {
          // Resolve stacked styles by looking them up in the registry
          let STYLE_ARRAY = styles.split(" ");
          let STYLE_RESOLVE = STYLE_ARRAY.map(style => {
            // If the style is a reference to another class, get its styles
            return STYLE_REGISTRY[style] ? STYLE_REGISTRY[style].join(" ") : style;
          }).join(" ");
          applyStylesToElement(element, STYLE_RESOLVE);
        } else if (typeof styles === "object" && !Array.isArray(styles)) {
          applyStylesToElement(element, styles);
        } else {
          console.warn("Invalid styles type:", styles);
        }
      });

      // Handle nested styles if tge styles value was an object
      if (typeof styles === "object" && !Array.isArray(styles)) {
        applyNestedStyles(selector, styles);
      }
    });
  });
  // passing the stored value to `GLOBAL_STYLES_REGISTRY`
  GLOBAL_STYLES_REGISTRY = Object.assign(GLOBAL_STYLES_REGISTRY, STORED_STYLES);
  // Return the defined styles
  return STORED_STYLES;
}

// [ Feature ] - Adding custom configuration
function use(customConfig: { breakpoint?: Breakpoint; property?: Property[]; values?: DefinedValue }) {
  // custom breakpoints
  if (customConfig.breakpoint) {
    BREAKPOINTS = [...BREAKPOINTS, ...customConfig.breakpoint];
  }

  // types and properties to execute
  if (customConfig.property) {
    ALL_PROPS = { ...ALL_PROPS, ...Object.assign({}, ...customConfig.property) };
  }

  // value registry handler
  if (customConfig.values) {
    VALUE_REGISTRY = customConfig.values;
  }
}

// [ Feature ] - Main styler for classname ✨
function tenoxui(...customPropsArray: Property[]): void {
  // only if the types and properties defined inside tenoxui function
  let OBJECT_PROPS = Object.assign({}, ALL_PROPS, ...customPropsArray);

  // passing for global values
  ALL_PROPS = OBJECT_PROPS;

  // generate className from property key's name, or property's type
  CLASSES = Object.keys(ALL_PROPS).map(className => `[class*="${className}-"]`);

  // generate a selector from `CLASSES`
  ALL_CLASSES = document.querySelectorAll(CLASSES.join(", "));
  // Iterate over elements with AllClasses
  ALL_CLASSES.forEach((element: Element) => {
    // Get the list of classes for the current element
    let HTML_ELEMENT = element as HTMLElement;
    // get lists of classname from the HTML element
    let CLASS_LIST = HTML_ELEMENT.classList;
    // styler helper
    const STYLER = new makeTenoxUI(HTML_ELEMENT, ALL_PROPS);
    // Iterate over classes and apply styles using makeTenoxUI
    CLASS_LIST.forEach(className => {
      STYLER.applyStyles(className);
    });
  });
}

export { makeStyle, makeStyles, makeTenoxUI, use, tenoxui as default };
