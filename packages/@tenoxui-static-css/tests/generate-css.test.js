import { describe, it, expect, beforeEach, vi } from "vitest";
import { GenerateCSS } from "../src/js/index.mjs";
import fs from "fs";
import path from "path";

describe("GenerateCSS", () => {
  let config;
  let generator;
  beforeEach(() => {
    config = {
      property: {
        bg: "background-color",
        text: "color",
        p: "padding",
        br: "border-radius",
        size: ["width", "height"]
      },
      values: {
        primary: "#ccf654"
      },
      classes: {
        display: {
          center: "flex"
        },
        alignItems: {
          center: "center"
        },
        justifyContent: {
          center: "center"
        }
      },
      input: [path.resolve(process.cwd(), "src/apps/index.html")],
      output: path.resolve(process.cwd(), "test-output.css")
    };
    generator = new GenerateCSS(config);
  });

  it("should escape CSS selectors", () => {
    expect(GenerateCSS.escapeCSSSelector("bg-#fff")).toBe("bg-\\#fff");
    expect(GenerateCSS.escapeCSSSelector("p-[1rem]")).toBe("p-\\[1rem\\]");
  });

  it("should match class components correctly", () => {
    const result = generator.matchClass("hover:p-2rem");
    expect(result).toEqual(["hover", "p", "2", undefined, "rem"]);
  });

  it("should parse HTML and extract class names", () => {
    const html = '<div class="bg-red text-white p-2rem"></div>';
    const classNames = generator.parseHTML(html);
    expect(classNames).toEqual(["bg-red", "text-white", "p-2rem"]);
  });

  it("should parse JSX and extract class names", () => {
    const jsx = '<div className="bg-blue text-black p-2"></div>';
    const classNames = generator.parseJSX(jsx);
    expect(classNames).toEqual(["bg-blue", "text-black", "p-2"]);
  });

  it("should generate CSS rule for a simple class", () => {
    const cssRule = generator.parseClass("bg-red");
    expect(cssRule).toBe(".bg-red { background-color: red; }");
  });

  it("should generate CSS rule with custom value", () => {
    const cssRule = generator.parseClass("bg-primary");
    expect(cssRule).toBe(".bg-primary { background-color: #ccf654; }");
  });

  it("should generate CSS rule with multiple properties", () => {
    const cssRule = generator.parseClass("size-100px");
    expect(cssRule).toBe(".size-100px { width: 100px; height: 100px; }");
  });

  it("should generate CSS rule for custom class", () => {
    const cssRule = generator.parseClass("center");
    expect(cssRule).toBe(".center { display: flex; align-items: center; justify-content: center; }");
  });

  it("should generate CSS from multiple class names", () => {
    const css = generator.create(["bg-primary", "text-white", "p-[calc(1rem\\_+\\_10px)]"]);
    expect(css).toContain(".bg-primary { background-color: #ccf654; }");
    expect(css).toContain(".text-white { color: white; }");
    expect(css).toContain(".p-\\[calc\\(1rem\\_\\+\\_10px\\)\\] { padding: calc(1rem + 10px); }");
  });

  it("should generate CSS file from input files", () => {
    const mockReadFileSync = vi.spyOn(fs, "readFileSync").mockReturnValue('<div class="bg-blue text-white"></div>');
    const mockWriteFileSync = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});

    generator.generateFromFiles();

    expect(mockReadFileSync).toHaveBeenCalled();
    expect(mockWriteFileSync).toHaveBeenCalled();
    expect(mockWriteFileSync.mock.calls[0][1]).toContain(".bg-blue { background-color: blue; }");
    expect(mockWriteFileSync.mock.calls[0][1]).toContain(".text-white { color: white; }");

    // Restore the original functions
    mockReadFileSync.mockRestore();
    mockWriteFileSync.mockRestore();
  });
});
