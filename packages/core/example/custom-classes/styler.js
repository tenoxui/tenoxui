/*
 * Imitate css-in-js functionality xD
 */

// Transforms a nested object of CSS classes into a property-first structure (recommend for @tenoxui/core classes usage). See [https://github.com/nousantx/tenoxui-classes-converter]
function transformClasses(input) {
  const output = {};
  Object.keys(input).forEach(className => {
    Object.entries(input[className]).forEach(([property, value]) => {
      output[property] = output[property] || {};
      output[property][className] = value;
    });
  });
  console.log(output);
  return output;
}

function styler(cssProps = {}) {
  const props = {
    bg: "background",
    text: "color",
    p: "padding",
    br: "border-radius",
    mt: "marginTop"
  };

  const selectors = document.querySelectorAll("*[class]");

  selectors.forEach(selector => {
    const styler = new makeTenoxUI({
      element: selector,
      property: props,
      classes: transformClasses(cssProps)
    });
    
    selector.classList.forEach(className => {
      styler.applyStyles(className);
    });
  });
}
