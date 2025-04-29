export const is: { [name: string]: RegExp } = {
  number: /^-?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?$/,
  percentage: /^-?(?:\d*\.)?\d+%$/,
  length: /^-?(?:\d*\.)?\d+(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|cm|mm|in|pt|pc|q|%)?$/,
  fraction: /^-?(?:\d*\.)?\d+fr$/,
  time: /^-?(?:\d*\.)?\d+(?:ms|s)$/,
  angle: /^-?(?:\d*\.)?\d+(?:deg|rad|grad|turn)$/,
  resolution: /^-?(?:\d*\.)?\d+(?:dpi|dpcm|dppx|x)$/,
  frequency: /^-?(?:\d*\.)?\d+(?:Hz|kHz)$/,
  integer: /^-?\d+$/,
  url: /^url\(\s*['"]?[^'")]+['"]?\s*\)$/i,
  string: /^(['"]).*\1$/,
  identifier: /^-?[_a-zA-Z][_a-zA-Z0-9-]*$/,
  function: /^([a-z-]+)\(.*\)$/i,
  color:
    /^(?:#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklch|oklab)\(\s*[-\d.%]+(?:\s+[-\d.%]+){1,3}(?:\s*\/\s*[-\d.%]+)?\s*\)|transparent|currentColor|(?:(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen))(?!\S))$/i
}
