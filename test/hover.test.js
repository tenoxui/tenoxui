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
