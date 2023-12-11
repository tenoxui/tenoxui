import property from "../../src/js/property.js";

function makeTenoxUI(element) {
  this.element = element;
  this.styles = property;
}

// Attempt I

makeTenoxUI.prototype.applyStylesFromString = function (styleString) {
  const styles = styleString.split(" ");
  styles.forEach((style) => this.applyStyles(style));
};

export function applyMultipleStyles(element, styleString) {
  const styleClasses = styleString.split(" ");

  styleClasses.forEach((styleClass) => {
    const styler = new makeTenoxUI(element);
    styler.applyStyles(styleClass);
  });
}

// Attemp II

makeTenoxUI.prototype.giveMultiStyle = function (styles) {
  const styleArray = styles.split(/\s+/);

  styleArray.forEach((style) => {
    this.applyStyles(style);
  });
};

// MakeStyles: Attempt I

// Applied multi style into one element.
export function MakeStyles(elem, styles) {
  // Select the class element
  const classNeedStyle = document.querySelector(elem);
  // Make new styler
  const styler = new makeTenoxUI(classNeedStyle);
  // And give style into the element using `applyStyles`
  styler.giveMultiStyle(styles);
}

MakeStyles(".wrapper", "p-1rem bg-red m-3rem");

/*
 Error: If theres two or more element with the same
 name as wrapper, the style wont applied to the second element. 
 */

// MakeStyles: Attempt II

export function MakeStyles(className, styles) {
  // Select all elements with the specified class
  const elements = document.querySelectorAll(className);

  // Iterate through each element and apply styles
  elements.forEach((element) => {
    // Make new styler for each element
    const styler = new makeTenoxUI(element);
    // Apply styles using `giveMultiStyle`
    styler.giveMultiStyle(styles);
  });
}

MakeStyles(".wrapper", "p-1rem bg-red m-3rem");

/* 
  Rather than using `querySelector`, we use `querySelectorAll` and-
  forEach to apply the styles to all element with that name. So, all-
  element with that selected using the selector will have the same class.
*/

// Haha, and its work !
