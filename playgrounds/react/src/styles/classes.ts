import { merge } from "../../../../utils/merge";
import { transformClasses } from "../../../../utils/classes-converter";
import { createColors } from "../../../../utils/generate-color";
import { colors } from "./color";

// property based utility classes
const classUtils = {
  color: createColors(colors, "c"),
  background: createColors(colors, "bg"),
  display: {
    flex: "flex",
    iflex: "inline-flex",
    hidden: "none",
  },
};

// class name based / css like styles
const classNames = transformClasses({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }, // .center { ...properties }
  code: {
    background: "rgb(223 227 229 / 0.1)",
    fontFamily: "JetBrains Mono",
    fontSize: "80%",
    padding: "1px 3px",
    borderRadius: "4px",
  },
});

export const classes = merge(classUtils, classNames);
