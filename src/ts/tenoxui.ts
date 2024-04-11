/*!
 * TenoxUI CSS Framework v0.7.0 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
// All TenoxUI `type` and `property`
const property: {
  // key, always string, value, can be string or an array that store string
  [key: string]: string | string[];
} = {
  // Mapping type and its Property
  p: "padding",
  pt: "paddingTop",
  pb: "paddingBottom",
  pr: "paddingRight",
  pl: "paddingLeft",
  ph: ["paddingLeft", "paddingRight"],
  pv: ["paddingTop", "paddingBottom"],
  // Margin
  m: "margin",
  mt: "marginTop",
  mb: "marginBottom",
  mr: "marginRight",
  ml: "marginLeft",
  mv: ["marginTop", "marginBottom"],
  mh: ["marginLeft", "marginRight"],
  // Text and font
  fs: "fontSize",
  fw: "fontWeight",
  lh: "lineHeight",
  ls: "letterSpacing",
  ta: "text-align",
  tc: "color",
  ts: "textStyle",
  td: "textDecoration",
  ti: "textIndent",
  tn: "textReansform",
  ws: "wordSpacing",
  family: "fontFamily",
  "text-style": "fontStyle",
  "white-space": "whiteSpace",

  // Positioning
  position: "position",
  post: "position",
  z: "zIndex",
  zi: "zIndex",
  t: "top",
  top: "top",
  b: "bottom",
  bottom: "bottom",
  r: "right",
  right: "right",
  l: "left",
  left: "left",
  // Display
  display: "display",
  // Width and Height
  w: "width",
  "w-mx": "maxWidth",
  "w-mn": "minWidth",
  h: "height",
  "h-mx": "maxHeight",
  "h-mn": "minHeight",
  // Columns
  col: "columns",
  // Background
  bg: "background",
  "bg-attach": "backgroundAttachment",
  "bg-origin": "backgroundOrigin",
  "bg-size": "backgroundSize",
  "bg-clip": "backgroundClip",
  "bg-repeat": "backgroundRepeat",
  "bg-loc": "backgroundPosition",
  "bg-loc-x": "backgroundPositionX",
  "bg-loc-y": "backgroundPositionY",
  "bg-blend": "backgroundBlendMode",
  "bg-image": "backgroundImage",
  // Flex
  fx: "flex",
  flex: "flex",
  "flex-auto": "flex",
  "initial-flex": "flex",
  "flex-parent": ["justifyContent", "alignItems"],
  fd: "flexDirection",
  "fx-wrap": "flexWrap",
  "item-order": "order",
  order: "order",
  "fx-basis": "flexBasis",
  "fx-grow": "flexGrow",
  "fx-shrink": "flexShrink",
  // Grid
  "grid-row": "gridTemplateRows",
  "grid-col": "gridTemplateColumns",
  "auto-grid-row": "gridTemplateRows",
  "auto-grid-col": "gridTemplateColumns",
  "grid-item-row": "gridRow",
  "grid-item-col": "gridColumn",
  "grid-row-end": "gridRowEnd",
  "grid-row-start": "gridRowStart",
  "grid-col-end": "gridColumnEnd",
  "grid-col-start": "gridColumnStart",
  "grid-area": "gridArea",
  "item-place": "placeItems",
  "content-place": "placeContent",
  // Gap
  gap: "gap",
  "grid-gap": "gridGap",
  "grid-row-gap": "gridRowGap",
  "grid-col-gap": "gridColumnGap",
  "row-gap": "rowGap",
  "col-gap": "columnGap",
  // Align
  ac: "alignContent",
  ai: "align-items",
  as: "alignSelf",
  // Justify
  jc: "justify-content",
  ji: "justifyItems",
  js: "justifySelf",
  // backdrop  under developement]
  "backdrop-blur": "backdropFilter",
  // Filter
  filter: "filter",
  blur: "filter",
  brightness: "filter",
  contrast: "filter",
  grayscale: "filter",
  "hue-rotate": "filter",
  saturate: "filter",
  sepia: "filter",
  opa: "opacity",
  // Backdrop Filter
  "back-blur": "backdropFilter",
  "back-brightness": "backdropFilter",
  "back-contrast": "backdropFilter",
  "back-grayscale": "backdropFilter",
  "back-saturate": "backdropFilter",
  "back-sepia": "backdropFilter",
  // Border
  br: "borderRadius",
  bw: "borderWidth",
  "bw-left": "borderLeftWidth",
  "bw-right": "borderRightWidth",
  "bw-top": "borderTopWidth",
  "bw-bottom": "borderBottomWidth",
  bs: "borderStyle",
  "radius-tl": "borderTopLeftRadius",
  "radius-tr": "borderTopRightRadius",
  "radius-bl": "borderBottomLeftRadius",
  "radius-br": "borderBottomRightRadius",
  "radius-top": ["borderTopLeftRadius", "borderTopRightRadius"],
  "radius-bottom": ["borderBottomLeftRadius", "borderBottomRightRadius"],
  "radius-left": ["borderTopLeftRadius", "borderBottomLeftRadius"],
  "radius-right": ["borderTopRightRadius", "borderBottomRightRadius"],

  // Outline
  ol: "outline",
  "ol-width": "outlineWidth",
  "ol-style": "outlineStyle",
  "ol-offset": "outlineOffset",
  // Cursor
  curs: "cursor",
  cursor: "cursor",
  // Overflow
  over: "overflow",
  overY: "overflowY",
  overX: "overflowX",
  // Float
  float: "float",
  // Aspect Ratio
  ratio: "aspectRatio",
  // Transition
  transition: "transition",
  "tr-time": "transitionDuration",
  "tr-prop": "transitionProperty",
  "tr-timing": "transitionTimingFunction",
  "tr-delay": "transitionDelay",
  // Transform: for v0.4.26 or higher.
  transform: "transform",
  "move-x": "transform",
  "move-y": "transform",
  "move-z": "transform",
  matrix: "transform",
  "matrix-3d": "transform",
  rt: "transform",
  "rt-3d": "transform",
  translate: "transform",
  scale: "transform",
  "scale-3d": "transform",
  "scale-x": "transform",
  "scale-y": "transform",
  "scale-z": "transform",
  skew: "transform",
  "skew-x": "transform",
  "skew-y": "transform",
  // More

  isolation: "isolation",
  // TenoxUI Custom property
  box: ["width", "height"],
};

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

function addType(Types: string, Property: string | string[]): void {
  // Check if 'Types' is a string
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }

  // Check if 'Property' is a string or an array
  if (!Array.isArray(Property) && typeof Property !== "string") {
    throw new Error("Property must be a string or array");
  }

  // If properties has only one css property and it was string, not wrapped inside an array
  if (typeof Property === "string") {
    // Convert the string value from property into an array
    Property = [Property];
  }

  // Add new property
  new newProp(Types, Property).tryAdd();
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
        if (property === "filter") {
          const existingFilter = this.element.style[property];
          this.element.style[property] = existingFilter
            ? `${existingFilter} ${type}(${value}${unit})`
            : `${type}(${value}${unit})`;
        }
        // Make custom property for flex
        else if (type === "flex-auto") {
          this.element.style[property] = `1 1 ${value}${unit}`;
        } else if (type === "bg-image") {
          this.element.style[property] = `url(${value})`;
        }
        // Backdrop Filter Property
        else if (property === "backdropFilter") {
          // Check if there's an existing backdrop-filter value
          const backdropContainer = this.element.style[property];
          // Handle different backdrop-filter properties
          switch (type) {
            case "back-blur":
              this.element.style[property] = `${
                backdropContainer || ""
              } blur(${value}${unit})`;
              break;
            case "back-sepia":
              this.element.style[property] = `${
                backdropContainer || ""
              } sepia(${value}${unit})`;
              break;
            case "back-saturate":
              this.element.style[property] = `${
                backdropContainer || ""
              } saturate(${value}${unit})`;
              break;
            case "back-grayscale":
              this.element.style[property] = `${
                backdropContainer || ""
              } grayscale(${value}${unit})`;
              break;
            case "back-brightness":
              this.element.style[property] = `${
                backdropContainer || ""
              } brightness(${value}${unit})`;
              break;
            case "back-invert":
              this.element.style[property] = `${
                backdropContainer || ""
              } invert(${value}${unit})`;
              break;
            case "back-contrast":
              this.element.style[property] = `${
                backdropContainer || ""
              } contrast(${value}${unit})`;
              break;
            default:
              break;
          }
        }
        // Transform Property
        else if (property === "transform") {
          // Check if there any transform property and class on the element
          const transformContainer = this.element.style[property];
          // Handle different transform properties
          switch (type) {
            case "translate":
              this.element.style[property] = `${
                transformContainer || ""
              } translate(${value}${unit})`;
              break;
            case "rt":
              this.element.style[property] = `${
                transformContainer || ""
              } rotate(${value}${unit})`;
              break;
            case "rotate":
              this.element.style[property] = `${
                transformContainer || ""
              } rotate(${value}${unit})`;
              break;
            case "move-x":
              this.element.style[property] = `${
                transformContainer || ""
              } translateX(${value}${unit})`;
              break;
            case "move-y":
              this.element.style[property] = `${
                transformContainer || ""
              } translateY(${value}${unit})`;
              break;
            case "move-z":
              this.element.style[property] = `${
                transformContainer || ""
              } translateZ(${value}${unit})`;
              break;
            case "matrix":
              this.element.style[property] = `${
                transformContainer || ""
              } matrix(${value}${unit})`;
              break;
            case "matrix-3d":
              this.element.style[property] = `${
                transformContainer || ""
              } matrix3d(${value}${unit})`;
              break;
            case "scale-3d":
              this.element.style[property] = `${
                transformContainer || ""
              } scale3d(${value}${unit})`;
              break;
            case "scale":
              this.element.style[property] = `${
                transformContainer || ""
              } scale(${value}${unit})`;
              break;
            case "scale-x":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleX(${value}${unit})`;
              break;
            case "scale-y":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleY(${value}${unit})`;
              break;
            case "scale-z":
              this.element.style[property] = `${
                transformContainer || ""
              } scaleZ(${value}${unit})`;
              break;
            case "skew-x":
              this.element.style[property] = `${
                transformContainer || ""
              } skewX(${value}${unit})`;
              break;
            case "skew-y":
              this.element.style[property] = `${
                transformContainer || ""
              } skewY(${value}${unit})`;
              break;
            case "skew-z":
              this.element.style[property] = `${
                transformContainer || ""
              } skewZ(${value}${unit})`;
              break;
            default:
              break;
          }
        }
        /*
         * CSS Variable Support 🎋
         *
         * Check className if the `value` is wrapped with `[]`,
         * if so then this is treated as css variable, css value.
         */
        // Check if the value is a CSS variable enclosed in square brackets
        else if (value.startsWith("[") && value.endsWith("]")) {
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
  applyStyles(className: string): void {
    // Using RegExp to handle the value
    const match = className.match(
      /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\]))([a-zA-Z%]*)/
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
function defineProps(propsObject: Record<string, string | string[]>): void {
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
      typeof propValues === "string" ? [propValues] : (propValues as string[]);

    // Create a new CustomProperty
    const propInstance = new newProp(propName, processedValues);
    // Add it to AllProperty at once
    propInstance.tryAdd();
  });
}

// StylesObject type
type StylesObject = Record<string, string | Record<string, string>>;

function makeStyles(stylesObject: StylesObject): StylesObject {
  // Store defined styles into an object
  const definedStyles: StylesObject = {};
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
      for (const [prop, value] of Object.entries(styles)) {
        styler.applyStyle(prop, value, "");
      }
    }
  };
  // Recursive function to handle nested styles
  const applyNestedStyles = (
    parentSelector: string,
    styles: Record<string, string>
  ): void => {
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
          applyStylesToElement(element, childStyles);
        });
      }
    });
  };
  // Handle styling logic, nested style or only default
  Object.entries(stylesObject).forEach(([selector, styles]) => {
    // If the styles is an object or nested style, use `applyNestedStyles` function to apply nested style logic
    if (typeof styles === "object" && !Array.isArray(styles)) {
      applyNestedStyles(selector, styles);
    }
    // If the styles is not overriden by nested style, apply styles using default styler
    else {
      // Stacking selector and
      const elements = document.querySelectorAll<HTMLElement>(selector);
      // Apply direct styles into element using default styler
      elements.forEach((element) => {
        // apply default styles
        applyStylesToElement(element, styles);
        /**
         * const styler = new makeTenoxUI(element);
         * styler.applyMultiStyles(styles);
         */
      });
    }
    // Store defined styles for reuse
    definedStyles[selector] = styles;
  });
  // returning defined styles
  return definedStyles;
}
// hover handler test function (update v0.7)

// applyHover function
function applyHover(
  selector: string,
  notHover: string,
  isHover: string,
  styles: string = ""
) {
  // define selector
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector);

  // iterate elements
  elements.forEach((element) => {
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
tenoxui(); // init: tenoxui
