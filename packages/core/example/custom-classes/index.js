/*
 * Imitate css-in-js functionality xD
 */

document.addEventListener("DOMContentLoaded", () => {
  styler({
    center: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    "my-color": {
      "--my-color": "#ccf654",
      color: "var(--my-color)"
    }
  });
});
