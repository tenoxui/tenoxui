export function MakeStyles(selector, styles) {
  const applyStylesToElement = (element, styles) => {
    const styler = new makeTenoxUI(element);
    styler.applyMultiStyles(styles);
  };

  if (typeof styles === "string") {
    // If styles is a string, apply it to the specified selector
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      console.warn(`No elements found with selector: ${selector}`);
      return;
    }
    elements.forEach((element) => applyStylesToElement(element, styles));
  } else if (typeof styles === "object") {
    // If styles is an object, iterate through its key-value pairs
    Object.entries(styles).forEach(([classSelector, classStyles]) => {
      const elements = document.querySelectorAll(classSelector);
      if (elements.length === 0) {
        console.warn(`No elements found with selector: ${classSelector}`);
        return;
      }
      elements.forEach((element) => applyStylesToElement(element, classStyles));
    });
  } else {
    console.warn(
      `Invalid styles format for "${selector}". Make sure you provide style correctly`
    );
  }
}
