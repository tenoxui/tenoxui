function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

export function createRGBColors(colors, prefix, selectedColors) {
  const shadeMapping = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const colorObject = {};
  const colorsToProcess = selectedColors && selectedColors.length > 0 ? selectedColors : Object.keys(colors);
  colorsToProcess.forEach(color => {
    const shades = colors[color].length === 11 ? shadeMapping : shadeMapping.slice(1, 10);
    shades.forEach((shade, index) => {
      const hex = colors[color][index];
      colorObject[`${prefix}-${color}-${shade}`] = hexToRgb(hex);
    });
  });
  return colorObject;
}

export function createColors(colors, prefix, selectedColors) {
  const shadeMapping = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const colorObject = {};
  const colorsToProcess = selectedColors && selectedColors.length > 0 ? selectedColors : Object.keys(colors);
  colorsToProcess.forEach(color => {
    const shades = colors[color].length === 11 ? shadeMapping : shadeMapping.slice(1, 10);
    shades.forEach((shade, index) => {
      const hex = colors[color][index];
      const rgb = hexToRgb(hex);
      colorObject[`${prefix}-${color}-${shade}`] = `rgb(${rgb} / var(--${prefix}-opa, 1))`;
    });
  });
  return colorObject;
}
