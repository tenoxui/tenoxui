// index.ts
import { Classes, Property, MakeTenoxUIParams, Breakpoint, DefinedValue } from './lib/types'
import { createTenoxUIComponents } from './utils/assigner'
import { parseClassName } from './lib/classNameParser'
import { scanAndApplyStyles, setupClassObserver } from './lib/observer'

class MakeTenoxUI {
  readonly element: HTMLElement
  readonly property: Property
  readonly values: DefinedValue
  readonly breakpoints: Breakpoint[]
  readonly classes: Classes
  private readonly create: ReturnType<typeof createTenoxUIComponents>

  constructor({
    element,
    property = {},
    values = {},
    breakpoints = [],
    classes = {}
  }: MakeTenoxUIParams) {
    this.element = element instanceof HTMLElement ? element : element[0]
    this.property = property
    this.values = values
    this.breakpoints = breakpoints
    this.classes = classes
    // Pass the validated values to createTenoxUIComponents
    this.create = createTenoxUIComponents({
      element: this.element, // Now guaranteed to be HTMLElement
      property: this.property,
      values: this.values,
      classes: this.classes,
      breakpoints: this.breakpoints
    })
  }

  public useDOM(element?: HTMLElement) {
    const applyStyles = (className: string) => this.applyStyles(className)
    scanAndApplyStyles(applyStyles, element || this.element)
    setupClassObserver(applyStyles, element || this.element)
  }

  public applyStyles(className: string): void {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined
    if (this.create.parseStyles.handlePredefinedStyle(getType, getPrefix)) return
    if (this.create.parseStyles.handleCustomClass(getType, getPrefix)) return
    const parts = parseClassName(className, this.property)
    if (!parts) return
    const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts
    this.create.parseStyles.parseDefaultStyle(
      parsedPrefix,
      parsedType,
      value,
      unit,
      secValue,
      secUnit
    )
  }

  public applyMultiStyles(styles: string): void {
    styles.split(/\s+/).forEach((style) => this.applyStyles(style))
  }
}

export { MakeTenoxUI }
export * from './lib/types'
