((root, factory) => {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports.property = factory().property;
  } else {
    root.property = factory().property;
  }
})(typeof self !== "undefined" ? self : this, () => {
  const property = {
    // padding
    p: "padding",
    pt: "paddingTop",
    pb: "paddingBottom",
    pr: "paddingRight",
    pl: "paddingLeft",
    py: ["paddingTop", "paddingBottom"],
    px: ["paddingLeft", "paddingRight"],
    // margin
    m: "margin",
    mt: "marginTop",
    mb: "marginBottom",
    mr: "marginRight",
    ml: "marginLeft",
    my: ["marginTop", "marginBottom"],
    mx: ["marginLeft", "marginRight"],
    // font and text style
    font: "font",
    fs: "fontSize",
    fw: "fontWeight",
    lh: "lineHeight",
    ls: "letterSpacing",
    ta: "textAlign",
    text: "color",
    td: "textDecoration",
    ti: "textIndent",
    tn: "textTransform",
    tw: "textWrap",
    ws: "wordSpacing",
    family: "fontFamily",
    "font-s": "fontStyle",
    "white-space": "whiteSpace",
    // positioning
    pn: "position",
    z: "zIndex",
    t: "top",
    b: "bottom",
    r: "right",
    l: "left",
    // display
    d: "display",
    // size
    w: "width",
    "w-mx": "maxWidth",
    "w-mn": "minWidth",
    h: "height",
    "h-mx": "maxHeight",
    "h-mn": "minHeight",
    // background
    bg: "background",
    "bg-c": "backgroundColor",
    "bg-img": "backgroundImage",
    "bg-size": "backgroundSize",
    "bg-r": "backgroundRepeat",
    "bg-pn": "backgroundPosition",
    // flex
    flex: "flex",
    "flex-d": "flexDirection",
    "flex-w": "flexWrap",
    "flex-b": "flexBasis",
    "flex-g": "flexGrow",
    "flex-s": "flexShrink",
    // gap
    gap: "gap",
    "gap-y": "columnGap",
    "gap-x": "rowGap",
    // align
    "align-i": "alignItems",
    // justify
    "justify-c": "justifyContent",
    // border
    bdr: "border",
    "bdr-c": "borderColor",
    "bdr-r": "borderRadius",
    "bdr-s": "borderStyle",
    "bdr-w": "borderWidth",
    "bdr-w-l": "borderLeftWidth",
    "bdr-w-r": "borderRightWidth",
    "bdr-w-t": "borderTopWidth",
    "bdr-w-b": "borderBottomWidth",
    // cursor
    cursor: "cursor",
    // overflow
    over: "overflow",
    "over-y": "overflowY",
    "over-x": "overflowX",
    // aspect Ratio
    ratio: "aspectRatio",
    // transition
    transition: "transition",
    "tr-time": "transitionDuration",
    "tr-prop": "transitionProperty",
    "tr-timing": "transitionTimingFunction",
    "tr-delay": "transitionDelay",
    // more
    shadow: "boxShadow",
    // custom property
    box: ["width", "height"],
    "flex-parent": ["justifyContent", "alignItems"],

    // full properties
    all: "all",
    order: "order",
    visibility: "visibility",
    resize: "resize",
    float: "float",
    isolation: "isolation",
    col: "columns",
    "box-si": "boxSizing",
    // place like
    "pc-i": "placeItems",
    "pc-c": "placeContents",
    "pc-s": "placeSelf",

    // border extended
    "bg-att": "backgroundAttachment",
    "bg-ori": "backgroundOrigin",
    "bg-clip": "backgroundClip",
    "bg-p-x": "backgroundPositionX",
    "bg-p-y": "backgroundPositionY",
    "bg-r-x": "backgroundRepeatX",
    "bg-r-y": "backgroundRepeaty",
    // align and justify
    "align-c": "alignContent",
    "align-s": "alignSelf",
    "justify-i": "justifyItems",
    "justify-s": "justifySelf",
    // border color
    "bdr-c-t": "borderTopColor",
    "bdr-c-b": "borderBottomColor",
    "bdr-c-l": "borderLeftColor",
    "bdr-c-r": "borderRightColor",
    // border style
    "bdr-s-t": "borderTopStyle",
    "bdr-s-b": "borderBottomStyle",
    "bdr-s-l": "borderLeftStyle",
    "bdr-s-r": "borderRightStyle",
    // border Radius
    "bdr-r-t": ["borderTopRightRadius", "borderTopLeftRadius"],
    "bdr-r-b": ["borderBottomRightRadius", "borderBottomLeftRadius"],
    "bdr-r-l": ["borderBottomLeftRadius", "borderTopLeftRadius"],
    "bdr-r-r": ["borderBottomRightRadius", "borderTopRightRadius"],
    "bdr-r-tl": "borderTopLeftRadius",
    "bdr-r-tr": "borderTopRightRadius",
    "bdr-r-bl": "borderBottomLeftRadius",
    "bdr-r-br": "borderBottomRightRadius",
    // other border
    "bdr-img": "borderImage",
    // list style
    "list-s": "listStyle",
    "list-s-img": "listStyleImage",
    "list-s-pn": "listStylePosition",
    "list-s-type": "listStyleType",
    // animation
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
      value: `rotate(var(--tx_rotate, 0))
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
translateZ(var(--tx_translate-z, 0))`,
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
      value: `blur(var(--tx_blur, 0)) 
brightness(var(--tx_brightness, 1)) 
contrast(var(--tx_contrast, 1)) 
grayscale(var(--tx_grayscale, 0)) 
hue-rotate(var(--tx_hue-rotate, 0)) 
invert(var(--tx_invert, 0)) 
opacity(var(--tx_opacity, 1)) 
saturate(var(--tx_saturate, 1)) 
sepia(var(--tx_sepia, 0))
drop-shadow(var(--tx_drop-shadow, 0 0 0 rgb(0 0 0 / 0)))`,
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
      value: `blur(var(--back_blur, 0)) 
brightness(var(--back_brightness, 1)) 
contrast(var(--back_contrast, 1)) 
grayscale(var(--back_grayscale, 0)) 
hue-rotate(var(--back_hue-rotate, 0)) 
invert(var(--back_invert, 0)) 
opacity(var(--back_opacity, 1)) 
saturate(var(--back_saturate, 1)) 
sepia(var(--back_sepia, 0))`,
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
  return { property };
});
