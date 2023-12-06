/*!
 * copyright (c) 2023 NOuSantx
 */
function TenoxAll() {
  const TenoxAll = document.querySelectorAll(
    '[class*="p-"], [class*="pt-"], [class*="pb-"], [class*="pr-"], [class*="pl-"], [class*="m-"], [class*="mt-"], [class*="mb-"], [class*="mr-"], [class*="ml-"], [class*="fs-"], [class*="fw-"], [class*="z-"], [class*="t-"], [class*="b-"], [class*="r-"], [class*="l-"], [class*="br-"], [class*="bw-"], [class*="w-"], [class*="w-mx-"], [class*="w-mn-"], [class*="h-"], [class*="h-mx-"], [class*="h-mn-"], [class*="fx-"], [class*="gap-"], [class*="ti-"], [class*="rt-"], [class*="backdrop-blur-"], [class*="ph-"], [class*="pv-"], [class*="mv-"], [class*="mh-"], [class*="text-space-"], [class*="word-space-"], [class*="line-height-"], [class*="radius-tl-"], [class*="radius-tr-"], [class*="radius-bl-"], [class*="radius-br-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="radius-top-"], [class*="radius-bottom-"], [class*="radius-left-"], [class*="radius-right-"], [class*="gs-"], [class*="blur-"], [class*="opa-"], [class*="x-"], [class*="bw-left-"], [class*="bw-right-"], [class*="bw-top-"], [class*="bw-bottom-"], [class*="scale-"]'
  );
  TenoxAll.forEach((element) => {
    const classes = element.classList;
    const transformValues = {
      x: null,
      y: null,
    };
    classes.forEach((className) => {
      const match = className.match(
        /(p|pt|pb|pr|pl|m|mt|mb|mr|ml|fs|fw|z|t|b|r|l|br|bw|bw-left|bw-right|bw-top|bw-bottom|w|w-mx|w-mn|h|h-mx|h-mn|fx|gap|ti|rt|backdrop-blur|ph|pv|mv|mh|text-space|word-space|line-height|radius-tl|radius-tr|radius-bl|radius-br|radius-top|radius-bottom|radius-left|radius-right|gs|blur|opa|scale|x|y)-(-?\d+(\.\d+)?)([a-zA-Z]*)/
      );
      if (match) {
        const type = match[1];
        const value = match[2];
        const unitOrValue = match[4];
        switch (type) {
          case "p":
            element.style.padding = `${value}${unitOrValue}`;
            break;
          case "pt":
            element.style.paddingTop = `${value}${unitOrValue}`;
            break;
          case "pb":
            element.style.paddingBottom = `${value}${unitOrValue}`;
            break;
          case "pr":
            element.style.paddingRight = `${value}${unitOrValue}`;
            break;
          case "pl":
            element.style.paddingLeft = `${value}${unitOrValue}`;
            break;
          case "m":
            element.style.margin = `${value}${unitOrValue}`;
            break;
          case "mt":
            element.style.marginTop = `${value}${unitOrValue}`;
            break;
          case "mb":
            element.style.marginBottom = `${value}${unitOrValue}`;
            break;
          case "mr":
            element.style.marginRight = `${value}${unitOrValue}`;
            break;
          case "ml":
            element.style.marginLeft = `${value}${unitOrValue}`;
            break;
          case "fs":
            element.style.fontSize = `${value}${unitOrValue}`;
            break;
          case "fw":
            element.style.fontWeight = value;
            break;
          case "z":
            element.style.zIndex = value;
            break;
          case "t":
            element.style.top = `${value}${unitOrValue}`;
            break;
          case "b":
            element.style.bottom = `${value}${unitOrValue}`;
            break;
          case "r":
            element.style.right = `${value}${unitOrValue}`;
            break;
          case "l":
            element.style.left = `${value}${unitOrValue}`;
            break;
          case "br":
            element.style.borderRadius = `${value}${unitOrValue}`;
            break;
          case "bw":
            element.style.borderWidth = `${value}${unitOrValue}`;
            break;
          case "bw-left":
            element.style.borderLeftWidth = `${value}${unitOrValue}`;
            break;
          case "bw-right":
            element.style.borderRightWidth = `${value}${unitOrValue}`;
            break;
          case "bw-top":
            element.style.borderTopWidth = `${value}${unitOrValue}`;
            break;
          case "bw-bottom":
            element.style.borderBottomWidth = `${value}${unitOrValue}`;
            break;
          case "w":
            element.style.width = `${value}${unitOrValue}`;
            break;
          case "w-mx":
            element.style.maxWidth = `${value}${unitOrValue}`;
            break;
          case "w-mn":
            element.style.minWidth = `${value}${unitOrValue}`;
            break;
          case "h":
            element.style.height = `${value}${unitOrValue}`;
            break;
          case "h-mx":
            element.style.maxHeight = `${value}${unitOrValue}`;
            break;
          case "h-mn":
            element.style.minHeight = `${value}${unitOrValue}`;
            break;
          case "fx":
            element.style.flex = `1 1 ${value}${unitOrValue}`;
            break;
          case "gap":
            element.style.gap = `${value}${unitOrValue}`;
            break;
          case "ti":
            element.style.textIndent = `${value}${unitOrValue}`;
            break;
          case "rt":
            element.style.transform = `rotate(${value}deg)`;
            break;
          case "backdrop-blur":
            element.style.backdropFilter = `blur(${value}${unitOrValue})`;
            break;
          case "ph":
            element.style.paddingLeft = ` ${value}${unitOrValue}`;
            element.style.paddingRight = ` ${value}${unitOrValue}`;
            break;
          case "pv":
            element.style.paddingTop = `${value}${unitOrValue} `;
            element.style.paddingBottom = `${value}${unitOrValue} `;
            break;
          case "mv":
            element.style.marginTop = `${value}${unitOrValue}`;
            element.style.marginBottom = `${value}${unitOrValue}`;
            break;
          case "mh":
            element.style.marginLeft = ` ${value}${unitOrValue}`;
            element.style.marginRight = ` ${value}${unitOrValue}`;
            break;
          case "text-space":
            element.style.letterSpacing = `${value}${unitOrValue}`;
            break;
          case "word-space":
            element.style.wordSpacing = `${value}${unitOrValue}`;
            break;
          case "line-height":
            element.style.lineHeight = `${value}${unitOrValue}`;
            break;
          case "radius-tl":
            element.style.borderTopLeftRadius = `${value}${unitOrValue}`;
            break;
          case "radius-tr":
            element.style.borderTopRightRadius = `${value}${unitOrValue}`;
            break;
          case "radius-bl":
            element.style.borderBottomLeftRadius = `${value}${unitOrValue}`;
            break;
          case "radius-br":
            element.style.borderBottomRightRadius = `${value}${unitOrValue}`;
            break;
          case "radius-top":
            element.style.borderTopLeftRadius = `${value}${unitOrValue}`;
            element.style.borderTopRightRadius = `${value}${unitOrValue}`;
            break;
          case "radius-bottom":
            element.style.borderBottomLeftRadius = `${value}${unitOrValue}`;
            element.style.borderBottomRightRadius = `${value}${unitOrValue}`;
            break;
          case "radius-left":
            element.style.borderTopLeftRadius = `${value}${unitOrValue}`;
            element.style.borderBottomLeftRadius = `${value}${unitOrValue}`;
            break;
          case "radius-right":
            element.style.borderTopRightRadius = `${value}${unitOrValue}`;
            element.style.borderBottomRightRadius = `${value}${unitOrValue}`;
            break;
          case "gs":
            element.style.webkitBackgroundClip = "text";
            element.style.color = "transparent";
            element.style.backgroundSize = "400% 400%";
            element.style.webkitAnimation = `gradientG ${value}${unitOrValue} infinite`;
            element.style.mozAnimation = `gradientG ${value}${unitOrValue} infinite`;
            element.style.oAnimation = `gradientG ${value}${unitOrValue} infinite`;
            element.style.animation = `gradientG ${value}${unitOrValue} infinite`;
            break;
          case "blur":
            element.style.filter = `blur(${value}${unitOrValue})`;
            break;
          case "opa":
            element.style.opacity = value;
            break;
          case "scale":
            element.style.transform = `scale(${value})`;
            break;
          case "x":
            transformValues.x = `${value}${unitOrValue}`;
            break;
          case "y":
            transformValues.y = `${value}${unitOrValue}`;
            break;
          default:
            break;
        }
      }
    });
    if (transformValues.x || transformValues.y) {
      const transformValueX = transformValues.x || "0";
      const transformValueY = transformValues.y || "0";
      element.style.transform = `translate(${transformValueX}, ${transformValueY})`;
    }
  });
}
TenoxAll();
