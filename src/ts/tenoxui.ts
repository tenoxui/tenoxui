/*!
 * TenoxUI CSS v0.11.0-alpha.8
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

interface TypeObjects {
  [key: string]: string | TypeObjects;
}
// custom value type
interface CustomValue {
  [key: string]: {
    property?: string;
    customValue?: string;
  };
}
// Styles type
type Styles = TypeObjects | Record<string, TypeObjects[]>;
// types and properties type
type Property = {
  [key: string]: string | string[] | { property?: string | string[]; customValue?: string };
};
// Breakpoint type
type Breakpoint = { name: string; min?: number; max?: number }[];
// Classes type
type Classes = string[];
// selector type
type AllClasses = NodeListOf<HTMLElement>;
// styles registry
type StylesRegistry = Record<string, string[]>;
// defined styles
type DefinedValue = { [key: string]: { [key: string]: string } | string };

let allProps: Property; // global variable to passing all `types` and `properties` from `tenoxui`
let breakpoints: Breakpoint = []; // global breakpoints
let classes: Classes; // store generated selector for tenoxui from defined types and properties
let allClasses: AllClasses; // select all possible classname from `classes`
let valueRegistry: DefinedValue = {}; // global value registry to store all custom values
let globalValueRegistry: string | Styles = {}; // all defined classname from the `makeStyles` function as an object

// tenoxui style handler
class makeTenoxUI {
  // basically selector :D
  private htmlElement: HTMLElement;
  // all types and properties
  private styleAttribute: Property;

  // TenoxUI constructor
  constructor(element: HTMLElement, styledProps?: Property) {
    // basically selector
    this.htmlElement = element;
    // all types and properties
    this.styleAttribute = styledProps || {};
  }

  // `addStyle`: Handle the styling and custom value for property
  public addStyle(type: string, value: string, unit: string): void {
    /* Warning! */
    /* You will see a lot of if statement from here :p */

    // get `type` from allProps
    let properties = this.styleAttribute[type];
    // resolve value: use `defined value` if available or regular `value`
    let resolveValue = (valueRegistry[value] as string) || value;

    // recursive function to `generate/handle` custom/special values
    const specialValue = (value: string, unit: string) => {
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
        // remove the "$" prefix and
        return `var(--${value.slice(1)})`;
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
        let customValue = value.slice(1, -1).replace(/\\_/g, " ");
        // Check if the value is a CSS variable
        if (customValue.startsWith("--")) {
          return `var(${customValue})`;
        }
        return customValue;
      }
      return value + unit;
    };

    // check if properties has custom value for the type
    if (typeof properties === "object" && (properties as { customValue: string }).customValue) {
      // replace all `{value}` with resolveValue
      resolveValue = (properties as { customValue: string }).customValue.replace(/{value}/g, match =>
        specialValue(resolveValue, unit)
      );
    } else if (properties && typeof value === "string") {
      // custom values for each `type`
      // if the `DEFINED_VALUE` was an object, the drfined values inside of it will only work for its type

      // get value from `valueRegistry` if there matching value
      if (valueRegistry[type] && typeof valueRegistry[type] === "object") {
        // get the valueRegistry's keys name
        let typeValues = valueRegistry[type];

        // use value from registry or default value
        resolveValue = typeValues[value] || resolveValue;
      }

      resolveValue = specialValue(resolveValue, unit);
    }

    /*
     * [ Feature ] - Custom CSS variable class name
     *
     * instead of adding value for default css property, set the computed value for css variable.
     *
     * example :
     * usage: `m-[calc(10rem\_-\_100px)]`
     * output: `margin: calc(10rem - 100px)`
     */
    if (type.startsWith("[--") && type.endsWith("]")) {
      // remove bracket and use the the `type` as the variable's name to write the value
      this.htmlElement.style.setProperty(type.slice(1, -1), resolveValue);
    } else if (typeof properties === "object" && "property" in properties) {
      /*
       * [ Fearure ] - Custom value handler
       *
       * check if `type` inside `properties` is an object, get the property and customValue, then replace the {value} with RESOLVED VALUE.
       */

      // get custom property and custom value
      let objectProps = properties as { property: string | string[]; customValue?: string };

      // handle css variable with custom value
      if (typeof objectProps.property === "string" && objectProps.property.startsWith("--")) {
        // Set CSS variable property
        this.htmlElement.style.setProperty(objectProps.property, resolveValue);
      }

      // check if the property is an array
      else if (Array.isArray(objectProps.property)) {
        // if property inside objectProps was an array, iterate over each property
        objectProps.property.forEach(property => {
          // handle CSS variable property
          if (typeof property === "string" && property.startsWith("--")) {
            // set `property` into css variable
            this.htmlElement.style.setProperty(property, resolveValue);
          } else {
            // handle array of default CSS property
            this.htmlElement.style[property as string] = resolveValue;
          }
        });
      }

      // default handler for custom value property
      else {
        // apply the custom property defined in properties
        this.htmlElement.style[objectProps.property] = resolveValue;
      }
    }

    // If properties matched the `type` or `property` from `allProps`
    else if (properties) {
      // turnn string into array :)
      if (!Array.isArray(properties)) {
        properties = [properties] as string[];
      }

      // iterate properties and handle each type and property
      properties.forEach((property: string | string[] | keyof CSSStyleDeclaration) => {
        /*
         * [ Feature ] - CSS Variable `type` 📖
         *
         * Check if the defined property start with `--`,
         * like { "my-shadow": "--shadow-color" }.
         * Then, instead of trating it as css property, it will set property for that css variable. Simple right :D
         */
        if (typeof property === "string" && property.startsWith("--")) {
          // set `property` into css variable
          this.htmlElement.style.setProperty(property, resolveValue);
        } else {
          /*
           * [ Feature ] - Default value handler 🎏
           *
           * All types will have this as default values, no additional value
           */
          this.htmlElement.style[property as string] = resolveValue;
        }
      });
    }
  }

  // [ Feature ] - Responsive Handler
  private handleResponsive(breakpoint: string, type: string, value: string, unit: string): void {
    const applyStyle = () => {
      this.addStyle(type, value, unit);
    };

    const handleResponsive = () => {
      const windowWidth = window.innerWidth;
      const matchPoint = breakpoints.find(bp => {
        if (bp.name !== breakpoint) return false;
        if (bp.min !== undefined && bp.max !== undefined) {
          return windowWidth >= bp.min && windowWidth <= bp.max;
        }
        if (bp.min !== undefined) {
          return windowWidth >= bp.min;
        }
        if (bp.max !== undefined) {
          return windowWidth <= bp.max;
        }
        return false;
      });

      if (matchPoint) {
        applyStyle();
      } else {
        this.htmlElement.style[type] = "";
      }
    };

    handleResponsive();
    window.addEventListener("resize", handleResponsive);
  }

  // Utility function to convert camelCase to kebab-case
  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  }

  // [ Feature ] - Pseudo clasd handler
  private pseudoHandler(type: string, value: string, unit: string, pseudoEvent: string, revertEvent: string): void {
    // get CSS property names
    let propsName = this.camelToKebab(
      ((this.styleAttribute[type] as { property?: string }).property || type) as string
    );

    // store initial value for the type
    let styleInitValue = this.htmlElement.style.getPropertyValue(
      this.camelToKebab(this.styleAttribute[type] as string)
    );

    // apply the styles when the event started
    this.htmlElement.addEventListener(pseudoEvent, () => {
      this.addStyle(type, value, unit);
    });

    // reverting style when done, apply initial style value of current element
    this.htmlElement.addEventListener(revertEvent, () => {
      // if element was css variable
      if (propsName.startsWith("--")) {
        this.htmlElement.style.setProperty(propsName, styleInitValue);
      }

      // default css property
      else {
        this.htmlElement.style.setProperty(this.camelToKebab(this.styleAttribute[type] as string), styleInitValue);
      }
    });
  }

  // [ Feature ] - Pseudo handler from defined classname
  private pseudoObjectHandler(styleClassName: string, pseudoEvent: string, revertEvent: string): void {
    // get classname from globalValueRegistry
    let styledClassValue =
      globalValueRegistry[styleClassName as string] || globalValueRegistry[`.${styleClassName}` as string];
    // check if the class name was match inside globalValueRegistry
    if (styledClassValue) {
      // store initial value for the type
      let styleAttrValue = this.htmlElement.getAttribute("style") || "";

      // apply the styles when the event started
      this.htmlElement.addEventListener(pseudoEvent, () => {
        this.applyMultiStyles(styledClassValue);
      });

      // revertinf styles when done, apply initial value to the element
      this.htmlElement.addEventListener(revertEvent, () => {
        this.htmlElement.setAttribute("style", styleAttrValue);
      });
    }
  }

  // [ Feature ] - Main classname handler for tenoxui
  public applyStyles(className: string): void {
    // the regexp for matches all possible classname, with help of an AI 🤖
    const match = className.match(
      /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
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
          // hover prefix
          case "hover":
            this.pseudoHandler(type, value, unitOrValue, "mouseover", "mouseout");
            break;
          // focus prefix
          case "focus":
            this.pseudoHandler(type, value, unitOrValue, "focus", "blur");
            break;
          // responsive prefix
          default:
            this.handleResponsive(prefix, type, value, unitOrValue);
        }
      } else {
        // default style handler
        this.addStyle(type, value, unitOrValue);
      }
    } else if (className.startsWith("hover:") || className.startsWith("focus:")) {
      // get the class name's prefixes
      let pseudoClass = className.split(":")[0];
      // get the selector name
      let styleClassName = className.split(":")[1];

      // check if tge className is available on globalValueRegistry
      if (globalValueRegistry[styleClassName] || globalValueRegistry[`.${styleClassName}`]) {
        // hover event
        if (pseudoClass === "hover") {
          this.pseudoObjectHandler(styleClassName, "mouseover", "mouseout");
        }
        // focus event
        else if (pseudoClass === "focus") {
          this.pseudoObjectHandler(styleClassName, "focus", "blur");
        }
      }
    }
  }
  // multi classname function
  public applyMultiStyles(styles: string): void {
    // splitting the classname and apply the styles using `applyStyles` method
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
    const styler = new makeTenoxUI(element, allProps);
    styler.applyMultiStyles(styles);
  };
  // If styles is a string, apply it to the specified selector
  const elements = document.querySelectorAll(selector);
  elements.forEach((element: Element) => applyStylesToElement(element as HTMLElement, styles));
}

// Function to apply styles from selectors
function makeStyles(...stylesObjects: Styles[]): Styles {
  // Store defined styles into an object
  let storedStyles: Styles = {};
  let styleRegistry: StylesRegistry = {};
  // Helper function to apply styles to an element
  const applyStylesToElement = (element: HTMLElement, styles: string | Record<string, string>): void => {
    // styler helper
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

  // recursive function to handle nested styles
  const applyNestedStyles = (parentSelector: string, styles: Styles): void => {
    // iterate child selector and its style
    Object.entries(styles).forEach(([childSelector, childStyle]) => {
      //
      let elementClass = `${parentSelector} ${childSelector}`.trim();
      let elements = document.querySelectorAll<HTMLElement>(elementClass);

      // nested in nested 🗿
      if (typeof childStyle === "object" && !Array.isArray(childStyle)) {
        // recursively apply nested styles
        applyNestedStyles(elementClass, childStyle);
      } else {
        // apply direct styles if not overridden by nested styles / default style
        elements.forEach(element => {
          if (typeof childStyle === "string") {
            let styleArray = childStyle.split(" ");
            let styleResolve = styleArray
              .map(style => {
                // If the style is a reference to another class, get its styles
                return styleRegistry[style] ? styleRegistry[style].join(" ") : style;
              })
              .join(" ");
            applyStylesToElement(element, styleResolve);
          } else if (typeof childStyle === "object" && !Array.isArray(childStyle)) {
            applyStylesToElement(element, childStyle);
          } else {
            console.warn("Invalid nested style for:", childStyle);
          }
        });
      }
    });
  };

  // Handle styling logic, nested style, or only default
  stylesObjects.forEach(styleObject => {
    Object.entries(styleObject).forEach(([selector, styles]) => {
      // Store defined styles for reuse
      if (typeof styles === "string") {
        // Split the style string by spaces to support multiple classes
        const styleArray = styles.split(" ");
        styleRegistry[selector] = styleArray;
        storedStyles[selector] = styles;
      } else {
        storedStyles[selector] = styles;
      }

      // Select elements based on the selector
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach(element => {
        if (typeof styles === "string") {
          // Resolve stacked styles by looking them up in the registry
          let styleArray = styles.split(" ");
          let styleResolve = styleArray
            .map(style => {
              // If the style is a reference to another class, get its styles
              return styleRegistry[style] ? styleRegistry[style].join(" ") : style;
            })
            .join(" ");
          applyStylesToElement(element, styleResolve);
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
  // passing the stored value to `globalValueRegistry`
  globalValueRegistry = Object.assign(globalValueRegistry, storedStyles);
  // Return the defined styles
  return storedStyles;
}

// [ Feature ] - Adding custom configuration
function use(customConfig: { breakpoint?: Breakpoint; property?: Property[]; values?: DefinedValue }) {
  // custom breakpoints
  if (customConfig.breakpoint) {
    breakpoints = [...breakpoints, ...customConfig.breakpoint];
  }

  // types and properties to execute
  if (customConfig.property) {
    allProps = {
      ...allProps,
      ...Object.assign({}, ...customConfig.property)
    };
  }

  // value registry handler
  if (customConfig.values) {
    valueRegistry = customConfig.values;
  }
}

// [ Feature ] - Main styler for classname ✨
function tenoxui(...customPropsArray: Property[]): void {
  // only if the types and properties defined inside tenoxui function
  let objectProps = Object.assign({}, allProps, ...customPropsArray);

  // passing for global values
  allProps = objectProps;

  // generate className from property key's name, or property's type
  classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);

  // generate a selector from `classes`
  allClasses = document.querySelectorAll(classes.join(", "));
  // Iterate over elements with AllClasses
  allClasses.forEach((element: Element) => {
    // Get the list of classes for the current element
    let htmlElement = element as HTMLElement;
    // get lists of classname from the HTML element
    let elementClassList = htmlElement.classList;
    // styler helper
    const styler = new makeTenoxUI(htmlElement, allProps);
    // Iterate over classes and apply styles using makeTenoxUI
    elementClassList.forEach(className => {
      styler.applyStyles(className);
    });
  });
}
