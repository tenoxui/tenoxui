// tenoxui.config.js
export default {
  property: {
    bg: "background-color",
    text: "color",
    gradient: {
      property: "backgroundImage",
      value: "linear-gradient(to right, purple, {value})"
    },
    p: "padding",
    br: "borderRadius",
    "border-color": "--bdr-clr", // css output example : .border-color-{value} { --bdr-clr: {value}; }
    size: ["width", "height"], // css output example : .box-{value} { width: {value}; height: {value} }
    flex: {
      property: ["justifyContent", "alignItems"],
      value: "{value}"
    }
  },
  values: {
    primary: "#ccf654",
    rex: "#0000ff"
  },
  classes: {
    display: {
      "se-flex": "flex",
      "b-tenox": "block"
    },
    alignItems: {
      "se-flex": "center"
    }
  },
  input: [
    "./src/**/*.html",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
    "./src/**/*.mdx",
  ],
  output: "dist/styles.css"
};
