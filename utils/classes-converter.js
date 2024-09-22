/**
 * Transforms a nested object of CSS classes into a property-first structure (https://github.com/nousantx/tenoxui-classes-converter).
 *
 * @param {Object} input - An object where keys are class names and values are objects of CSS properties.
 * @returns {Object} An object where keys are CSS properties and values are objects mapping class names to property values.
 */
export function transformClasses(input) {
  const output = {};

  // Iterate over each class in the input object
  Object.keys(input).forEach((className) => {
    // Iterate over each property-value pair in the class
    Object.entries(input[className]).forEach(([property, value]) => {
      // If the property doesn't exist in the output, initialize it as an empty object
      output[property] = output[property] || {};

      // Add the class name and its value to the property in the output
      output[property][className] = value;
    });
  });

  return output;
}
