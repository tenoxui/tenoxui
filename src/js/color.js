/*!
 * copyright (c) 2023 NOuSantx
 */
function TenoxColor() {
  const setColor = (element, pattern, property, format) => {
    const match = element.className.match(pattern);
    if (match) {
      element.style[property] = format(match);
    }
  };
  // Class
  const ColorableClass = document.querySelectorAll(
    '[class*="bg-"], [class*="tc-"], [class*="border-"]',
  );
  ColorableClass.forEach((element) => {
    // For CSS variables
    setColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `var(--${match[1]})`,
    );
    setColor(
      element,
      /tc-([a-zA-Z0-9-]+)/,
      "color",
      (match) => `var(--${match[1]})`,
    );
    setColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `var(--${match[1]})`,
    );
    // For RGB colors
    setColor(
      element,
      /bg-rgb\((\d+),(\d+),(\d+)\)/,
      "background",
      (match) => `rgb(${match.slice(1, 4).join(",")})`,
    );
    setColor(
      element,
      /tc-rgb\((\d+),(\d+),(\d+)\)/,
      "color",
      (match) => `rgb(${match.slice(1, 4).join(",")})`,
    );
    setColor(
      element,
      /border-rgb\((\d+),(\d+),(\d+)\)/,
      "borderColor",
      (match) => `rgb(${match.slice(1, 4).join(",")})`,
    );
    // For RGBA colors
    setColor(
      element,
      /bg-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "background",
      (match) => `rgba(${match.slice(1, 5).join(",")})`,
    );
    setColor(
      element,
      /tc-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "color",
      (match) => `rgba(${match.slice(1, 5).join(",")})`,
    );
    setColor(
      element,
      /border-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "borderColor",
      (match) => `rgba(${match.slice(1, 5).join(",")})`,
    );

    // For HEX colors
    setColor(
      element,
      /bg-([0-9a-fA-F]{3,6})/,
      "background",
      (match) => `#${match[1]}`,
    );
    setColor(
      element,
      /tc-([0-9a-fA-F]{3,6})/,
      "color",
      (match) => `#${match[1]}`,
    );
    setColor(
      element,
      /border-([0-9a-fA-F]{3,6})/,
      "borderColor",
      (match) => `#${match[1]}`,
    );
    // All Posible Color In Css
    setColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `${match[1]}`,
    );
    setColor(element, /tc-([a-zA-Z0-9-]+)/, "color", (match) => `${match[1]}`);
    setColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `${match[1]}`,
    );
  });
}
TenoxColor();
