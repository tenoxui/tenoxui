function transformClasses(input) {
  const output = {};
  Object.keys(input).forEach(className => {
    Object.entries(input[className]).forEach(([property, value]) => {
      output[property] = output[property] || {};
      output[property][className] = value;
    });
  });

  return output;
}

const tenox = transformClasses({
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    "--color": "#ccf654",
    display: "block",
    background: "var(--color)"
  },
  thing: {
    "--color": "red",
    "--primary": "blue"
  }
});

console.log(tenox);

const classes = {
  display: {
    flex: "flex",
    thing: "block",
    "i-flex": "inline-flex"
  },
  padding: {
    "p-1": "2px",
    "p-2": "4px",
    "p-3": "6px",
    "p-4": "8px"
  },
  "--color": {
    "all-primary": "red"
  }
};
