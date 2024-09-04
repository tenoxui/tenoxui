// Get first word, is the value have '[' and ']'
function getFirstWord(value) {
  const match = value.match(/^\[([^\]]+)\]/);
  return match ? match[1] : null;
}

// CSS Variable Test

// Error message
const errMsg = "Value does not start with '[' or end with ']'";

// Correct word
const value = "[--padding]";

// Incorrect word
// const value = "--primary]";

// Using getFirstWord func
const firstWord = getFirstWord(value);
// output: --padding

// Using slice
const sliceWord = value.slice(1, -1);
// output: --padding

// Remove bracket and just retreive the name of the value
const computedVaruable = `var(${sliceWord})`;

// Simple conditioning to catch the value
if (firstWord !== null) {
  console.log("First word:", firstWord);
  console.log("Variable Value:", computedVaruable);
} else {
  // If the value doesn't wrapped with square bracket, error
  console.error(errMsg);
}

if (value.startsWith("[") && value.endsWith("]")) {
  //   const select = `var(${value.slice(1, -1)})`;
  console.log(`var(${value.slice(1, -1)})`);
} else {
  console.error(errMsg);
}
