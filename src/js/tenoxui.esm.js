/*!
 * TenoxUI CSS Framework v0.7.0 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
// Importing All property that will be used on TenoxUI
import property from "./lib/property.js";
let Classes, AllClasses;
// Check browser environment
if (typeof window !== "undefined") {
    // Generate className from property key name, or property type
    Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);
    // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
    AllClasses = document.querySelectorAll(Classes.join(", "));
}
// Props maker function :)
function newProp(name, values) {
    // Error handling, the type must be a string, properties must be an array
    if (typeof name !== "string" || !Array.isArray(values)) {
        console.warn("Invalid arguments for newProp. Please provide a string for keys and array for values.");
        return;
    }
    this[name] = values;
    if (typeof window !== "undefined") {
        // Combine the type and property to allProperty after defined it to Classes and AllClasses
        Classes.push(`[class*="${name}-"]`);
        AllClasses = document.querySelectorAll(Classes.join(", "));
    }
}
// Function to handle add `type` and `property`
newProp.prototype.tryAdd = function () {
    if (!this || Object.keys(this).length === 0) {
        console.warn("Invalid newProp instance:", this);
        return;
    }
    // Added new `type` and `property` to the All Property
    Object.assign(property, this);
};
// Add new `type` and `property`
function addType(Types, Property) {
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
// makeTenoxUI class
class makeTenoxUI {
    // TenoxUI constructor
    constructor(element) {
        this.element = element;
        this.styles = property;
    }
    // `applyStyle`: Handle the styling and custom value for property
    applyStyle(type, value, unit) {
        // the styles with let, not constant, because the properties no longer using array, optionally it can just be string
        let properties = this.styles[type];
        // If properties matched the `type` or `property` from `allProperty`
        if (properties) {
            // If properties has only one css property and it was string, not wrapped inside an array
            if (!Array.isArray(properties)) {
                // Convert the string value from property into an array
                properties = [properties];
            }
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
                else if (type === "bg-image") {
                    this.element.style[property] = `url(${value})`;
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
        // Fix 0.6
        // const match = className.match(
        //   /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\]))([a-zA-Z%]*)/
        // );
        const match = className.match(/([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\.[^\s.]+[.][a-zA-Z]+))([a-zA-Z%]*)/
        // /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\.[^\s.]+))([a-zA-Z%]*)/
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
    applyMultiStyles(styles) {
        // Splitting the styles
        const styleArray = styles.split(/\s+/);
        // Applying the styles using forEach and `applyStyles`
        styleArray.forEach((style) => {
            this.applyStyles(style);
        });
    }
}
// Applied multi style into all elements with the specified element (not just className)
function makeStyle(selector, styles) {
    const applyStylesToElement = (element, styles) => {
        // make new styler
        const styler = new makeTenoxUI(element);
        styler.applyMultiStyles(styles);
    };
    // Make sure to run only on browser environment
    if (typeof window !== "undefined") {
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
        // Error Handling for make Style
        else {
            console.warn(`Invalid styles format for "${selector}". Make sure you provide style correctly`);
        }
    }
}
// MultiProps function: Add multiple properties from the provided object
function defineProps(propsObject) {
    // Iterate over object entries
    Object.entries(propsObject).forEach(([propName, propValues]) => {
        // Check if propValues is an array or string
        if (typeof propValues !== "string" && !Array.isArray(propValues)) {
            console.warn(`Invalid property values for "${propName}". Make sure you provide values as an array.`);
        }
        // if the propValues is a string, convert into array
        const processedValues = typeof propValues === "string" ? [propValues] : propValues;
        // Create a new CustomProperty
        const propInstance = new newProp(propName, processedValues);
        // Add it to AllProperty at once
        propInstance.tryAdd();
    });
}
function makeStyles(stylesObject) {
    // Store defined styles into an object
    const definedStyles = {};
    // Helper function to apply styles into elements
    const applyStylesToElement = (element, styles) => {
        // Define new styler
        const styler = new makeTenoxUI(element);
        // If the styles is a string, like: "p-20px m-1rem fs-2rem" / Stacked classes
        if (typeof styles === "string") {
            // Handled using `applyMultiStyles`
            styler.applyMultiStyles(styles);
        }
        else {
            // Handle nested styles / if the value is new object
            for (const [prop, value] of Object.entries(styles)) {
                styler.applyStyle(prop, value, "");
            }
        }
    };
    // Recursive function to handle nested styles
    const applyNestedStyles = (parentSelector, styles) => {
        // Handle nested style
        Object.entries(styles).forEach(([childSelector, childStyles]) => {
            const elements = document.querySelectorAll(`${parentSelector} ${childSelector}`);
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
            const elements = document.querySelectorAll(selector);
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
// function applyHover(
//   selector: string,
//   beforeHover: string,
//   isHover: string,
//   styles: string = ""
// ) {
//   const elements = document.querySelectorAll(selector);
//   elements.forEach((element: HTMLElement) => {
//     const styler = new makeTenoxUI(element);
//     styler.applyMultiStyles(`${beforeHover} ${styler}`);
//     element.addEventListener("mouseenter", () => {
//       styler.applyMultiStyles(isHover);
//     });
//     element.addEventListener("mouseleave", () => {
//       styler.applyMultiStyles(beforeHover);
//     });
//   });
// }
// hover handler test function (update v0.7)
// applyHover function
function applyHover(selector, notHover, isHover, styles = "") {
    // define selector
    const elements = document.querySelectorAll(selector);
    // iterate elements
    elements.forEach((element) => {
        // makeTenoxUI instance
        const styler = new makeTenoxUI(element);
        // applying default styles
        styler.applyMultiStyles(`${notHover} ${styles}`);
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
function applyHovers(hovers) {
    Object.entries(hovers).forEach(([selector, [notHover, isHover, styles = ""]]) => {
        // selector
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            // makeTenoxUI instance
            const styler = new makeTenoxUI(element);
            // applying default styles
            styler.applyMultiStyles(`${notHover} ${styles}`);
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
    });
}
// Applying the style to all elements ✨
function tenoxui() {
    // Make classes from type name from properties key name
    Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);
    // Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
    AllClasses = document.querySelectorAll(Classes.join(", "));
    // Iterate over elements with AllClasses
    AllClasses.forEach((element) => {
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
export { Classes, AllClasses, addType, defineProps, makeStyle, makeStyles, applyHover, applyHovers, makeTenoxUI, };
export default tenoxui;
//# sourceMappingURL=tenoxui.esm.js.map