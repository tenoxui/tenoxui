// applyStyles

const isHover = className.startsWith("hover:");

// Apply styles only on hover if the class has a hover prefix
if (isHover) {
  this.element.addEventListener("mouseenter", () => {
    // Apply hover styles
    this.applyStyle(type, value, unitOrValue);
  });

  this.element.addEventListener("mouseleave", () => {
    // Reset styles on mouse leave
    this.applyStyle(type, "", ""); // Reset to an empty string to remove the style
  });
} else {
  // Apply styles normally if there's no hover prefix
  this.applyStyle(type, value, unitOrValue);
}

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
      // apply
      styler.applyMultiStyles(isHover);
    });

    // default style / when element not hovered
    element.addEventListener("mouseleave", () => {
      // apply default style
      styler.applyMultiStyles(notHover);
    });
  });
}

// applyHover usage
applyHover(".card", "bg-red", "bg-blue");
// card class will have background red as default, and background blue when hovered

// applyHovers function
function applyHovers(hovers) {
  Object.entries(hovers).forEach(([selector, notHover, isHover, styles]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const styler = new makeTenoxUI(element);

      styler.applyMultiStyles(`${before} ${styles}`);

      element.addEventListener("mouseenter", () => {
        styler.applyMultiStyles(after);
      });

      element.addEventListener("mouseleave", () => {
        styler.applyMultiStyles(before);
      });
    });
  });
}

// applyHovers usage
applyHovers({
  // selector: [notHoverStyle, whenHoverStyle, otherStyle]
  ".card": ["bg-red", "bg-blue"],
});
