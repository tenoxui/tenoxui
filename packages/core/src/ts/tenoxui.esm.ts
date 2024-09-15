/*!
 * tenoxui/core v1.0.5
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */

// makeTenoxUI constructor param
interface MakeTenoxUIParams {
  element: HTMLElement | NodeListOf<HTMLElement>;
  property: Property;
  values?: DefinedValue;
  breakpoints?: Breakpoint[];
  classes?: Classes;
}

// CSS properties mapping
type CSSProperty = keyof CSSStyleDeclaration;
export type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];

// type and property
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string };
};

// breakpoint
type Breakpoint = { name: string; min?: number; max?: number };

// value registry
export type DefinedValue = { [type: string]: { [value: string]: string } | string };

// defined class name from exact CSS property
export type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string;
  };
};

// makeTenoxUI
class makeTenoxUI {
  /**
   * WARNING: Entering this hell
   * is like stepping into a maze with no exit.
   * Good luck :)
   */

  private readonly htmlElement: HTMLElement;
  private readonly styleAttribute: Property;
  private readonly valueRegistry: DefinedValue;
  private readonly breakpoints: Breakpoint[];
  private readonly classes: Classes;
  constructor({ element, property = {}, values = {}, breakpoints = [], classes = {} }: MakeTenoxUIParams) {
    this.htmlElement = element instanceof HTMLElement ? element : element[0];
    this.styleAttribute = property;
    this.valueRegistry = values;
    this.breakpoints = breakpoints;
    this.classes = classes;
  }

  public useDOM() {
    this.scanAndApplyStyles();
    this.setupClassObserver();
  }

  private updateStyles(): void {
    this.htmlElement.style.cssText = "";
    this.scanAndApplyStyles();
  }

  private scanAndApplyStyles(): void {
    const classes = this.htmlElement.className.split(/\s+/);
    classes.forEach((className) => {
      this.applyStyles(className);
    });
  }

  private setupClassObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          this.updateStyles();
        }
      });
    });
    observer.observe(this.htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Utility method for handling the correct output value.
  private valueHandler(type: string, value: string, unit: string): string {
    const properties = this.styleAttribute[type];
    const registryValue = this.valueRegistry[value] as string;
    let resolvedValue = registryValue || value;

    /*
     * fixed: Defining values in `valueRegistry` caused the `value` with same value with unit to error. Example :
     *
     * property: { p: "padding" },
     * values: { 2: "10px" }
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
      resolvedValue = value;
    }
    // Custom value property
    else if (typeof properties === "object" && "value" in properties && !properties.value.includes("{value}")) {
      return properties.value;
    }
    // CSS variable property
    else if (resolvedValue.startsWith("$")) {
      return `var(--${resolvedValue.slice(1)})`;
    }
    // Custom value
    else if (resolvedValue.startsWith("[") && resolvedValue.endsWith("]")) {
      const solidValue = resolvedValue.slice(1, -1).replace(/\\_/g, " ");
      return solidValue.startsWith("--") ? `var(${solidValue})` : solidValue;
    }

    // Use custom value from valueRegistry
    const typeRegistry = this.valueRegistry[type];

    if (typeof typeRegistry === "object") {
      resolvedValue = typeRegistry[value] || resolvedValue;
    }
    return resolvedValue + unit;
  }

  /**
   * Handle default CSS variable style
   *
   * Instead of using CSS property directly, use `setProperty` -
   * to set variable and value to the element.
   */
  private setCssVar(variable: string, value: string): void {
    this.htmlElement.style.setProperty(variable, value);
  }

  /**
   * Handle custom value property.
   *
   * Style handler for custom value field on `this.styleAttribute` -
   * if available.
   *
   * It will replace every `{value}` string with inputted value. Example :
   *
   * px: {
   *   property: 'padding',
   *   value: '10px {value} 1rem {value}'
   * }
   *
   * Usage:
   * `px-2rem` _ the output style will be `10px 2rem 1rem 2rem`.
   *
   */
  private setCustomValue(properties: { property: GetCSSProperty; value?: string }, resolvedValue: string): void {
    const { property, value } = properties;
    let finalValue = resolvedValue;

    if (value) {
      finalValue = value.replace(/{value}/g, resolvedValue);
    }

    // handle single property or array of property (multiple properties)
    if (typeof property === "string") {
      // CSS variable or CSS property
      if (property.startsWith("--")) {
        this.setCssVar(property, finalValue);
      } else {
        (this.htmlElement.style as any)[property] = finalValue;
      }
    } else if (Array.isArray(property)) {
      property.forEach((prop) => {
        if (typeof prop === "string" && prop.startsWith("--")) {
          this.setCssVar(prop, finalValue);
        } else {
          (this.htmlElement.style as any)[prop] = finalValue;
        }
      });
    }
  }

  // Handle default property and value
  private setDefaultValue(properties: string | string[], resolvedValue: string): void {
    const arrayOfProperty = Array.isArray(properties) ? properties : [properties];

    arrayOfProperty.forEach((property) => {
      if (typeof property === "string" && property.startsWith("--")) {
        this.setCssVar(property, resolvedValue);
      } else {
        (this.htmlElement.style as any)[property] = resolvedValue;
      }
    });
  }

  // Custom class or this.classes's utility.
  private setCustomClass(propKey: string, value: string): void {
    if (propKey.startsWith("--")) {
      this.setCssVar(propKey, value);
    } else {
      (this.htmlElement.style as any)[propKey] = value;
    }
  }

  // Utility to match custom value property
  private isObjectWithValue(typeAttribute: any): typeAttribute is { property: GetCSSProperty; value: string } {
    return (
      typeof typeAttribute === "object" &&
      typeAttribute !== null &&
      "value" in typeAttribute &&
      "property" in typeAttribute
    );
  }

  // Utility to match className prefix and screen correct screen size
  private matchBreakpoint(
    bp: Breakpoint, // breakpoint object
    prefix: string, // className prefix
    width: number // current screen size
  ): boolean {
    if (bp.name !== prefix) return false;
    if (bp.min !== undefined && bp.max !== undefined) {
      return width >= bp.min && width <= bp.max;
    }
    if (bp.min !== undefined) return width >= bp.min;
    if (bp.max !== undefined) return width <= bp.max;
    return false;
  }

  // Utility to convert `camelCase` into `kebab-case`
  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    //? The pseudo handler not working properly whenever the property defined with `camelCase`, e.g. 'backgroundColor' need to be 'background-color'.
  }

  // responsive className handler
  private handleResponsive(
    breakpointPrefix: string,
    type: string,
    value: string,
    unit: string,
    propKey?: string
  ): void {
    const properties = this.styleAttribute[type];

    // Handle screen resizing
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const matchPoint = this.breakpoints.find((bp) => this.matchBreakpoint(bp, breakpointPrefix, windowWidth));

      // If className's prefix match current screen size
      if (matchPoint) {
        if (this.isObjectWithValue(properties)) {
          this.addStyle(type);
        } else if (propKey && this.classes[propKey]) {
          this.addStyle(type, value, unit, propKey);
        } else {
          this.addStyle(type, value, unit);
        }
      } else {
        this.htmlElement.style[type as any] = "";
      }
    };

    // Initialize style from current screen size
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  // Utility to get correct CSS property or variable from its type or defined CSS property.
  private getPropName(type: string, propKey?: string): string | string[] | undefined {
    if (type.startsWith("[--") && type.endsWith("]")) {
      return type.slice(1, -1);
    }

    if (propKey && this.classes[propKey]) {
      return this.camelToKebab(propKey);
    }

    const property = (this.styleAttribute[type] as any)?.property ?? this.styleAttribute[type];

    if (Array.isArray(property)) {
      return property.map(this.camelToKebab);
    }

    return property ? this.camelToKebab(property as string) : undefined;
  }

  // Utility method to get the initial value before the pseudo initialization
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

  // Utility to revert style to its initial value
  private revertStyle(propsName: string | string[], styleInitValue: { [key: string]: string } | string): void {
    if (Array.isArray(propsName)) {
      propsName.forEach((propName) => {
        this.setCssVar(propName, (styleInitValue as { [key: string]: string })[propName]);
      });
    } else {
      this.setCssVar(propsName, styleInitValue as string);
    }
  }

  /**
   * Handle pseudo class name.
   *
   * Imitating something like hover or focus effect with javascript. With this setup -
   * it is possible to correctly imitate pseudo event, but with less extensibility.
   *
   * To do this, we need to get the initial value of the element before the event -
   * is handled. And after the event is no longer available, we will -
   * revert the style, we will re-apply the initial value back to the element.
   *
   * Example :
   * { property: { bg: 'backgroundColor' } }
   *
   * <div class="bg-red hover:bg-blue"></div>
   *
   * The initial value of the element is `red`, when the hover event is available -
   * the current `background-color` will replaced with `blue`, and will back -
   * to `red` after hover event is done.
   *
   */
  private pseudoHandler(
    type: string,
    value: string,
    unit: string,
    pseudoEvent: string,
    revertEvent: string,
    propKey?: string // conditional CSS property from this.classes
  ): void {
    const properties = this.styleAttribute[type];

    const propertyToHandle = propKey
      ? this.getPropName("", propKey) // property from this.classes
      : this.getPropName(type); // default property

    // get initial value from computed property
    const styleInitValue = this.getInitialValue(propertyToHandle);

    const applyStyle = () => {
      if (this.isObjectWithValue(properties)) {
        if (properties.value.includes("{value}")) {
          this.addStyle(type, value, unit);
        } else {
          this.addStyle(type);
        }
      } else if (propKey && this.classes[propKey][type]) {
        this.addStyle(type, value, "", propKey);
      } else {
        this.addStyle(type, value, unit);
      }
    };

    const revertStyle = () => this.revertStyle(propertyToHandle, styleInitValue);

    this.htmlElement.addEventListener(pseudoEvent, applyStyle);
    this.htmlElement.addEventListener(revertEvent, revertStyle);
  }

  // TenoxUI className RegExp pattern
  private classNameRegEx =
    /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/;

  // utility to Break class names into several parts
  private parseClassName(
    className: string
  ): [string | undefined, string, string | undefined, string | undefined] | null {
    const match = className.match(this.classNameRegEx);

    if (!match) return null;

    const [, prefix, type, value, , unit] = match;
    return [prefix, type, value, unit];
  }

  // Utility to compute parent property from custom classes's className
  private getParentClass(className: string): string[] {
    const classObject = this.classes;
    const matchingProperties = [];
    for (const cssProperty in classObject) {
      if (classObject[cssProperty].hasOwnProperty(className)) {
        matchingProperties.push(cssProperty);
      }
    }
    return matchingProperties;
  }

  // Helper for handling prefixed class names
  private applyPrefixedStyle(prefix: string, type: string, value: string, unit: string, propKey?: string): void {
    switch (prefix) {
      case "hover":
        this.pseudoHandler(type, value, unit, "mouseover", "mouseout", propKey);
        break;
      case "focus":
        this.pseudoHandler(type, value, unit, "focus", "blur", propKey);
        break;
      default:
        this.handleResponsive(prefix, type, value, unit, propKey);
    }
  }

  // Default class names handler
  private parseDefaultStyle(prefix: string | undefined, type: string, value: string, unit: string | undefined): void {
    if (prefix) {
      this.applyPrefixedStyle(prefix, type, value, unit);
    } else {
      this.addStyle(type, value, unit);
    }
  }

  // Handle custom value property, if the type was an object and have `value` field
  private handlePredefinedStyle(type: string, prefix?: string): boolean {
    const properties = this.styleAttribute[type];

    if (properties && this.isObjectWithValue(properties)) {
      const value = properties.value;

      if (prefix) {
        this.applyPrefixedStyle(prefix, type, value, "");
      } else {
        this.addStyle(type);
      }
      return true;
    }
    return false;
  }

  // Handler for custom className from `this.classes`
  private handleCustomClass(type: string, prefix?: string): boolean {
    // Get every single properties that has exact className
    const propKeys = this.getParentClass(type);

    if (propKeys.length > 0) {
      propKeys.forEach((propKey) => {
        const value = this.classes[propKey][type];
        if (prefix) {
          this.applyPrefixedStyle(prefix, type, value, "", propKey);
        } else {
          this.addStyle(type, value, "", propKey);
        }
        return true;
      });
    }
    return false;
  }

  public addStyle(type: string, value?: string, unit?: string, classProp?: string): void {
    const properties = this.styleAttribute[type];
    const definedClass = this.classes;

    // Use className from `definedClass` instead
    if (definedClass[classProp]) {
      this.setCustomClass(classProp, value);
      return;
    }

    /**
     * Creating custom className from custom value property.
     *
     * Example :
     * _ property config :
     * {
     *   bg: {
     *     property: 'background',
     *     value: '{value}'
     *   },
     *   myBg: {
     *     property: 'background',
     *     value: 'red'
     *   }
     * }
     *
     * _ element class name
     * <div class='bg-red'></div>
     * <div class='myBg'></div>
     *
     * Both elements will have same background color, but `myBg` doesn't need any value to pass.
     */
    if (!value && this.isObjectWithValue(properties)) {
      value = properties.value;
    }

    if (!value) return;
    // Compute the value
    let resolvedValue = this.valueHandler(type, value, unit || "");

    /**
     * This section will remove `transition` or `transitionDuration` property -
     * when the page loaded. It also ensures the element doesn't create unnecessary -
     * layout shift because tenoxui compute every styles at the same time when -
     * the page loaded.
     */
    if (properties === "transition" || properties === "transitionDuration") {
      // Remove transition from element style if available
      this.htmlElement.style.transition = "none";
      this.htmlElement.style.transitionDuration = "0s";
      // Force a reflow
      void this.htmlElement.offsetHeight;

      // Instead of using setTimeout(0), use requestAnimationFrame to -
      // Ensure the transition is applied as fast as possible

      requestAnimationFrame(() => {
        // remove the temporary transition styles
        this.htmlElement.style.transition = "";
        this.htmlElement.style.transitionDuration = "";

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

    // Other states for applying the style

    // CSS variable className
    if (type.startsWith("[--") && type.endsWith("]")) {
      this.setCssVar(type.slice(1, -1), resolvedValue);
    }
    // Custom value property handler
    else if (typeof properties === "object" && "property" in properties) {
      this.setCustomValue(properties as { property: GetCSSProperty; value?: string }, resolvedValue);
    }
    // Default value handler
    else if (properties) {
      this.setDefaultValue(properties as string | string[], resolvedValue);
    }
  }

  // Match and apply the styles based on the class names rules
  public applyStyles(className: string): void {
    const [prefix, type] = className.split(":");
    const getType = type || prefix;
    const getPrefix = type ? prefix : undefined;

    /**
     * Parsing custom values and classes.
     *
     * This parser will handle custom value property and property-based className (every -
     * classNames defined under `this.classes`).
     *
     * The current rules only handled custom value property and property-based className.
     */

    if (this.handlePredefinedStyle(getType, getPrefix)) return;

    if (this.handleCustomClass(getType, getPrefix)) return;

    /**
     * Default className parser.
     *
     * If the classname doesn't match any rules above, we can parse the -
     * className and use default style parser to apply the styles.
     */

    const parts = this.parseClassName(className);

    if (!parts) return;

    const [parsedPrefix, parsedType, value, unit] = parts;

    this.parseDefaultStyle(parsedPrefix, parsedType, value, unit);
  }

  public applyMultiStyles(styles: string): void {
    styles.split(/\s+/).forEach((style) => this.applyStyles(style));
  }
}
export { makeTenoxUI };
