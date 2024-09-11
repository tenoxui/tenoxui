import { describe, bench, expect, beforeEach, afterEach, vi } from "vitest";
import { setupJSDOM, createStyler } from "./utils/init";

describe("performance test", () => {
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

  bench("should apply multiple styles into element correctly", () => {
    const styler = useStyles({
      property: { p: "padding", bg: "background" }
    });

    // apply the style into element
    styler.applyStyles("p-1rem");
    styler.applyStyles("bg-red");

    expect(element.style.padding).toBe("1rem");
    expect(element.style.background).toBe("red");
  });
});
