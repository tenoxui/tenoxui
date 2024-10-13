import { JSDOM } from 'jsdom'
import { makeTenoxUI } from '../../src/tenoxui'

// use build ready module
// import { makeTenoxUI } from "../../dist/js/tenoxui.esm";

export function setupJSDOM() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
  })
  global.window = dom.window
  global.document = dom.window.document
  global.HTMLElement = dom.window.HTMLElement
  global.MutationObserver = dom.window.MutationObserver
}

export function createStyler(
  element,
  { property = {}, values = {}, classes = {}, breakpoints = [] } = {}
) {
  return new makeTenoxUI({ element, property, values, breakpoints, classes })
}
