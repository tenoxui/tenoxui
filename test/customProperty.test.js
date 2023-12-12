import AllProperty from "./property.test.js";

let Classes = Object.keys(AllProperty).map(
  (className) => `[class*="${className}-"]`
);

// Merge all `Classes` into one selector. Example : '[class*="p-"]', '[class*="m-"]', '[class*="justify-"]'
let AllClasses = document.querySelectorAll(Classes.join(", "));

function newProp(name, values) {
  if (typeof name !== "string" || !Array.isArray(values)) {
    console.warn(
      "Invalid arguments for newProp. Please provide a string for name and an array for values."
    );
    return;
  } else {
    console.log("added new type and property to AllProperty");
  }

  this[name] = values;
  Classes.push(`[class*="${name}-"]`);
  AllClasses = document.querySelectorAll(Classes.join(", "));
}

newProp.prototype.tryAdd = function () {
  if (!this || Object.keys(this).length === 0) {
    console.warn("Invalid newProp instance:", this);
    return;
  }
  Object.assign(AllProperty, this);
};

function MakeProp(Types, Property) {
  // Check if 'Types' is a string
  if (typeof Types !== "string") {
    throw new Error("Types must be a string");
  }

  // Check if 'Property' is an array
  if (!Array.isArray(Property)) {
    throw new Error("Property must be an array");
  }

  new newProp(Types, Property).tryAdd();
}

// name = string
// values = array of string

// Valid
new newProp("tx", ["padding"]).tryAdd();
// Error
new newProp(60, "margin").tryAdd();

// New Classes
console.log(Classes);
// output : [...'[class*="tx-"]']

// New Property
console.log(AllProperty);
// output : {..., tx: Array(1)}
