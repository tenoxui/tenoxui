/*!
 * TenoxUI CSS Framework v0.4.23 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
import property from "./lib/property.js";
export let Classes = Object.keys(property).map((className) => `[class*="${className}-"]`);
// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
export let AllClasses = document.querySelectorAll(Classes.join(", "));
class newProp {
    constructor(name, values) {
        if (typeof name !== "string" || !Array.isArray(values)) {
            console.warn("Invalid arguments for newProp. Please provide a string for name and an array for values.");
            return;
        }
        this[name] = values;
        Classes.push(`[class*="${name}-"]`);
        AllClasses = document.querySelectorAll(Classes.join(", "));
    }
    tryAdd() {
        if (!this || Object.keys(this).length === 0) {
            console.warn("Invalid newProp instance:", this);
            return;
        }
        Object.assign(property, this);
    }
}
export function addType(Types, Property) {
    // Check if 'Types' is a string
    if (typeof Types !== "string") {
        throw new Error("Types must be a string");
    }
    // Check if 'Property' is an array
    if (!Array.isArray(Property)) {
        throw new Error("Property must be an array");
    }
    new newProp(Types, Property).tryAdd();
}
class makeTenoxUI {
    constructor(element) {
        this.element = element;
        this.styles = property;
    }
    applyStyle(type, value, unit) {
        const properties = this.styles[type];
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
                else if (property === "flex") {
                    this.element.style[property] = `1 1 ${value}${unit}`;
                }
                // Grid System Property
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
                // CSS Variables support
                else if (value.startsWith("[") && value.endsWith("]")) {
                    // Check if the value is a CSS variable enclosed in square brackets
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
    applyStyles(className) {
        // Match all type and
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
    // MultyStyles function: Give multi style or class into one selector.
    applyMultiStyles(styles) {
        // Splitting the styles
        const styleArray = styles.split(/\s+/);
        // Applying the styles using forEach and `applyStyles`
        styleArray.forEach((style) => {
            this.applyStyles(style);
        });
    }
}
// Applied multi style into all elements with the specified class.
export function makeStyle(selector, styles) {
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
    else {
        console.warn(`Invalid styles format for "${selector}". Make sure you provide style correctly`);
    }
}
// MultiProps function: Add multiple properties from the provided object
export function defineProps(propsObject) {
    // Iterate over object entries
    Object.entries(propsObject).forEach(([propName, propValues]) => {
        // Check if propValues is an array
        if (Array.isArray(propValues)) {
            // Create a new CustomProperty
            const propInstance = new newProp(propName, propValues);
            // Add it to AllProperty
            propInstance.tryAdd();
        }
        else {
            console.warn(`Invalid property values for "${propName}". Make sure you provide values as an array.`);
        }
    });
}
// Apply styles for multiple elements using the provided object
export function makeStyles(stylesObject) {
    Object.entries(stylesObject).forEach(([selector, styles]) => {
        makeStyle(selector, styles);
    });
}
export function moreColor() {
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
// Define the TenoxUI function to apply the styles
export default function tenoxui() {
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
//# sourceMappingURL=tenoxui.esm.js.map