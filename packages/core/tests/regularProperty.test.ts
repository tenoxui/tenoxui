import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupJSDOM, createStyler } from "./init";

describe("makeTenoxUI", () => {
  let element: HTMLElement;
  let useStyles: (config?: any) => ReturnType<typeof createStyler>;

  // create simple types and properties
  const testProps = {
    p: "padding"
  };

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

  it("should apply single style into element correctly", () => {
    // creating styler
    const styler = useStyles({
      props: { p: "padding" }
    });

    // apply the style into element
    styler.applyStyles("p-1rem");

    expect(element.style.padding).toBe("1rem");
  });

  it("should apply multiple styles into element correctly", () => {
    // creating styler
    const styler = useStyles({
      props: { p: "padding", bg: "background" }
    });

    // apply the style into element
    styler.applyStyles("p-1rem");
    styler.applyStyles("bg-red");

    expect(element.style.padding).toBe("1rem");
    expect(element.style.background).toBe("red");
  });

  it("should apply multi styles with applyMultiStyles method", () => {
    // creating styler
    const styler = useStyles({
      props: { p: "padding", bg: "background", text: "color" }
    });

    // apply the style into element
    styler.applyMultiStyles("p-2.5rem text-#ccf654 bg-black");

    expect(element.style.padding).toBe("2.5rem");
    expect(element.style.background).toBe("black");
    expect(element.style.color).toBe("rgb(204, 246, 84)");
  });
});
