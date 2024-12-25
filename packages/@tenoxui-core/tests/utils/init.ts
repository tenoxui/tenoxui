import { JSDOM } from 'jsdom'
import { MakeTenoxUI } from '../../src/tenoxui-full'

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
  {
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    attributify = false,
    attributifyPrefix = 'tx-',
    attributifyIgnore = []
  } = {}
) {
  return new MakeTenoxUI({
    element,
    property,
    values,
    breakpoints,
    classes,
    aliases,
    attributify,
    attributifyPrefix,
    attributifyIgnore
  })
}
