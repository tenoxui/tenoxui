/**
 * Validates a class name against a specified pattern.
 * @param {string} className - The class name to validate.
 * @returns {boolean} - True if the class name matches the pattern, false otherwise.
 */

function testClassName(className) {
  // Regular expression for handling all possible values
  const match = className.match(
    /([a-zA-Z]+(?:-[a-zA-Z]+)*)-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z]+(?:-[a-zA-Z]+)*(?:-[a-zA-Z]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\{[^\}]+\}))([a-zA-Z%]*)/
  );

  // Error handling for invalid class names
  if (!match) {
    console.error(`❌ ${className} does not match the required pattern`);
    return false;
  }

  // Extracted components from the class name
  const type = match[1]; // Property class (e.g., p-, m-, flex-, fx-, filter-, etc.)
  const value = match[2]; // Possible value (e.g., 10, red, blue, etc.)
  const unitOrValue = match[4] || "unset"; // Possible unit (e.g., px, rem, em, s, %) or value if no unit provided.

  // Log the extracted components if the class name is valid
  console.log(`✅ Type: ${type}, Value: ${value}, Unit: ${unitOrValue}`);
  return true;
}

// Example usage
testClassName("tc-#0d0d0d");

const classNames = ["filter-[blur(10px)]", "p-[--padding]", "p-10px", "m-20%"];
classNames.forEach((className) => {
  testClassName(className);
});
