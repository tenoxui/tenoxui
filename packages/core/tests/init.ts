import { JSDOM } from "jsdom";
import { makeTenoxUI } from "./src/ts/tenoxui.esm";


export function setupJSDOM() {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.MutationObserver = dom.window.MutationObserver;
}

export function createStyler(element, { props = {}, values = {}, classes = {} } = {}) {
  return new makeTenoxUI({
    element,
    property: props,
    values,
    classes
  });
}
