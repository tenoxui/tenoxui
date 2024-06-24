// your css property and the triggers
const props = {
  bg: "background",
  text: "color",
  p: "padding",
  br: "border-radius",
  mt: "marginTop"
};

// generate a selector from `props` key's name
const classes = Object.keys(props).map(className => `[class*="${className}-"]`);

// get all possible className from classes
const selectors = document.querySelectorAll(classes.join(", "));

// iterate over selectors
selectors.forEach(selector => {
  // styler helper
  const styler = new makeTenoxUI(selector, props);

  // get every single className from the selector
  selector.classList.forEach(className => {
    // apply the every single className with `applyStyles` method
    styler.applyStyles(className);

    // if you unsure what className is
    // console.log(className);
  });
});
