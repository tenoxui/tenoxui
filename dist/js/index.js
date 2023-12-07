/**
 * TenoxUI Utility-First CSS Framework | https://tenoxui.web.app
 * copyright (c) 2023 nousantx
 * license : https://github.com/nousantx/tenoxui/blob/main/LICENSE
 */

function Styler(element) {
  this.element = element;
  this.styles = {
    // Mapping the type and the property
    p: ["padding"],
    pt: ["paddingTop"],
    pb: ["paddingBottom"],
    pr: ["paddingRight"],
    pl: ["paddingLeft"],
    m: ["margin"],
    mt: ["marginTop"],
    mb: ["marginBottom"],
    mr: ["marginRight"],
    ml: ["marginLeft"],
    fs: ["fontSize"],
    fw: ["fontWeight"],
    z: ["zIndex"],
    t: ["top"],
    b: ["bottom"],
    r: ["right"],
    l: ["left"],
    br: ["borderRadius"],
    bw: ["borderWidth"],
    "bw-left": ["borderLeftWidth"],
    "bw-right": ["borderRightWidth"],
    "bw-top": ["borderTopWidth"],
    "bw-bottom": ["borderBottomWidth"],
    w: ["width"],
    "w-mx": ["maxWidth"],
    "w-mn": ["minWidth"],
    h: ["height"],
    "h-mx": ["maxHeight"],
    "h-mn": ["minHeight"],
    fx: ["flex"],
    gap: ["gap"],
    ti: ["textIndent"],
    "backdrop-blur": ["backdropFilter"],
    ph: ["paddingLeft", "paddingRight"],
    pv: ["paddingTop", "paddingBottom"],
    mv: ["marginTop", "marginBottom"],
    mh: ["marginLeft", "marginRight"],
    "text-space": ["letterSpacing"],
    "word-space": ["wordSpacing"],
    "line-height": ["lineHeight"],
    "radius-tl": ["borderTopLeftRadius"],
    "radius-tr": ["borderTopRightRadius"],
    "radius-bl": ["borderBottomLeftRadius"],
    "radius-br": ["borderBottomRightRadius"],
    "radius-top": ["borderTopLeftRadius", "borderTopRightRadius"],
    "radius-bottom": ["borderBottomLeftRadius", "borderBottomRightRadius"],
    "radius-left": ["borderTopLeftRadius", "borderBottomLeftRadius"],
    "radius-right": ["borderTopRightRadius", "borderBottomRightRadius"],
    gs: [
      "webkitBackgroundClip",
      "color",
      "backgroundSize",
      "webkitAnimation",
      "mozAnimation",
      "oAnimation",
      "animation",
    ],
    blur: ["filter"],
    opa: ["opacity"],
  };
}

Styler.prototype.applyStyle = function (type, value, unit) {
  const properties = this.styles[type];

  if (properties) {
    properties.forEach((property) => {
      if (property === "flex") {
        this.element.style[property] = `1 1 ${value}${unit}`;
      } else {
        this.element.style[property] = `${value}${unit}`;
      }
    });
  }
};

Styler.prototype.applyStyles = function (className) {
  const match = className.match(
    /(p|pt|pb|pr|pl|m|mt|mb|mr|ml|fs|fw|z|t|b|r|l|br|bw|bw-left|bw-right|bw-top|bw-bottom|w|w-mx|w-mn|h|h-mx|h-mn|fx|gap|ti|rt|backdrop-blur|ph|pv|mv|mh|text-space|word-space|line-height|radius-tl|radius-tr|radius-bl|radius-br|radius-top|radius-bottom|radius-left|radius-right|gs|blur|opa|scale|x|y)-(-?\d+(\.\d+)?)([a-zA-Z]*)/
  );

  if (match) {
    const type = match[1];
    const value = match[2];
    const unitOrValue = match[4];

    this.applyStyle(type, value, unitOrValue);
  }
};

// All possible class
const AllClasses = document.querySelectorAll(
  '[class*="p-"], [class*="pt-"], [class*="pb-"], [class*="pr-"], [class*="pl-"], [class*="m-"], [class*="mt-"], [class*="mb-"], [class*="mr-"], [class*="ml-"], [class*="fs-"], [class*="fw-"], [class*="z-"], [class*="t-"], [class*="b-"], [class*="r-"], [class*="l-"], [class*="br-"], [class*="bw-"], [class*="w-"], [class*="w-mx-"], [class*="w-mn-"], [class*="h-"], [class*="h-mx-"], [class*="h-mn-"], [class*="fx-"], [class*="gap-"], [class*="ti-"], [class*="rt-"], [class*="backdrop-blur-"], [class*="ph-"], [class*="pv-"], [class*="mv-"], [class*="mh-"], [class*="text-space-"], [class*="word-space-"], [class*="line-height-"], [class*="radius-tl-"], [class*="radius-tr-"], [class*="radius-bl-"], [class*="radius-br-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="gs-"], [class*="blur-"], [class*="opa-"], [class*="x-"], [class*="bw-left-"], [class*="bw-right-"], [class*="bw-top-"], [class*="bw-bottom-"], [class*="scale-"]'
);

// Apply thr styles
export function TenoxUI() {
  AllClasses.forEach((element) => {
    const classes = element.classList;
    const styler = new Styler(element);
    classes.forEach((className) => {
      styler.applyStyles(className);
    });
  });
}

function TenoxColor() {
  // Make and Match new class
  const newColor = (element, pattern, property, format) => {
    const match = element.className.match(pattern);
    if (match) {
      element.style[property] = format(match);
    }
  };

  // Color CLass
  const ColorableClass = document.querySelectorAll(
    '[class*="bg-"], [class*="tc-"], [class*="border-"]'
  );
  ColorableClass.forEach((element) => {
    // For CSS variables
    newColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `var(--${match[1]})`
    );
    newColor(
      element,
      /tc-([a-zA-Z0-9-]+)/,
      "color",
      (match) => `var(--${match[1]})`
    );
    newColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `var(--${match[1]})`
    );
    // For RGB colors
    newColor(
      element,
      /bg-rgb\((\d+),(\d+),(\d+)\)/,
      "background",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    newColor(
      element,
      /tc-rgb\((\d+),(\d+),(\d+)\)/,
      "color",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    newColor(
      element,
      /border-rgb\((\d+),(\d+),(\d+)\)/,
      "borderColor",
      (match) => `rgb(${match.slice(1, 4).join(",")})`
    );
    // For RGBA colors
    newColor(
      element,
      /bg-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "background",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );
    newColor(
      element,
      /tc-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "color",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );
    newColor(
      element,
      /border-rgba\((\d+),(\d+),(\d+),([01](\.\d+)?)\)/,
      "borderColor",
      (match) => `rgba(${match.slice(1, 5).join(",")})`
    );

    // For HEX colors
    newColor(
      element,
      /bg-([0-9a-fA-F]{3,6})/,
      "background",
      (match) => `#${match[1]}`
    );
    newColor(
      element,
      /tc-([0-9a-fA-F]{3,6})/,
      "color",
      (match) => `#${match[1]}`
    );
    newColor(
      element,
      /border-([0-9a-fA-F]{3,6})/,
      "borderColor",
      (match) => `#${match[1]}`
    );
    // All Posible Color In Css
    newColor(
      element,
      /bg-([a-zA-Z0-9-]+)/,
      "background",
      (match) => `${match[1]}`
    );
    newColor(element, /tc-([a-zA-Z0-9-]+)/, "color", (match) => `${match[1]}`);
    newColor(
      element,
      /border-([a-zA-Z0-9-]+)/,
      "borderColor",
      (match) => `${match[1]}`
    );
  });
}

TenoxColor();
TenoxUI();
