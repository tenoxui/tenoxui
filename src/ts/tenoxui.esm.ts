/*!
 * tenoxui/css v0.11.0-alpha.10
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

interface MakeTenoxUIParams {
  element: HTMLElement | NodeListOf<HTMLElement>;
  property?: Property;
  values?: DefinedValue;
  breakpoint?: Breakpoint[];
}
type Property = {
  [key: string]: string | string[] | { property?: string | string[]; value?: string };
};
type Breakpoint = { name: string; min?: number; max?: number };
type StylesRegistry = Record<string, string[]>;
type DefinedValue = { [key: string]: { [key: string]: string } | string };
interface TypeObjects {
  [key: string]: string | TypeObjects;
}
type Styles = TypeObjects | Record<string, TypeObjects[]>;
type Classes = string[];
type AllClasses = NodeListOf<HTMLElement>;

class makeTenoxUI {
  // selectors
  private readonly htmlElement: HTMLElement;
  // types and properties
  private readonly styleAttribute: Property;
  // stored values
  private readonly valueRegistry: DefinedValue;
  // breakpoints
  private readonly breakpoints: Breakpoint[];
  // makeTenoxUI constructor
  constructor({ element, property = {}, values = {}, breakpoint = [] }: MakeTenoxUIParams) {
    this.htmlElement = element instanceof HTMLElement ? element : element[0];
    this.styleAttribute = property;
    this.valueRegistry = values;
    this.breakpoints = breakpoint;
  }
  // logic for handling all defined value from the classnames
  private valueHandler(type: string, value: string, unit: string): string {
    // use `values` from `valueRegistry` if match
    const registryValue = this.valueRegistry[value] as string;
    // use `values` from registry or default value
    let resolvedValue = registryValue || value;
    // css variable classname, started with `$` and the value after it will treated as css variable
    if (resolvedValue.startsWith("$")) {
      return `var(--${resolvedValue.slice(1)})`;
    }
    // custom value handler
    else if (resolvedValue.startsWith("[") && resolvedValue.endsWith("]")) {
      const solidValue = resolvedValue.slice(1, -1).replace(/\\_/g, " ");
      return solidValue.startsWith("--") ? `var(${solidValue})` : solidValue;
    }
    // custom value for each `type` handler, available only for defined type
    const typeRegistry = this.valueRegistry[type];
    if (typeof typeRegistry === "object") {
      resolvedValue = typeRegistry[value] || resolvedValue;
    }
    // return resolvedValue
    return resolvedValue + unit;
  }
  // css variable values handler
  private setCssVar(variable: string, value: string): void {
    // set the variable and the value
    this.htmlElement.style.setProperty(variable, value);
  }
  // custom value handler
  private setCustomValue(properties: { property: string | string[]; value?: string }, resolvedValue: string): void {
    // get the `property` and `value` from defined custom value / `properties`
    const { property, value } = properties;
    // store resolved value
    let finalValue = resolvedValue;
    // if `properties` has `value`'s value, replace the `{value}` with the resolved value
    if (value) {
      finalValue = value.replace(/{value}/g, resolvedValue);
    }
    // single property handler
    // css variable handler
    if (typeof property === "string") {
      // get the css variable value, if started with `--{property}`
      if (property.startsWith("--")) {
        // set property with final value
        this.setCssVar(property, finalValue);
      }
      // else, if default property, set the finalValue for the `property`
      else {
        (this.htmlElement.style as any)[property] = finalValue;
      }
    }
    // multiple `property` within propeties
    else if (Array.isArray(property)) {
      property.forEach(prop => {
        // goes same actually...
        if (typeof prop === "string" && prop.startsWith("--")) {
          this.setCssVar(prop, finalValue);
        } else {
          (this.htmlElement.style as any)[prop] = finalValue;
        }
      });
    }
  }
  // rrgular `types` and `properties` handler
  private setDefaultValue(properties: string | string[], resolvedValue: string): void {
    // isArray?
    const propsArray = Array.isArray(properties) ? properties : [properties];
    // iterate properties into single property
    propsArray.forEach(property => {
      // same styler, again...
      if (typeof property === "string" && property.startsWith("--")) {
        this.setCssVar(property, resolvedValue);
      } else {
        (this.htmlElement.style as any)[property] = resolvedValue;
      }
    });
  }
  // responsive handlet
  private handleResponsive(breakpointPrefix: string, type: string, value: string, unit: string): void {
    const handleResize = () => {
      // get screen size
      const windowWidth = window.innerWidth;
      // creating matchpoint to apply the styles
      const matchPoint = this.breakpoints.find(bp => this.matchBreakpoint(bp, breakpointPrefix, windowWidth));
      // if match?
      if (matchPoint) {
        // apply the style when the breakpoints is macth with the screen size
        this.addStyle(type, value, unit);
      } else {
        // remove value :)
        this.htmlElement.style[type] = "";
      }
    };
    // start the resize handler
    handleResize();
    // apply when the screen size is changing (maybe caused the memory leaks)
    window.addEventListener("resize", handleResize);
  }
  // match point
  private matchBreakpoint(bp: Breakpoint, prefix: string, width: number): boolean {
    // don't ask me... :(
    if (bp.name !== prefix) return false;
    if (bp.min !== undefined && bp.max !== undefined) {
      return width >= bp.min && width <= bp.max;
    }
    if (bp.min !== undefined) return width >= bp.min;
    if (bp.max !== undefined) return width <= bp.max;
    return false;
  }
  // utility to turn `camelCase` into `kebab-case`
  private camelToKebab(str: string): string {
    // return the
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    // reason? The pseudo handler not working properly whenever the property defined with `camelCase`
  }
  // pseudo selector imitation
  private pseudoHandler(type: string, value: string, unit: string, pseudoEvent: string, revertEvent: string): void {
    // get the
    const propsName = this.getPropName(type);
    const styleInitValue = this.getInitialValue(propsName);
    const applyStyle = () => this.addStyle(type, value, unit);
    const revertStyle = () => this.revertStyle(propsName, styleInitValue);
    this.htmlElement.addEventListener(pseudoEvent, applyStyle);
    this.htmlElement.addEventListener(revertEvent, revertStyle);
  }
  // utility to get the type from the property's name
  private getPropName(type: string): string | string[] {
    if (type.startsWith("[--") && type.endsWith("]")) {
      return type.slice(1, -1);
    }
    // is the property was from custom value, or regular property
    const property = (this.styleAttribute[type] as any)?.property || this.styleAttribute[type];
    // is the property defined as an array?
    return Array.isArray(property) ? property.map(this.camelToKebab) : this.camelToKebab(property as string);
  }
  // utility method to get the initial value before the pseudo initialization
  private getInitialValue(propsName: string | string[]): { [key: string]: string } | string {
    if (Array.isArray(propsName)) {
      return propsName.reduce(
        (acc, propName) => {
          acc[propName] = this.htmlElement.style.getPropertyValue(propName);
          return acc;
        },
        {} as { [key: string]: string }
      );
    }
    return this.htmlElement.style.getPropertyValue(propsName);
  }
  // revert value when the listener is done
  private revertStyle(propsName: string | string[], styleInitValue: { [key: string]: string } | string): void {
    if (Array.isArray(propsName)) {
      propsName.forEach(propName => {
        this.setCssVar(propName, (styleInitValue as { [key: string]: string })[propName]);
      });
    } else {
      this.setCssVar(propsName, styleInitValue as string);
    }
  }
  // element's classnames parser
  private parseClassName(className: string): [string | undefined, string, string, string] | null {
    // use `regexp` to match all possible classmame
    const match = className.match(
      /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    );
    if (!match) return null;
    // get prefix, type, value, and the unit from match
    const [, prefix, type, value, , unit] = match;
    return [prefix, type, value, unit];
  }
  // main styler, handling the type, property, and value
  public addStyle(type: string, value: string, unit: string): void {
    // get css property from styleAttribute
    const properties = this.styleAttribute[type];
    // compute values
    let resolvedValue = this.valueHandler(type, value, unit);
    // logic to apply the styles
    // css variable type handler
    if (type.startsWith("[--") && type.endsWith("]")) {
      this.setCssVar(type.slice(1, -1), resolvedValue);
    }
    // custom value of type and property handler
    else if (typeof properties === "object" && "property" in properties) {
      this.setCustomValue(properties as { property: string | string[]; value?: string }, resolvedValue);
    }
    // regular classname handler / default type and property
    else if (properties) {
      this.setDefaultValue(properties as string | string[], resolvedValue);
    }
  }
  // function to match the classnames with the correct handler
  public applyStyles(className: string): void {
    // get the parsed classname
    const parts = this.parseClassName(className);
    if (!parts) return;
    // matching the parts, like type and value
    const [prefix, type, value, unit] = parts;
    // if classmame has prefix
    if (prefix) {
      switch (prefix) {
        // hover prefix handler
        case "hover":
          this.pseudoHandler(type, value, unit, "mouseover", "mouseout");
          break;
        // focus prefix state handler
        case "focus":
          this.pseudoHandler(type, value, unit, "focus", "blur");
          break;
        // responsive breakpoint prefix
        default:
          this.handleResponsive(prefix, type, value, unit);
      }
    }
    // else, apply default / regular style
    else {
      this.addStyle(type, value, unit);
    }
  }
  // just applyStyles, but with more confidential :)
  public applyMultiStyles(styles: string): void {
    // splitting the styles and apply each styles with applyStyles method
    styles.split(/\s+/).forEach(style => this.applyStyles(style));
  }
}

// stored values
let allProps: Property;
let breakpoints: Breakpoint[] = [];
let globalValues: DefinedValue = {};

/*
 * [ Feature ] - `makeStyle` and `makeStyles` function
 *
 * Imitate css-in-js functionality :)
 */

// apply multi style into all elements with the specified selector
function makeStyle(selector: string, styles: string): void {
  const applyStylesToElement = (element: HTMLElement, styles: string): void => {
    // styler helper
    const styler = new makeTenoxUI({ element, property: allProps, values: globalValues, breakpoint: breakpoints });
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
    const styler = new makeTenoxUI({
      element: element,
      property: allProps,
      values: globalValues,
      breakpoint: breakpoints
    });

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

  return storedStyles;
}

// [ Feature ] - Adding custom configuration
function use(customConfig: { breakpoint?: Breakpoint[]; property?: Property[]; values?: DefinedValue }) {
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
    globalValues = customConfig.values;
  }
}

// [ Feature ] - Main styler for classname ✨
function tenoxui(...customPropsArray: Property[]): void {
  // only if the types and properties defined inside tenoxui function
  let objectProps = Object.assign({}, allProps, ...customPropsArray);

  // passing for global values
  allProps = objectProps;

  // generate className from property key's name, or property's type
  let classes: Classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);

  // generate a selector from `classes`
  let allClasses: AllClasses = document.querySelectorAll(classes.join(", "));

  // Iterate over elements with AllClasses
  allClasses.forEach((element: Element) => {
    // Get the list of classes for the current element
    let htmlElement = element as HTMLElement;
    // get lists of classname from the HTML element
    let elementClassList = htmlElement.classList;
    // styler helper
    const styler = new makeTenoxUI({
      element: htmlElement,
      property: allProps,
      values: globalValues,
      breakpoint: breakpoints
    });
    // Iterate over classes and apply styles using makeTenoxUI
    elementClassList.forEach(className => {
      styler.applyStyles(className);
    });
  });
}


export { makeStyle, makeStyles, makeTenoxUI, use, tenoxui as default };
