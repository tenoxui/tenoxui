import property from "./property.test.js";

function tryCustom(name, values) {
  if (typeof name !== "string" || !Array.isArray(values)) {
    throw new Error(
      "Invalid arguments. 'name' must be a string, and 'values' must be an array."
    );
  }

  this[name] = values;
}

tryCustom.prototype.tryAdd = function () {
  if (!property || typeof property !== "object") {
    throw new Error("Invalid 'property' object.");
  }

  Object.assign(property, this);
};

try {
  const customObject = new tryCustom("tx", ["padding"]);
  customObject.tryAdd();
  console.log(property);
} catch (error) {
  console.error("Error:", error.message);
}
