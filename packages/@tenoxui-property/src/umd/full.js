((root, factory) => {
  if (typeof define === "function" && define.amd) {
    // AMD (Asynchronous Module Definition)
    define([], factory);
  } else if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports.fullProps = factory().fullProps;
  } else {
    root.fullProps = factory().fullProps;
  }
})(typeof self !== "undefined" ? self : this, () => {
  const fullProps = {
    // padding
    p: "padding",
    pt: "paddingTop",
    pb: "paddingBottom",
    pr: "paddingRight",
    pl: "paddingLeft",
    py: ["paddingTop", "paddingBottom"],
    px: ["paddingLeft", "paddingRight"],
    // Margin
    m: "margin",
    mt: "marginTop",
    mb: "marginBottom",
    mr: "marginRight",
    ml: "marginLeft",
    my: ["marginTop", "marginBottom"],
    mx: ["marginLeft", "marginRight"],
    // Text and font
    fs: "fontSize",
    fw: "fontWeight",
    lh: "lineHeight",
    ls: "letterSpacing",
    ta: "textAlign",
    c: "color",
    td: "textDecoration",
    ti: "textIndent",
    tn: "textTransform",
    tw: "textWrap",
    ws: "wordSpacing",
    family: "fontFamily",
    "font-s": "fontStyle",
    "white-space": "whiteSpace",
    // Positioning
    pn: "position",
    z: "zIndex",
    t: "top",
    b: "bottom",
    r: "right",
    l: "left",
    // Display
    d: "display",
    // Width and Height
    w: "width",
    "w-mx": "maxWidth",
    "w-mn": "minWidth",
    h: "height",
    "h-mx": "maxHeight",
    "h-mn": "minHeight",
    // Background
    bg: "background",
    "bg-c": "backgroundColor",
    "bg-i": "backgroundImage",
    "bg-a": "backgroundAttachment",
    "bg-or": "backgroundOrigin",
    "bg-s": "backgroundSize",
    "bg-r": "backgroundRepeat",
    "bg-p": "backgroundPosition",
    "bg-clip": "backgroundClip",
    // Flex
    fx: "flex",
    "fx-d": "flexDirection",
    "fx-w": "flexWrap",
    "fx-b": "flexBasis",
    "fx-g": "flexGrow",
    "fx-s": "flexShrink",
    // Gap
    g: "gap",
    "g-y": "columnGap",
    "g-x": "rowGap",
    // Align
    "a-i": "alignItems",
    // Justify
    "j-c": "justifyContent",
    // Border
    border: "border",
    bc: "borderColor",
    br: "borderRadius",
    bs: "borderStyle",
    bw: "borderWidth",
    "bw-l": "borderLeftWidth",
    "bw-r": "borderRightWidth",
    "bw-t": "borderTopWidth",
    "bw-b": "borderBottomWidth",
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
    // More
    shadow: "boxShadow",
    // custom property
    box: ["width", "height"],
    "fx-parent": ["justifyContent", "alignItems"],

    order: "order",
    "a-c": "alignContent",
    "a-s": "alignSelf",
    "j-i": "justifyItems",
    "j-s": "justifySelf",
    // Border Radius
    "br-t": ["borderTopRightRadius", "borderTopLeftRadius"],
    "br-b": ["borderBottomRightRadius", "borderBottomLeftRadius"],
    "br-l": ["borderBottomLeftRadius", "borderTopLeftRadius"],
    "br-r": ["borderBottomRightRadius", "borderTopRightRadius"],
    "br-tr": "borderTopRightRadius",
    "br-tl": "borderTopLeftRadius",
    "br-br": "borderBottomRightRadius",
    "br-bl": "borderBottomLeftRadius",
    // Animation
    animation: "animation",
    "an-name": "animationName",
    "an-direction": "animationDirection",
    "an-fill-mode": "animationFillMode",
    "an-play-state": "animationPlayState",
    "an-time": "animationDuration",
    "an-timing": "animationTimingFunction",
    "an-delay": "animationDelay",
    // transform
    transform: {
      property: "transform",
      value: `
rotate(var(--tx_rotate, 0))
rotateY(var(--tx_rotate-y, 0))
rotateX(var(--tx_rotate-x, 0))
rotateZ(var(--tx_rotate-z, 0))
scale(var(--tx_scale, 1))
scaleY(var(--tx_scale-y, 1))
scaleX(var(--tx_scale-x, 1))
scaleZ(var(--tx_scale-z, 1))
skew(var(--tx_skew, 0))
skewY(var(--tx_skew-y, 0))
skewX(var(--tx_skew-x, 0))
translate(var(--tx_translate, 0))
translateY(var(--tx_translate-y, 0))
translateX(var(--tx_translate-x, 0))
translateZ(var(--tx_translate-z, 0))
  `,
    },
    rotate: "--tx_rotate",
    "rotate-y": "--tx_rotate-y",
    "rotate-x": "--tx_rotate-x",
    "rotate-z": "--tx_rotate-z",
    scale: "--tx_scale",
    "scale-x": "--tx_scale-x",
    "scale-y": "--tx_scale-y",
    "scale-z": "--tx_scale-z",
    skew: "--tx_skew",
    "skew-x": "--tx_skew-x",
    "skew-y": "--tx_skew-y",
    translate: "--tx_translate",
    "translate-x": "--tx_translate-x",
    "translate-y": "--tx_translate-y",
    "translate-z": "--tx_translate-z",
    // filter
    filter: {
      property: "filter",
      value: `
blur(var(--tx_blur, 0)) 
brightness(var(--tx_brightness, 1)) 
contrast(var(--tx_contrast, 1)) 
grayscale(var(--tx_grayscale, 0)) 
hue-rotate(var(--tx_hue-rotate, 0)) 
invert(var(--tx_invert, 0)) 
opacity(var(--tx_opacity, 1)) 
saturate(var(--tx_saturate, 1)) 
sepia(var(--tx_sepia, 0))
drop-shadow(var(--tx_drop-shadow, 0 0 0 rgb(0 0 0 / 0)))
  `,
    },
    blur: "--tx_blur",
    brightness: "--tx_brightness",
    contrast: "--tx_contrast",
    grayscale: "--tx_grayscale",
    "hue-rotate": "--tx_hue-rotate",
    invert: "--tx_invert",
    opacity: "--tx_opacity",
    saturate: "--tx_saturate",
    sepia: "--tx_sepia",
    // backdrop-filter
    backdrop: {
      property: "backdropFilter",
      value: `
blur(var(--back_blur, 0)) 
brightness(var(--back_brightness, 1)) 
contrast(var(--back_contrast, 1)) 
grayscale(var(--back_grayscale, 0)) 
hue-rotate(var(--back_hue-rotate, 0)) 
invert(var(--back_invert, 0)) 
opacity(var(--back_opacity, 1)) 
saturate(var(--back_saturate, 1)) 
sepia(var(--back_sepia, 0))
  `,
    },
    "back-blur": "--back_blur",
    "back-brightness": "--back_brightness",
    "back-contrast": "--back_contrast",
    "back-grayscale": "--back_grayscale",
    "back-hue-rotate": "--back_hue-rotate",
    "back-invert": "--back_invert",
    "back-opacity": "--back_opacity",
    "back-saturate": "--back_saturate",
    "back-sepia": "--back_sepia",
  };
  return { fullProps };
});
