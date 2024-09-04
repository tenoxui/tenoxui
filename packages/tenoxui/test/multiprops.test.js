export function MultiProps(propsObject) {
  // Iterate over object entries
  Object.entries(propsObject).forEach(([propName, propValues]) => {
    // Check if propValues is an array
    if (Array.isArray(propValues)) {
      // Create a new CustomProperty
      const propInstance = new newProp(propName, propValues);
      // Add it to AllProperty
      propInstance.tryAdd();
    } else {
      console.warn(
        `Invalid property values for "${propName}". Make sure you provide values as an array.`
      );
    }
  });
}
