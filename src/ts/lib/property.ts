/*!
 * tenoxui/css v0.8.0 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */

interface PropertyMap {
  [key: string]: string | string[];
}

const property: PropertyMap = {
  // Mapping type and its Property
  p: "padding",
  pt: "paddingTop",
  pb: "paddingBottom",
  pr: "paddingRight",
  pl: "paddingLeft",
  ph: ["paddingLeft", "paddingRight"],
  pv: ["paddingTop", "paddingBottom"],
  // Margin
  m: "margin",
  mt: "marginTop",
  mb: "marginBottom",
  mr: "marginRight",
  ml: "marginLeft",
  mv: ["marginTop", "marginBottom"],
  mh: ["marginLeft", "marginRight"],
  // Text and font
  fs: "fontSize",
  fw: "fontWeight",
  lh: "lineHeight",
  ls: "letterSpacing",
  ta: "textAlign",
  tc: "color",
  ts: "textStyle",
  td: "textDecoration",
  ti: "textIndent",
  tn: "textReansform",
  ws: "wordSpacing",
  family: "fontFamily",
  "text-s": "fontStyle",
  "white-space": "whiteSpace",
  // Positioning
  position: "position",
  z: "zIndex",
  t: "top",
  b: "bottom",
  r: "right",
  l: "left",
  // Display
  d: "display",
  display: "display",
  // Width and Height
  w: "width",
  "w-mx": "maxWidth",
  "w-mn": "minWidth",
  h: "height",
  "h-mx": "maxHeight",
  "h-mn": "minHeight",
  // Background
  bg: "background",
  "bg-attach": "backgroundAttachment",
  "bg-origin": "backgroundOrigin",
  "bg-size": "backgroundSize",
  "bg-clip": "backgroundClip",
  "bg-repeat": "backgroundRepeat",
  "bg-loc": "backgroundPosition",
  "bg-loc-x": "backgroundPositionX",
  "bg-loc-y": "backgroundPositionY",
  "bg-blend": "backgroundBlendMode",
  "bg-image": "backgroundImage",
  // Flex
  fx: "flex",
  flex: "flex",
  "flex-auto": "flex",
  fd: "flexDirection",
  "fx-wrap": "flexWrap",
  "item-order": "order",
  order: "order",
  "fx-basis": "flexBasis",
  "fx-grow": "flexGrow",
  "fx-shrink": "flexShrink",
  // Gap
  gap: "gap",
  "row-gap": "rowGap",
  "col-gap": "columnGap",
  // Align
  ac: "alignContent",
  ai: "align-items",
  as: "alignSelf",
  // Justify
  jc: "justifyContent",
  ji: "justifyItems",
  js: "justifySelf",
  // Filter
  filter: "filter",
  blur: "ftr",
  brightness: "ftr",
  contrast: "ftr",
  grayscale: "ftr",
  "hue-rotate": "ftr",
  saturate: "ftr",
  sepia: "ftr",
  opa: "opacity",
  // Backdrop Filter
  backdrop: "backdropFilter",
  //? bFt: a shorthand of backdropFilter
  "back-blur": "bFt",
  "back-brightness": "bFt",
  "back-contrast": "bFt",
  "back-grayscale": "bFt",
  "back-saturate": "bFt",
  "back-sepia": "bFt",
  // Border
  br: "borderRadius",
  bw: "borderWidth",
  "bw-left": "borderLeftWidth",
  "bw-right": "borderRightWidth",
  "bw-top": "borderTopWidth",
  "bw-bottom": "borderBottomWidth",
  bs: "borderStyle",
  "radius-top": ["borderTopLeftRadius", "borderTopRightRadius"],
  "radius-bottom": ["borderBottomLeftRadius", "borderBottomRightRadius"],
  "radius-left": ["borderTopLeftRadius", "borderBottomLeftRadius"],
  "radius-right": ["borderTopRightRadius", "borderBottomRightRadius"],
  // Cursor
  cursor: "cursor",
  // Overflow
  over: "overflow",
  "over-y": "overflowY",
  "over-x": "overflowX",
  // Aspect Ratio
  ratio: "aspectRatio",
  // Transition
  transition: "transition",
  "tr-time": "transitionDuration",
  "tr-prop": "transitionProperty",
  "tr-timing": "transitionTimingFunction",
  "tr-delay": "transitionDelay",
  // Transform: for v0.4.26 or higher.
  transform: "transform",
  //? tra: is a shorts of transform, it will separated from its main property 'transform' and will have different approach for style
  "move-x": "tra",
  "move-y": "tra",
  "move-z": "tra",
  matrix: "tra",
  "matrix-3d": "tra",
  "rt-3d": "tra",
  translate: "tra",
  "scale-3d": "tra",
  "scale-x": "tra",
  "scale-y": "tra",
  "scale-z": "tra",
  skew: "tra",
  "skew-x": "tra",
  "skew-y": "tra",
  // More
  rt: "rotate",
  scale: "scale",
  // TenoxUI Custom property
  box: ["width", "height"],
  "flex-parent": ["justifyContent", "alignItems"],
};

export default property;
