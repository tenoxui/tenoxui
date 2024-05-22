/**
 * Validates a class name against a specified pattern.
 * @param {string} className - The class name to validate.
 * @returns {boolean} - True if the class name matches the pattern, false otherwise.
 */

function testClassName(className) {
  // Regular expression for handling all possible values
  const match = className.match(
    /(?:([a-z-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\{[^\}]+\})|(?:\$[^\s]+))([a-zA-Z%]*)/
  );

  // Error handling for invalid class names
  if (!match) {
    console.error(`❌ ${className} does not match the required pattern`);
    return false;
  }
  // Extracted components from the class name
  const breakpoint = match[1]; // match breakpoints
  const type = match[2]; // Property class (e.g., p-, m-, flex-, fx-, filter-, etc.)
  const value = match[3]; // Possible value (e.g., 10, red, blue, etc.)
  const unitOrValue = match[5] || "unset"; // Possible unit (e.g., px, rem, em, s, %) or value if no unit provided.

  const vb = breakpoint
    ? `✅ Breakpoint: "${breakpoint}", Type: "${type}", Value: "${value}", Unit: "${unitOrValue}"`
    : `✅ Type: "${type}", Value: "${value}", Unit: "${unitOrValue}"`;

  // logginh the values
  console.log(vb);

  // Log the extracted components if the class name is valid
  return true;
}

// Example usage
testClassName("tc-#0d0d0d");

const classNames = [
  "filter-[blur(10px)]",
  "p-[--padding]",
  "p-10px",
  "m-20%",
  "sm:bg-blue",
  "[--tenox]-blue",
  "[--bg-opa]-1",
  "hover:bg-blue",
];
classNames.forEach(className => {
  testClassName(className);
});
