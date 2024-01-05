/*!
 * TenoxUI CSS Framework v0.4.23 [ https://tenoxui.web.app ]
 * copyright (c) 2024 nousantx
 * licensed under MIT [ https://github.com/nousantx/tenoxui/blob/main/LICENSE ]
 */
// Function to apply color styles to an element based on the provided pattern, property, and format
function TenoxColorFunc() {
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
TenoxColorFunc();
//# sourceMappingURL=color.js.map