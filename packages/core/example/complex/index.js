document.addEventListener("DOMContentLoaded", () => {
  const props = {
    bg: "background",
    text: "color",
    p: "padding",
    br: "border-radius",
    mt: "marginTop"
  };

  const classes = Object.keys(props).map(className => `[class*="${className}-"]`);

  const selectors = document.querySelectorAll(classes.join(", "));

  selectors.forEach(selector => {
    const styler = new makeTenoxUI({
      element: selector,
      property: props
    });

    selector.classList.forEach(className => {
      styler.applyStyles(className);
    });
  });
});
