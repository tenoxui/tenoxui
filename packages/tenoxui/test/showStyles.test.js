

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("*").forEach(element => {
    // console logging the inline styles
    if (element.style.cssText) {
      console.log(element, "Inline Styles:", element.style.cssText);
    }
    // console logging the styles from classes
    [...document.styleSheets].forEach(sheet => {
      try {
        [...sheet.cssRules].forEach(rule => {
          if (element.matches(rule.selectorText)) {
            console.log(element, "Class Styles:", rule.cssText);
          }
        });
      } catch (err) {
        console.warn("Cannot access stylesheet:", sheet.href);
      }
    });
  });
});
