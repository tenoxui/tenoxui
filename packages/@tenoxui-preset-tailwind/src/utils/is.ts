type RegexpType = { [type: string]: RegExp }

export const has: RegexpType = {
  number: /[-+]?(?:\d*\.\d+|\d+)/,
  integer: /[-+]?\d+/,
  percentage: /[-+]?(?:\d*\.\d+|\d+)\%/,
  fraction: /(?:[-+]?(?:\d*\.\d+|\d+)fr)/,
  ratio: /(?:\d+\s*\/\s*\d+)/,
  dimension: /[-+]?(?:\d*\.\d+|\d+)[a-zA-Z%]+/,
  time: /-?(?:\d*\.)?\d+(?:ms|s)/,
  angle: /-?(?:\d*\.)?\d+(?:deg|rad|grad|turn)/,
  frequency: /-?(?:\d*\.)?\d+(?:Hz|kHz)/,
  resolution: /-?(?:\d*\.)?\d+(?:dpi|dpcm|dppx|x)/,
  length:
    /-?(?:\d*\.)?\d+(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|cm|mm|in|pt|pc|Q|%|cap|ic|lh|rlh|vi|vb|svw|svh|lvw|lvh|dvw|dvh)/,
  color:
    /(?:\#(?:[a-fA-F0-9]{3,4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})|\b(?:rgb|rgba|hsl|hsla|color|lab|lch|oklab|oklch)\(\s*[^)]*\s*\)|\b(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|transparent|currentcolor)\b)/
}

export const is: RegexpType = {}
for (const [key, pattern] of Object.entries(has)) {
  is[key] = new RegExp(`^${pattern.source}$`, 'i')
}

export default { is, has }
