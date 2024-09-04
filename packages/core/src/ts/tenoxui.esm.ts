/*!
 * tenoxui/core v1.0.4
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

// makeTenoxUI constructor param
interface MakeTenoxUIParams {
  element: HTMLElement | NodeListOf<HTMLElement>;
  property: Property;
  values?: DefinedValue;
  breakpoint?: Breakpoint[];
  classes?: Classes;
}
// CSS properties mapping
type CSSProperty = keyof CSSStyleDeclaration;
type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];

// type and property
type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string };
};

// breakpoint
type Breakpoint = { name: string; min?: number; max?: number };

// value registry
type DefinedValue = { [type: string]: { [value: string]: string } | string };

// defined class name from exact CSS property
type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string;
  };
};

// makeTenoxUI
class makeTenoxUI {
  /*
   * WARNING: Entering this function
   * is like stepping into a maze with no exit.
   * Good luck 🗿
   */
  // makeTenoxUI constructor
  constructor({ element, property = {}, values = {}, breakpoint = [], classes = {} }: MakeTenoxUIParams) {
    this.htmlElement = element instanceof HTMLElement ? element : element[0];
    this.styleAttribute = property;
    this.valueRegistry = values;
    this.breakpoints = breakpoint;
    this.classes = classes;

    // DOM compability
    this.scanAndApplyStyles();
    this.setupClassObserver();
  }
  // selectors
  private readonly htmlElement: HTMLElement;
  // types and properties
  private readonly styleAttribute: Property;
  // stored values
  private readonly valueRegistry: DefinedValue;
  // breakpoints
  private readonly breakpoints: Breakpoint[];
  // classes
  private readonly classes: Classes;
  // get the classlist from the input selector, and apply the styles from element's classname
  private scanAndApplyStyles(): void {
    // get class names of the element
    const classes = this.htmlElement.className.split(/\s+/);
    classes.forEach(className => {
      // apply styles (it's clear :/)
      this.applyStyles(className);
    });
  }
  // style update/resetter
  private updateStyles(): void {
    // clear existing styles
    this.htmlElement.style.cssText = "";
    // re-apply styles
    this.scanAndApplyStyles();
  }
  // observer to update style when the className is changed
  private setupClassObserver(): void {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          // update the styles
          this.updateStyles();
        }
      });
    });
    observer.observe(this.htmlElement, {
      attributes: true,
      // observe the className changes
      attributeFilter: ["class"]
    });
  }
  // logic for handling all defined value from the classnames
  private valueHandler(type: string, value: string, unit: string): string {
    // use `values` from `valueRegistry` if match
    const registryValue = this.valueRegistry[value] as string;
    // get property and custom values (if available) from type
    const properties = this.styleAttribute[type];
    // use `values` from valueRegistry or default value
    let resolvedValue = registryValue || value;
    // If no value is provided, and properties has a predefined value, use it

    /*
     * fixed: Defining values in `valueRegistry` caused the `value` with same value with unit to error. Example :
     *
     * new makeTenoxUI({
     *   element: ...,
     *   property: { p: "padding" },
     *   values: { 2: "10px" }
     * })
     *
     * Output :
     * `p-2` _ padding: 10px;
     * `p-2rem` _ padding: 10pxrem;
     *
     * After Fixed :
     * `p-2` _ padding: 10px;
     * `p-2rem` _ padding: 2rem;
     */
    if ((value + unit).length !== value.toString().length && unit !== "") {
      // use inputted `value`
      resolvedValue = value;
    }
    // Handle custom values from `this.styleAttribute`
    else if (typeof properties === "object" && "value" in properties && !properties.value.includes("{value}")) {
      // get the value from `this.styleAttribute[type].value`
      return properties.value;
    }
    // css variable classname, started with `$` and the value after it will treated as css variable
    else if (resolvedValue.startsWith("$")) {
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
  // regular `types` and `properties` handler
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
  // handle custom classes
  private setCustomClass(propKey: string, value: string): void {
    // if the property is a CSS variable
    if (propKey.startsWith("--")) {
      this.setCssVar(propKey, value);
    }
    // or use default styler
    else {
      (this.htmlElement.style as any)[propKey] = value;
    }
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
  // responsive className handler
  private handleResponsive(
    breakpointPrefix: string,
    type: string,
    value: string,
    unit: string,
    propKey?: string
  ): void {
    // get property from the type
    const properties = this.styleAttribute[type];

    // handle responsive prefix
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const matchPoint = this.breakpoints.find(bp => this.matchBreakpoint(bp, breakpointPrefix, windowWidth));

      // apply exact styles if matches
      if (matchPoint) {
        // object `type` style
        if (this.isObjectWithValue(properties)) {
          this.addStyle(type);
        } else if (propKey && this.classes[propKey]) {
          this.addStyle(type, value, unit, propKey);
        } else {
          // apply regular style
          this.addStyle(type, value, unit);
        }
      } else {
        // remove value
        this.htmlElement.style[type as any] = "";
      }
    };

    // apply responsive style when the page loaded
    handleResize();
    // apply when the screen size is changing
    window.addEventListener("resize", handleResize);
  }

  // utility to get the type from the property's name
  private getPropName(type: string, propKey?: string): string | string[] | undefined {
    // css variable className
    if (type.startsWith("[--") && type.endsWith("]")) {
      return type.slice(1, -1);
    }
    // is the property was from custom value, or regular property
    const property = (this.styleAttribute[type] as any)?.property || this.styleAttribute[type];
    // get defined className property's key
    if (propKey && this.classes[propKey]) {
      return this.camelToKebab(propKey);
    }
    // is property defined as an array?
    else if (Array.isArray(property)) {
      return property.map(this.camelToKebab);
    } else if (property) {
      return this.camelToKebab(property as string);
    } else {
      return undefined;
    }
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
    // if the property is defined as an object / multiple properties
    if (Array.isArray(propsName)) {
      propsName.forEach(propName => {
        this.setCssVar(propName, (styleInitValue as { [key: string]: string })[propName]);
      });
    }
    // single property
    else {
      this.setCssVar(propsName, styleInitValue as string);
    }
  }
  // pseudo handler
  private pseudoHandler(
    type: string,
    value: string,
    unit: string,
    pseudoEvent: string,
    revertEvent: string,
    propKey?: string // conditional css property from this classes
  ): void {
    // the type's name inside of property
    const properties = this.styleAttribute[type];
    // get the property's name
    const propsName = propKey ? this.getPropName("", propKey) : this.getPropName(type);
    // get initial style
    const styleInitValue = this.getInitialValue(propsName);
    // applyStyle logic
    const applyStyle = () => {
      // is the properties an object?
      if (this.isObjectWithValue(properties)) {
        // if has "{value}", use regular styling method
        if (properties.value.includes("{value}")) {
          this.addStyle(type, value, unit);
        } else {
          // if doesn't have any "{value}", get only the type, as className
          this.addStyle(type);
        }
      } else if (propKey && this.classes[propKey][type]) {
        this.addStyle(type, value, "", propKey);
      } else {
        // else, use default styling
        this.addStyle(type, value, unit);
      }
    };

    // revert style helper
    const revertStyle = () => this.revertStyle(propsName, styleInitValue);

    // add the listener
    this.htmlElement.addEventListener(pseudoEvent, applyStyle);
    this.htmlElement.addEventListener(revertEvent, revertStyle);
  }

  // function to match the classnames with the correct handler
  private parseClassName(
    className: string
  ): [string | undefined, string, string | undefined, string | undefined] | null {
    // using regexp to parse all possible class names
    const match = className.match(
      /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    );

    // don't do anything if the class name is didn't match, maybe that is class name from outside tenoxui environment
    if (!match) return null;

    // returning parsed class name
    const [, prefix, type, value, , unit] = match;
    return [prefix, type, value, unit];
  }

  // function to compute parent property from custom classes's className
  private getParentClass(className: string): string[] {
    const classObject = this.classes;
    // store as array
    const matchingProperties = [];

    // get every single css property that have the same className
    for (const cssProperty in classObject) {
      if (classObject[cssProperty].hasOwnProperty(className)) {
        matchingProperties.push(cssProperty);
      }
    }
    // return an array of available properties of the className
    return matchingProperties;
  }
  // get value from custom value
  private isObjectWithValue(typeAttribute: any): typeAttribute is { property: string | string[]; value: string } {
    return (
      // is the styleAttribute[type] is an object
      typeof typeAttribute === "object" &&
      // the styleAttribute[type] must have a value
      typeAttribute !== null &&
      // value in styleAttribute[type]
      "value" in typeAttribute &&
      // property in styleAttribute[type]
      "property" in typeAttribute
    );
  }
  // default style parser
  private parseDefaultStyle(prefix: string | undefined, type: string, value: string, unit: string | undefined): void {
    if (prefix) {
      // prexied className
      this.applyPrefixedStyle(prefix, type, value, unit);
    } else {
      // default style
      this.addStyle(type, value, unit);
    }
  }
  // handle the `prefix`ed className
  private applyPrefixedStyle(prefix: string, type: string, value: string, unit: string, propKey?: string): void {
    switch (prefix) {
      // hover
      case "hover":
        this.pseudoHandler(type, value, unit, "mouseover", "mouseout", propKey);
        break;
      // focus effect
      case "focus":
        this.pseudoHandler(type, value, unit, "focus", "blur", propKey);
        break;
      default:
        // responsive handler
        this.handleResponsive(prefix, type, value, unit, propKey);
    }
  }
  // handle custom value fron `this.styleAttribute` if the type was an object
  private handlePredefinedStyle(type: string, prefix?: string): boolean {
    const properties = this.styleAttribute[type];
    if (properties && this.isObjectWithValue(properties)) {
      // use defined `value` from exact custom value if available
      const value = properties.value;
      if (prefix) {
        // if className has prefixes
        this.applyPrefixedStyle(prefix, type, value, "");
      } else {
        // default styler, only use the className
        this.addStyle(type);
      }
      return true;
    }
    return false;
  }
  // custom className from `this.classes`
  private handleCustomClass(type: string, prefix?: string): boolean {
    // get all properties that have exact className
    const propKeys = this.getParentClass(type);
    if (propKeys.length > 0) {
      // iterate the propeties
      propKeys.forEach(propKey => {
        const value = this.classes[propKey][type];
        if (prefix) {
          // handle prefix
          this.applyPrefixedStyle(prefix, type, value, "", propKey);
        } else {
          // handle default style
          this.addStyle(type, value, "", propKey);
        }
        return true;
      });
    }
    return false;
  }
  // main styler, handling the type, property, and value
  public addStyle(type: string, value?: string, unit?: string, classProp?: string): void {
    // get css property from styleAttribute
    const properties = this.styleAttribute[type];
    // get class name from custom class
    const definedClass = this.classes;

    // use className from `definedClass` instead
    if (definedClass[classProp]) {
      // apply style using setCustomClass method
      this.setCustomClass(classProp, value);
      return;
    }

    // if no value is provided and properties is an object with a 'value' key, use that value
    if (!value && this.isObjectWithValue(properties)) {
      // use value from custom value
      value = properties.value;
    }

    // don't process type with no value
    if (!value) return;

    // compute values
    let resolvedValue = this.valueHandler(type, value, unit || "");

    // handle transition when the page fire up
    if (properties === "transition" || properties === "transitionDuration") {
      // set initial value
      this.htmlElement.style.transition = "none";
      this.htmlElement.style.transitionDuration = "0s";
      // forcing reflow
      void this.htmlElement.offsetHeight;

      // instead of using setTimeout(0), use requestAnimationFrame to ensure the transition is applied as fast as possible

      requestAnimationFrame(() => {
        // remove the temporary transition styles
        this.htmlElement.style.transition = "";
        this.htmlElement.style.transitionDuration = "";
        // re-force a reflow
        void this.htmlElement.offsetHeight;

        // re-apply the styles for transition property
        if (properties === "transition") {
          this.htmlElement.style.transition = resolvedValue;
        } else {
          this.htmlElement.style.transitionDuration = resolvedValue;
        }
      });

      return;
    }

    // other condition to apply the styles
    // css variable className
    if (type.startsWith("[--") && type.endsWith("]")) {
      this.setCssVar(type.slice(1, -1), resolvedValue);
    }
    // custom value handler
    else if (typeof properties === "object" && "property" in properties) {
      this.setCustomValue(properties as { property: string | string[]; value?: string }, resolvedValue);
    }
    // regular/default value handler
    else if (properties) {
      this.setDefaultValue(properties as string | string[], resolvedValue);
    }
  }
  // compute styles for the className
  public applyStyles(className: string): void {
    // split className, get the prefix and the actual className
    const [prefix, type] = className.split(":");
    const getType = type || prefix;
    const getPrefix = type ? prefix : undefined;

    // handle predefined styles in styleAttribute
    if (this.handlePredefinedStyle(getType, getPrefix)) return;

    // handle custom classes
    if (this.handleCustomClass(getType, getPrefix)) return;

    // parse and apply regular styles
    const parts = this.parseClassName(className);
    if (!parts) return;

    // get parsed className from parts
    const [parsedPrefix, parsedType, value, unit] = parts;
    // use default styler if method above isn't used
    this.parseDefaultStyle(parsedPrefix, parsedType, value, unit);
  }
}

export { makeTenoxUI };
