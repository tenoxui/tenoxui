/*!
 *
 * TenoxUI CSS Framework v0.4.1
 *
 * copyright (c) 2023 NOuSantx
 *
 * license: https://github.com/nousantx/tenoxui/blob/main/LICENSE
 *
 */

interface PropertyMap {
  [key: string]: string[];
}

const property: PropertyMap = {
  // Mapping type and its Property
  p: ["padding"],
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  pr: ["paddingRight"],
  pl: ["paddingLeft"],
  ph: ["paddingLeft", "paddingRight"],
  pv: ["paddingTop", "paddingBottom"],
  // Margin
  m: ["margin"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  mr: ["marginRight"],
  ml: ["marginLeft"],
  mv: ["marginTop", "marginBottom"],
  mh: ["marginLeft", "marginRight"],
  // Text and font
  fs: ["fontSize"],
  fw: ["fontWeight"],
  lh: ["lineHeight"],
  ls: ["letterSpacing"],
  ta: ["text-align"],
  tc: ["color"],
  ts: ["textStyle"],
  td: ["textDecoration"],
  ti: ["textIndent"],
  tn: ["textReansform"],
  ws: ["wordSpacing"],
  "text-style": ["fontStyle"],
  "white-space": ["whiteSpace"],
  // Positioning
  position: ["position"],
  post: ["position"],
  z: ["zIndex"],
  t: ["top"],
  b: ["bottom"],
  r: ["right"],
  l: ["left"],
  // Display
  display: ["display"],
  // Width and Height
  w: ["width"],
  "w-mx": ["maxWidth"],
  "w-mn": ["minWidth"],
  h: ["height"],
  "h-mx": ["maxHeight"],
  "h-mn": ["minHeight"],
  // Background
  bg: ["background"],
  "bg-size": ["backgroundSize"],
  "bg-clip": ["backgroundClip"],
  "bg-repeat": ["backgroundRepeat"],
  "bg-loc": ["backgroundPosition"],
  "bg-loc-x": ["backgroundPositionX"],
  "bg-loc-y": ["backgroundPositionY"],
  "bg-blend": ["backgroundBlendMode"],
  // Flex
  fx: ["flex"],
  "flex-parent": ["justifyContent", "alignItems"],
  fd: ["flexDirection"],
  "fx-wrap": ["flexWrap"],
  "item-order": ["order"],
  "fx-basis": ["flexBasis"],
  "fx-grow": ["flexGrow"],
  "fx-shrink": ["flexShrink"],
  // Grid
  "grid-row": ["gridTemplateRows"],
  "grid-col": ["gridTemplateColumns"],
  "auto-grid-row": ["gridTemplateRows"],
  "auto-grid-col": ["gridTemplateColumns"],
  "grid-item-row": ["gridRow"],
  "grid-item-col": ["gridColumn"],
  "grid-row-end": ["gridRowEnd"],
  "grid-row-start": ["gridRowStart"],
  "grid-col-end": ["gridColumnEnd"],
  "grid-col-start": ["gridColumnStart"],
  "grid-area": ["gridArea"],
  "item-place": ["placeArea"],
  "content-place": ["placeContent"],
  // Gap
  gap: ["gap"],
  "grid-gap": ["gridGap"],
  "grid-row-gap": ["gridRowGap"],
  "grid-col-gap": ["gridColumnGap"],
  // Align
  ac: ["alignContent"],
  ai: ["align-items"],
  as: ["alignSelf"],
  // Justify
  jc: ["justify-content"],
  ji: ["justifyItems"],
  js: ["justifySelf"],
  // backdrop [ under developement ]
  "backdrop-blur": ["backdropFilter"],
  // Filter
  filter: ["filter"],
  blur: ["filter"],
  brightness: ["filter"],
  contrast: ["filter"],
  grayscale: ["filter"],
  "hue-rotate": ["filter"],
  saturate: ["filter"],
  sepia: ["filter"],
  opa: ["opacity"],
  // Border
  br: ["borderRadius"],
  bw: ["borderWidth"],
  "bw-left": ["borderLeftWidth"],
  "bw-right": ["borderRightWidth"],
  "bw-top": ["borderTopWidth"],
  "bw-bottom": ["borderBottomWidth"],
  bs: ["borderStyle"],
  "radius-tl": ["borderTopLeftRadius"],
  "radius-tr": ["borderTopRightRadius"],
  "radius-bl": ["borderBottomLeftRadius"],
  "radius-br": ["borderBottomRightRadius"],
  "radius-top": ["borderTopLeftRadius", "borderTopRightRadius"],
  "radius-bottom": ["borderBottomLeftRadius", "borderBottomRightRadius"],
  "radius-left": ["borderTopLeftRadius", "borderBottomLeftRadius"],
  "radius-right": ["borderTopRightRadius", "borderBottomRightRadius"],
  // Additional
  curs: ["cursor"],
  scale: ["scale"],
  rt: ["rotate"],
  // Overflow
  over: ["overflow"],
  overY: ["overflowY"],
  overX: ["overflowX"],
  // Float
  float: ["float"],
  // Aspect Ratio
  ratio: ["aspectRatio"],
  // TenoxUI Custom property.
  box: ["width", "height"],
  transition: ["transition"],
  "tr-time": ["transitionDuration"],
  "tr-prop": ["transitionProperty"],
  "tr-timing": ["transitionTimingFunction"],
  "tr-delay": ["transitionDelay"],
};

export default property;
