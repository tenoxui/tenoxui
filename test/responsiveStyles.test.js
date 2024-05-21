let allProps, breakpoints, classes, allClasses;
// breakpoint example
breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024
};
class makeTenoxUI {
  constructor(element, styledProps) {
    this.responsiveStyles = {
      sm: [],
      md: [],
      lg: []
    };
    this.element = element;
    this.styles = styledProps || {};
  }
  applyStyle(type, value, unit) {
    let properties = this.styles[type];
    if (properties) {
      if (!Array.isArray(properties)) {
        properties = [properties];
      }
      properties.forEach(property => {
        // ... just use the necessary
        if (value.startsWith("$")) {
          const cssValue = value.slice(1);
          this.element.style[property] = `var(--${cssValue})`;
        } else if (value.startsWith("[") && value.endsWith("]")) {
          const values = value.slice(1, -1).replace(/\\_/g, " ");
          if (values.startsWith("--")) {
            this.element.style[property] = `var(${values})`;
          } else {
            this.element.style[property] = values;
          }
        } else {
          this.element.style[property] = `${value}${unit}`;
        }
      });
    }
  }
  applyStyles(className) {
    const match = className.match(
      /(?:([a-z]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\{[^\}]+\})|(?:\$[^\s]+))([a-zA-Z%]*)/
    );
    if (match) {
      // breakpoint prefix match
      const breakpoint = match[1];
      // ... other match same
      const type = match[2];
      const value = match[3];
      const unitOrValue = match[5];
      if (breakpoint && breakpoints[breakpoint]) {
        this.storeResponsiveStyle(breakpoint, type, value, unitOrValue);
      } else {
        // Apply default styles
        this.applyStyle(type, value, unitOrValue);
      }
    }
  }
  storeResponsiveStyle(breakpoint, type, value, unit) {
    this.responsiveStyles[breakpoint].push({ type, value, unit });
  }
  applyResponsiveStyles() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= breakpoints.lg) {
      this.applyStoredStyles(this.responsiveStyles.lg);
    } else if (viewportWidth >= breakpoints.md) {
      this.applyStoredStyles(this.responsiveStyles.md);
    } else {
      this.applyStoredStyles(this.responsiveStyles.sm);
    }
  }
  applyStoredStyles(styles) {
    styles.forEach(({ type, value, unit }) => {
      this.applyStyle(type, value, unit);
    });
  }
}
function tenoxui(...customPropsArray) {
  let styles = Object.assign({}, allProps, ...customPropsArray);
  allProps = styles;
  classes = Object.keys(allProps).map(className => `[class*="${className}-"]`);
  allClasses = document.querySelectorAll(classes.join(", "));
  allClasses.forEach(element => {
    const htmlELement = element;
    const classes = htmlELement.classList;
    const styler = new makeTenoxUI(htmlELement, allProps);
    classes.forEach(className => {
      styler.applyStyles(className);
    });
  });
}
//# sourceMappingURL=tenoxui.js.map
