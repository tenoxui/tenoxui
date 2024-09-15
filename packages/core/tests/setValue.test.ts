import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupJSDOM, createStyler } from "./utils/init";
import { merge } from "../../../utils/merge.mjs";
import { transformClasses } from "../../../utils/classes-converter.mjs";
import { hover, unHover, screenSize } from "./utils/event";

describe("Value handler and applying styles", () => {
  let element: HTMLElement;
  let useStyles: (config?: any) => ReturnType<typeof createStyler>;

  beforeEach(() => {
    setupJSDOM();
    element = document.createElement("div");
    element.className = "my-element";
    document.body.appendChild(element);
    useStyles = (config = {}) => createStyler(element, config);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("should handle value transformation correctly", () => {
    const styler = useStyles({
      // create custom alias for values
      values: {
        primary: "#ccf654",
        size: "calc(10rem - 20px)",
      },
    });

    expect(styler.valueHandler("", styler.parseClassName("bg-primary")[2], "")).toBe("#ccf654");

    expect(styler.valueHandler("", styler.parseClassName("bg-blue")[2], "")).toBe("blue");

    expect(styler.valueHandler("", styler.parseClassName("bg-$my-background")[2], "")).toBe("var(--my-background)");

    expect(styler.valueHandler("", styler.parseClassName("bg-[--c-primary]")[2], "")).toBe("var(--c-primary)");

    expect(styler.valueHandler("", styler.parseClassName("bg-[var(--c-primary)]")[2], "")).toBe("var(--c-primary)");

    expect(styler.valueHandler("", styler.parseClassName("bg-[rgb(221\\_183\\_124\\_/\\_0.3)]")[2], "")).toBe(
      "rgb(221 183 124 / 0.3)"
    );
  });

  /**
   * Handle style transformation from its rules.
   * Apply direct style to the element
   */

  it("should apply styles as default styler to the element directly", () => {
    const styler = useStyles();

    styler.setDefaultValue("background", "red");
    styler.setDefaultValue(["paddingLeft", "paddingRight"], "1rem");
    styler.setDefaultValue("--color", "blue");
    styler.setDefaultValue(["--color1", "--color2"], "yellow");

    expect(element.style.background).toBe("red");
    expect(element.style.paddingLeft).toBe("1rem");
    expect(element.style.paddingRight).toBe("1rem");
    expect(element.style.getPropertyValue("--color")).toBe("blue");
    expect(element.style.getPropertyValue("--color1")).toBe("yellow");
    expect(element.style.getPropertyValue("--color2")).toBe("yellow");
  });

  it("should set css variable to the element", () => {
    const styler = useStyles();

    styler.setCssVar("--size", "1rem");
    styler.setCssVar("--color", "blue");
    styler.setCssVar("--gradient", "linear-gradient(to right, red, blue)");

    expect(element.style.getPropertyValue("--size")).toBe("1rem");
    expect(element.style.getPropertyValue("--color")).toBe("blue");
    expect(element.style.getPropertyValue("--gradient")).toBe("linear-gradient(to right, red, blue)");
  });

  it("should apply custom value to the element", () => {
    const styler = useStyles();

    styler.setCustomValue({ property: "background", value: "{value}" }, "red"); // _ only red
    styler.setCustomValue({ property: "backgroundImage", value: "url(/{value}.svg)" }, "tenoxui"); // => url(/tenoxui.svg)
    styler.setCustomValue({ property: "padding", value: "10px {value} 20px {value}" }, "2rem"); // => 10px 2rem 20px 2rem

    expect(element.style.background).toBe("red");
    expect(element.style.backgroundImage).toBe("url(/tenoxui.svg)");
    expect(element.style.padding).toBe("10px 2rem 20px 2rem");
  });

  /**
   * TenoxUI main styler test.
   * Using `addStyle` method, testing its behavior for applying the styles -
   * based on type (a.k.a property's shorthand), value, unit, and -
   * property's key for custom values and classes.
   */
  it("should apply styles using main styler", () => {
    const styler = useStyles({
      property: {
        text: "color",
        bg: "background",
        p: "padding",
        td: "textDecorationColor",
        myImg: {
          property: "backgroundImage",
          value: "url(/{value}.png)",
        },
      },
      values: {
        prim: "rgb(100, 97, 223)",
      },
      classes: {
        backgroundColor: {
          primary: "#ccf654",
          tx: "blue",
        },
        borderColor: {
          "bdr-blue": "blue",
        },
      },
    });

    // create regular styles
    styler.addStyle("text", "red");
    styler.addStyle("p", "10", "rem");

    // css variable class name
    styler.addStyle("[--color]", "blue");

    // custom value property class name
    styler.addStyle("myImg", "tenoxui"); // => url(/tenoxui.png)

    // handle custom values className
    styler.addStyle("td", "prim");

    // create custom classes
    // get value from custom classes
    const customValue = (classname) => styler.classes[styler.getParentClass(className)][className];

    let className = "primary";
    styler.addStyle(className, customValue(className), "", "backgroundColor");
    className = "bdr-blue";
    styler.addStyle(className, customValue(className), "", "borderColor");

    expect(element.style.color).toBe("red");
    expect(element.style.padding).toBe("10rem");
    expect(element.style.textDecorationColor).toBe("rgb(100, 97, 223)");
    expect(element.style.backgroundImage).toBe("url(/tenoxui.png)");
    expect(element.style.getPropertyValue("--color")).toBe("blue");
    expect(element.style.backgroundColor).toBe("rgb(204, 246, 84)");
    expect(element.style.borderColor).toBe("blue");
  });

  it("should apply styles on hover event", () => {
    const styler = useStyles({
      property: {
        bg: "background",
        text: "color",
      },
    });

    styler.applyMultiStyles("bg-red text-black hover:bg-blue hover:text-white");

    // hover element
    hover(element);
    expect(element.style.background).toBe("blue");
    expect(element.style.color).toBe("white");

    // unhover element
    unHover(element);
    expect(element.style.background).toBe("red");
    expect(element.style.color).toBe("black");
  });

  it("should apply correct styles from defined classes", () => {
    const styler = useStyles({
      classes: merge(
        transformClasses({
          btn: {
            color: "red",
            backgroundColor: "blue",
          },
        }),
        {
          backgroundColor: {
            tenox: "red",
            primary: "#ccf654",
          },
          borderRadius: {
            "radius-md": "6px",
          },
        }
      ),
    });

    styler.applyMultiStyles("btn radius-md");

    expect(element.style.color).toBe("red");
    expect(element.style.background).toBe("blue");
    expect(element.style.borderRadius).toBe("6px");
  });

  it("should apply hover on defined classes", () => {
    const styler = useStyles({
      classes: transformClasses({
        btn: {
          color: "red",
          backgroundColor: "blue",
        },
        "btn-primary": {
          color: "purple",
          backgroundColor: "white",
        },
      }),
    });

    styler.applyMultiStyles("btn hover:btn-primary");

    hover(element);
    expect(element.style.color).toBe("purple");
    expect(element.style.background).toBe("white");
    unHover(element);
    expect(element.style.color).toBe("red");
    expect(element.style.background).toBe("blue");
  });
  // it("should", () => {const styler = useStyles();styler.applyStyles("bg-red");expect(element.style.background).toBe("red");});

  // it("should",()=>{const styler = useStyles({ property: { bg: "background", text: "color", p: "padding" } });expect(element.style.background).toBe("red");})
});
