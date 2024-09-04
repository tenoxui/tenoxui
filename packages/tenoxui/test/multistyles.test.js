export function MultiStyles(stylesObject) {
  Object.entries(stylesObject).forEach(([selector, styles]) => {
    MakeStyles(selector, styles);
  });
}
