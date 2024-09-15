import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupJSDOM, createStyler } from "./utils/init";

describe("makeTenoxUI", () => {
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

  it("should parse class names correctly", () => {
    const styler = useStyles();

    // parsed types
    expect(styler.parseClassName("text-red")[1]).toBe("text");
    expect(styler.parseClassName("[--my-color]-red")[1]).toBe("[--my-color]");
    // parsed values
    expect(styler.parseClassName("bg-red")[2]).toBe("red");
    expect(styler.parseClassName("bg-#ccf655")[2]).toBe("#ccf655");
    expect(styler.parseClassName("bg-$my-color")[2]).toBe("$my-color");
    expect(styler.parseClassName("bg-[--my-var]")[2]).toBe("[--my-var]");
    expect(styler.parseClassName("bg-[var(--my-var)]")[2]).toBe("[var(--my-var)]");
    expect(styler.parseClassName("bg-[rgb(221\\_183\\_124\\_/\\_0.3)]")[2]).toBe("[rgb(221\\_183\\_124\\_/\\_0.3)]");
  });

  it("should convert values correctly", () => {
    const styler = useStyles({
      values: {
        primary: "#ccf654"
      }
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
  it("should have correct css property and value", () => {
    const styler = useStyles({
      property: {
        text: "color",
        bg: "background",
        box: ["width", "height"],
        br: ["webkitBorderRadius", "mozBorderRadius", "borderRadius"]
      }
    });

    styler.applyMultiStyles("text-red bg-black box-100px br-8px");

    expect(element.style).toHaveProperty("color", "red");
    expect(element.style).toHaveProperty("background", "black");
    expect(element.style).toHaveProperty("width", "100px");
    expect(element.style).toHaveProperty("height", "100px");
    expect(element.style).toHaveProperty("borderRadius", "8px");
  });

  it("should have correct value for css variable", () => {
    const styler = useStyles({
      property: {
        color3: "--color3",
        color45: ["--color4", "--color5"],
        color6: {
          property: "--color6",
          value: "linear-gradient(to right, {value}, blue, var(--tx))"
        },
        color7: {
          property: "--color7",
          value: "var(--tx)"
        }
      }
    });

    styler.applyStyles("[--color1]-red");
    styler.applyStyles("[--color2]-blue");
    styler.applyStyles("color3-yellow");
    styler.applyStyles("color45-green");
    styler.applyStyles("color6-red");
    styler.applyStyles("color7");

    expect(element.style.getPropertyValue("--color1")).toBe("red");
    expect(element.style.getPropertyValue("--color2")).toBe("blue");
    expect(element.style.getPropertyValue("--color3")).toBe("yellow");
    expect(element.style.getPropertyValue("--color4")).toBe("green");
    expect(element.style.getPropertyValue("--color5")).toBe("green");
    expect(element.style.getPropertyValue("--color6")).toBe("linear-gradient(to right, red, blue, var(--tx))");
    expect(element.style.getPropertyValue("--color7")).toBe("var(--tx)");
  });

  it("should convert `camelType` into `kebab-type`", () => {
    const styler = useStyles();

    expect(styler.camelToKebab("itsTenox")).toBe("its-tenox");
    // camelToKebab method is used to convert camelCase css property -
    // into kebab-type css property
    expect(styler.camelToKebab("backgroundColor")).toBe("background-color");
    expect(styler.camelToKebab("borderRadius")).toBe("border-radius");
    expect(styler.camelToKebab("color")).toBe("color");
  });

  it("should return correct css properties or variables", () => {
    const styler = useStyles({
      property: {
        bg: "background",
        bgC: "backgroundColor",
        px: ["paddingLeft", "paddingRight"]
      },
      classes: {
        backgroundColor: {
          tx: "red"
        }
      }
    });

    expect(styler.getPropName("[--tx]")).toBe("--tx");
    expect(styler.getPropName("bg")).toBe("background");
    expect(styler.getPropName("bgC")).toBe("background-color");
    expect(styler.getPropName("px")).toStrictEqual(["padding-left", "padding-right"]);
    // custom css property
    expect(styler.getPropName("", "backgroundColor")).toBe("background-color");
  });

  it("should get initial value of the element", () => {
    const styler = useStyles({
      property: {
        bg: "background",
        bgC: "backgroundColor",
        px: ["paddingLeft", "paddingRight"]
      },
      classes: {
        backgroundColor: {
          tx: "red"
        }
      }
    });

    styler.applyMultiStyles("bg-red px-1rem");
    
    
    
    console.log(styler.getInitialValue(["paddingLeft", "paddingRight"]));
    
    
    
    expect(styler.getInitialValue("background")).toBe("red");
    expect(styler.getInitialValue(["paddingLeft", "paddingRight"])).toBe("1rem");
  });
});
