import { fullProps } from "../@tenoxui-property/src/esm/full.js";

export default {
  input: ["index.html", "src/**/*.{html,js,jsx,ts,tsx,vue,svelte,astro}"],
  output: "styles.css",
  property: fullProps,
  classes: {
    display: {
      center: "flex",
    },
    alignItems: {
      center: "center",
    },
    justifyContent: {
      center: "center",
    },
  },
  breakpoints: [
    { name: "sm", max: 640 },
    { name: "md", min: 641, max: 768 },
    { name: "lg", min: 769 },
  ],
};

// CommonJS example:
// module.exports = {
//   // ... same configuration as above
// };
