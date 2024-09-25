import { merge } from "../../../../utils/merge";
import { transformClasses } from "../../../../utils/classes-converter";
import { createColors, createRGBColors } from "../../../../utils/generate-color";
import { colors } from "./color";
import { shadowClasses } from "../ui/shadow";

// property based utility classes
const classUtils = {
  color: createColors(colors, "c"),
  background: createColors(colors, "bg"),
  borderColor: createColors(colors, "border"),
  display: {
    flex: "flex",
    iflex: "inline-flex",
    hidden: "none",
  },
  justifyContent: {
    space: "space-between",
  },
  position: {
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
  },
  ...shadowClasses,
};

// class name based / css like styles
const classNames = transformClasses({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    background: "rgb(223 227 229 / 0.1)",
    fontFamily: "JetBrains Mono",
    fontSize: "80%",
    padding: "1px 3px",
    borderRadius: "4px",
  },
  btn: {
    // all: "unset",
    border: "unset",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "35px",
    padding: "6px 10px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s, color 0.2s",
  },
  "btn-icon": {
    height: "35px",
    width: "35px",
  },
});

export const classes = merge(classUtils, classNames);
