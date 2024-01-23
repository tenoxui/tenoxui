/*!
 * TenoxUI CSS Framework v0.5.0 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
// All TenoxUI `type` and `property`
const property = {
    // Mapping type and its Property
    p: ["padding"],
    pt: ["paddingTop"],
    pb: ["paddingBottom"],
    pr: ["paddingRight"],
    pl: ["paddingLeft"],
    ph: ["paddingLeft", "paddingRight"],
    pv: ["paddingTop", "paddingBottom"],
    "pad-in-start": ["paddingInlineStart"],
    "pad-in-end": ["paddingInlineEnd"],
    // Margin
    m: ["margin"],
    mt: ["marginTop"],
    mb: ["marginBottom"],
    mr: ["marginRight"],
    ml: ["marginLeft"],
    mv: ["marginTop", "marginBottom"],
    mh: ["marginLeft", "marginRight"],
    "mar-in-start": ["marginInlineStart"],
    "mar-in-end": ["marginInlineEnd"],
    // Text and font
    fs: ["fontSize"],
    fw: ["fontWeight"],
    lh: ["lineHeight"],
    ls: ["letterSpacing"],
    ta: ["text-align"],
    tc: ["color"],
    ts: ["textStyle"],
    td: ["textDecoration"],
    ti: ["textIndent"],
    tn: ["textReansform"],
    ws: ["wordSpacing"],
    family: ["fontFamily"],
    "text-style": ["fontStyle"],
    "white-space": ["whiteSpace"],
    // More Text
    "text-over": ["textOverflow"],
    "text-wrap": ["textWrap"],
    "v-align": ["verticalAlign"],
    "w-break": ["wordBreak"],
    "wrap-over": ["overflowWrap"],
    hyphens: ["hyphens"],
    "text-deco-line": ["textDecorationLine"],
    "text-deco-style": ["textDecorationStyle"],
    "text-deco-thick": ["textDecorationThickness"],
    "text-underline-off": ["textUnderlineOffset"],
    "variant-num": ["font-variant-numeric:"],
    "webkit-font-smooth": ["-webkit-font-smoothing"],
    "moz-font-smooth": ["-moz-osx-font-smoothing"],
    // Positioning
    position: ["position"],
    post: ["position"],
    z: ["zIndex"],
    zi: ["zIndex"],
    t: ["top"],
    top: ["top"],
    b: ["bottom"],
    bottom: ["bottom"],
    r: ["right"],
    right: ["right"],
    l: ["left"],
    left: ["left"],
    // Display
    display: ["display"],
    // Width and Height
    w: ["width"],
    "w-mx": ["maxWidth"],
    "w-mn": ["minWidth"],
    h: ["height"],
    "h-mx": ["maxHeight"],
    "h-mn": ["minHeight"],
    // Columns
    col: ["columns"],
    // Break After
    "bk-af": ["breakAfter"],
    "bk-bef": ["breakBefore"],
    "bk-in": ["breakInside"],
    // Background
    bg: ["background"],
    "bg-attach": ["backgroundAttachment"],
    "bg-origin": ["backgroundOrigin"],
    "bg-size": ["backgroundSize"],
    "bg-clip": ["backgroundClip"],
    "bg-repeat": ["backgroundRepeat"],
    "bg-loc": ["backgroundPosition"],
    "bg-loc-x": ["backgroundPositionX"],
    "bg-loc-y": ["backgroundPositionY"],
    "bg-blend": ["backgroundBlendMode"],
    // Flex
    fx: ["flex"],
    flex: ["flex"],
    "flex-auto": ["flex"],
    "initial-flex": ["flex"],
    "flex-parent": ["justifyContent", "alignItems"],
    fd: ["flexDirection"],
    "fx-wrap": ["flexWrap"],
    "item-order": ["order"],
    order: ["order"],
    "fx-basis": ["flexBasis"],
    "fx-grow": ["flexGrow"],
    "fx-shrink": ["flexShrink"],
    // Grid
    "grid-row": ["gridTemplateRows"],
    "grid-col": ["gridTemplateColumns"],
    "auto-grid-row": ["gridTemplateRows"],
    "auto-grid-col": ["gridTemplateColumns"],
    "grid-item-row": ["gridRow"],
    "grid-item-col": ["gridColumn"],
    "grid-row-end": ["gridRowEnd"],
    "grid-row-start": ["gridRowStart"],
    "grid-col-end": ["gridColumnEnd"],
    "grid-col-start": ["gridColumnStart"],
    "grid-area": ["gridArea"],
    "item-place": ["placeArea"],
    "content-place": ["placeContent"],
    // Gap
    gap: ["gap"],
    "grid-gap": ["gridGap"],
    "grid-row-gap": ["gridRowGap"],
    "grid-col-gap": ["gridColumnGap"],
    "row-gap": ["rowGap"],
    "col-gap": ["columnGap"],
    // Align
    ac: ["alignContent"],
    ai: ["align-items"],
    as: ["alignSelf"],
    // Justify
    jc: ["justify-content"],
    ji: ["justifyItems"],
    js: ["justifySelf"],
    // backdrop [ under developement ]
    "backdrop-blur": ["backdropFilter"],
    // Filter
    filter: ["filter"],
    blur: ["filter"],
    brightness: ["filter"],
    contrast: ["filter"],
    grayscale: ["filter"],
    "hue-rotate": ["filter"],
    saturate: ["filter"],
    sepia: ["filter"],
    opa: ["opacity"],
    // Backdrop Filter
    "back-blur": ["backdropFilter"],
    "back-brightness": ["backdropFilter"],
    "back-contrast": ["backdropFilter"],
    "back-grayscale": ["backdropFilter"],
    "back-saturate": ["backdropFilter"],
    "back-sepia": ["backdropFilter"],
    // Border
    br: ["borderRadius"],
    bw: ["borderWidth"],
    "bw-left": ["borderLeftWidth"],
    "bw-right": ["borderRightWidth"],
    "bw-top": ["borderTopWidth"],
    "bw-bottom": ["borderBottomWidth"],
    bs: ["borderStyle"],
    "radius-tl": ["borderTopLeftRadius"],
    "radius-tr": ["borderTopRightRadius"],
    "radius-bl": ["borderBottomLeftRadius"],
    "radius-br": ["borderBottomRightRadius"],
    "radius-top": ["borderTopLeftRadius", "borderTopRightRadius"],
    "radius-bottom": ["borderBottomLeftRadius", "borderBottomRightRadius"],
    "radius-left": ["borderTopLeftRadius", "borderBottomLeftRadius"],
    "radius-right": ["borderTopRightRadius", "borderBottomRightRadius"],
    "br-ss": ["border-start-start-radius"],
    "br-se": ["border-start-end-radius"],
    "br-ee": ["border-end-end-radius"],
    "br-es": ["border-end-start-radius"],
    "bw-is": ["border-inline-start-width"],
    "bw-ie": ["border-inline-end-width"],
    // Outline
    ol: ["outline"],
    "ol-width": ["outlineWidth"],
    "ol-style": ["outlineStyle"],
    "ol-offset": ["outlineOffset"],
    // Cursor
    curs: ["cursor"],
    cursor: ["cursor"],
    // Overflow
    over: ["overflow"],
    overY: ["overflowY"],
    overX: ["overflowX"],
    // Float
    float: ["float"],
    // Aspect Ratio
    ratio: ["aspectRatio"],
    // Transition
    transition: ["transition"],
    "tr-time": ["transitionDuration"],
    "tr-prop": ["transitionProperty"],
    "tr-timing": ["transitionTimingFunction"],
    "tr-delay": ["transitionDelay"],
    // Transform: for v0.4.26 or higher.
    transform: ["transform"],
    "move-x": ["transform"],
    "move-y": ["transform"],
    "move-z": ["transform"],
    matrix: ["transform"],
    "matrix-3d": ["transform"],
    rt: ["transform"],
    "rt-3d": ["transform"],
    translate: ["transform"],
    scale: ["transform"],
    "scale-3d": ["transform"],
    "scale-x": ["transform"],
    "scale-y": ["transform"],
    "scale-z": ["transform"],
    skew: ["transform"],
    "skew-x": ["transform"],
    "skew-y": ["transform"],
    // List Style
    "list-s-img": ["listStyleImage"],
    "list-s-pos": ["listStylePosition"],
    "list-s-type": ["listStyleType"],
    // More
    "box-sizing": ["boxSizing"],
    isolation: ["isolation"],
    "object-fit": ["objectFit"],
    "object-post": ["objectPosition"],
    // Overscroll Behavior
    "os-beh": ["overscrollBehavior"],
    "os-beh-y": ["overscrollBehaviorY"],
    "os-beh-x": ["overscrollBehaviorX"],
    visibility: ["visibility"],
    // TenoxUI Custom property
    box: ["width", "height"],
};
// Make classes from type name from properties key name
let Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);
// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
let AllClasses = document.querySelectorAll(Classes.join(", "));
// Props maker function :)
class newProp {
    constructor(name, values) {
        // Error handling, the type must be a string, properties must be an array
        if (typeof name !== "string" || !Array.isArray(values)) {
            console.warn("Invalid arguments for newProp. Please provide a string for name and an array for values.");
            return;
        }
        this[name] = values;
        // Combine the type and property to allProperty after defined it to Classes and AllClasses
        Classes.push(`[class*="${name}-"]`);
        AllClasses = document.querySelectorAll(Classes.join(", "));
    }
    // Function to handle add `type` and `property`
    tryAdd() {
        if (!this || Object.keys(this).length === 0) {
            console.warn("Invalid newProp instance:", this);
            return;
        }
        // Added new `type` and `property` to the All Property
        Object.assign(property, this);
    }
}
function addType(Types, Property) {
    // Check if 'Types' is a string
    if (typeof Types !== "string") {
        throw new Error("Types must be a string");
    }
    // Check if 'Property' is an array
    if (!Array.isArray(Property)) {
        throw new Error("Property must be an array");
    }
    // Add new property
    new newProp(Types, Property).tryAdd();
}
// TenoxUI make style class
class makeTenoxUI {
    // TenoxUI constructor
    constructor(element) {
        this.element = element;
        this.styles = property;
    }
    // `applyStyle`: Handle the styling and custom value for property
    applyStyle(type, value, unit) {
        const properties = this.styles[type];
        // If properties matched the `type` or `property` from `allProperty`
        if (properties) {
            properties.forEach((property) => {
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
                }
                else if (type === "initial-flex") {
                    this.element.style[property] = `0 1 ${value}${unit}`;
                }
                // Grid System Property [ Not Stable... Yet :) ]
                else if (property === "gridRow" ||
                    property === "gridColumn" ||
                    property === "gridRowStart" ||
                    property === "gridColumnStart" ||
                    property === "gridRowEnd" ||
                    property === "gridColumnEnd") {
                    this.element.style[property] = `span ${value}${unit}`;
                }
                else if (type === "grid-row" || type === "grid-col") {
                    this.element.style[property] = `repeat(${value}${unit}, 1fr)`;
                }
                else if (type === "auto-grid-row" || type === "auto-grid-col") {
                    this.element.style[property] = `repeat(auto-fit, minmax(${value}${unit}, 1fr))`;
                }
                // Backdrop Filter Property
                else if (property === "backdropFilter") {
                    // Check if there's an existing backdrop-filter value
                    const backdropContainer = this.element.style[property];
                    // Handle different backdrop-filter properties
                    switch (type) {
                        case "back-blur":
                            this.element.style[property] = `${backdropContainer || ""} blur(${value}${unit})`;
                            break;
                        case "back-sepia":
                            this.element.style[property] = `${backdropContainer || ""} sepia(${value}${unit})`;
                            break;
                        case "back-saturate":
                            this.element.style[property] = `${backdropContainer || ""} saturate(${value}${unit})`;
                            break;
                        case "back-grayscale":
                            this.element.style[property] = `${backdropContainer || ""} grayscale(${value}${unit})`;
                            break;
                        case "back-brightness":
                            this.element.style[property] = `${backdropContainer || ""} brightness(${value}${unit})`;
                            break;
                        case "back-invert":
                            this.element.style[property] = `${backdropContainer || ""} invert(${value}${unit})`;
                            break;
                        case "back-contrast":
                            this.element.style[property] = `${backdropContainer || ""} contrast(${value}${unit})`;
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
                            this.element.style[property] = `${transformContainer || ""} translate(${value}${unit})`;
                            break;
                        case "rt":
                            this.element.style[property] = `${transformContainer || ""} rotate(${value}${unit})`;
                            break;
                        case "rotate":
                            this.element.style[property] = `${transformContainer || ""} rotate(${value}${unit})`;
                            break;
                        case "move-x":
                            this.element.style[property] = `${transformContainer || ""} translateX(${value}${unit})`;
                            break;
                        case "move-y":
                            this.element.style[property] = `${transformContainer || ""} translateY(${value}${unit})`;
                            break;
                        case "move-z":
                            this.element.style[property] = `${transformContainer || ""} translateZ(${value}${unit})`;
                            break;
                        case "matrix":
                            this.element.style[property] = `${transformContainer || ""} matrix(${value}${unit})`;
                            break;
                        case "matrix-3d":
                            this.element.style[property] = `${transformContainer || ""} matrix3d(${value}${unit})`;
                            break;
                        case "scale-3d":
                            this.element.style[property] = `${transformContainer || ""} scale3d(${value}${unit})`;
                            break;
                        case "scale":
                            this.element.style[property] = `${transformContainer || ""} scale(${value}${unit})`;
                            break;
                        case "scale-x":
                            this.element.style[property] = `${transformContainer || ""} scaleX(${value}${unit})`;
                            break;
                        case "scale-y":
                            this.element.style[property] = `${transformContainer || ""} scaleY(${value}${unit})`;
                            break;
                        case "scale-z":
                            this.element.style[property] = `${transformContainer || ""} scaleZ(${value}${unit})`;
                            break;
                        case "skew-x":
                            this.element.style[property] = `${transformContainer || ""} skewX(${value}${unit})`;
                            break;
                        case "skew-y":
                            this.element.style[property] = `${transformContainer || ""} skewY(${value}${unit})`;
                            break;
                        case "skew-z":
                            this.element.style[property] = `${transformContainer || ""} skewZ(${value}${unit})`;
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
    applyStyles(className) {
        // Using RegExp to handle the value
        const match = className.match(/([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:\[[^\]]+\]))([a-zA-Z%]*)/);
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
    applyMultiStyles(styles) {
        // Splitting the styles
        const styleArray = styles.split(/\s+/);
        // Applying the styles using forEach and `applyStyles`
        styleArray.forEach((style) => {
            this.applyStyles(style);
        });
    }
}
// Applied multi style into all elements with the specified element, possible to all selector
function makeStyle(selector, styles) {
    const applyStylesToElement = (element, styles) => {
        const styler = new makeTenoxUI(element);
        styler.applyMultiStyles(styles);
    };
    if (typeof styles === "string") {
        // If styles is a string, apply it to the specified selector
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => applyStylesToElement(element, styles));
    }
    else if (typeof styles === "object") {
        // If styles is an object, iterate through its key-value pairs
        Object.entries(styles).forEach(([classSelector, classStyles]) => {
            const elements = document.querySelectorAll(classSelector);
            elements.forEach((element) => applyStylesToElement(element, classStyles));
        });
    }
    // Error Handling for makeStyle
    else {
        console.warn(`Invalid styles format for "${selector}". Make sure you provide style correctly`);
    }
}
// MultiProps function: Add multiple properties from the provided object
function defineProps(propsObject) {
    // Iterate over object entries
    Object.entries(propsObject).forEach(([propName, propValues]) => {
        // Check if propValues is an array
        if (Array.isArray(propValues)) {
            // Create a new CustomProperty
            const propInstance = new newProp(propName, propValues);
            // Add it to AllProperty at once
            propInstance.tryAdd();
        }
        // Error Handling for `defineProps`
        else {
            console.warn(`Invalid property values for "${propName}". Make sure you provide values as an array.`);
        }
    });
}
// Apply multiple styles into elements using selector, all selector is possible
function makeStyles(stylesObject) {
    Object.entries(stylesObject).forEach(([selector, styles]) => {
        makeStyle(selector, styles);
    });
}
// Define mappings for color types and corresponding CSS properties
function moreColor() {
    const makeColor = (element, pattern, property, format) => {
        // Match the class name against the provided pattern
        const match = element.className.match(pattern);
        // If there is a match, apply the style to the element using the specified property and format
        if (match) {
            element.style[property] = format(match);
        }
    };
    // Select all elements with classes related to colors (background, text, border)
    const colorClass = document.querySelectorAll('[class*="bg-"], [class*="tc-"], [class*="border-"]');
    // Define mappings for color types and corresponding CSS properties
    const colorTypes = {
        bg: "background",
        tc: "color",
        border: "borderColor",
    };
    // Define different color formats and their corresponding formatting functions
    const colorFormats = {
        rgb: (match) => `rgb(${match.slice(1, 4).join(",")})`,
        rgba: (match) => `rgba(${match.slice(1, 5).join(",")})`,
        hex: (match) => `#${match[1]}`,
    };
    // Iterate through each element with color-related classes
    colorClass.forEach((element) => {
        // Iterate through each color type (bg, tc, border)
        for (const type in colorTypes) {
            // Iterate through each color format (rgb, rgba, hex)
            for (const format in colorFormats) {
                // Create a pattern for the specific color type and format
                const pattern = new RegExp(`${type}-${format}\\(([^)]+)\\)`);
                // Apply color to the element using the makeColor function
                makeColor(element, pattern, colorTypes[type], colorFormats[format]);
            }
            // Create a pattern for hex color format
            const hexPattern = new RegExp(`${type}-([0-9a-fA-F]{3,6})`);
            // Apply color to the element using the makeColor function for hex format
            makeColor(element, hexPattern, colorTypes[type], colorFormats["hex"]);
        }
    });
}
// Applying the style to all elements ✨
function tenoxui() {
    // Iterate over elements with AllClasses
    AllClasses.forEach((element) => {
        // Get the list of classes for the current element
        const classes = element.classList;
        // Make TenoxUI
        const makeTx = new makeTenoxUI(element);
        // Iterate over classes and apply styles using makeTenoxUI
        classes.forEach((className) => {
            makeTx.applyStyles(className);
        });
    });
}
moreColor();
tenoxui();
//# sourceMappingURL=tenoxui.js.map