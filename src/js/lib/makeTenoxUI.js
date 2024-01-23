function MakeTenoxUI(element) {
    this.element = element;
    this.styles = property;
}
MakeTenoxUI.prototype.applyStyle = function (type, value, unit) {
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
                // Handle All Value
                switch (type) {
                    case "translate":
                        this.element.style[property] = `${transformContainer || ""} translate(${value}${unit})`;
                        break;
                    case "rt":
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
};
MakeTenoxUI.prototype.applyStyles = function (className) {
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
};
MakeTenoxUI.prototype.applyMultiStyles = function (styles) {
    const styleArray = styles.split(/\s+/);
    styleArray.forEach((style) => {
        this.applyStyles(style);
    });
};
//# sourceMappingURL=makeTenoxUI.js.map