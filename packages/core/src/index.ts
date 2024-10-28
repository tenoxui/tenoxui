// index.ts
import { Classes, Property, MakeTenoxUIParams, Breakpoint, DefinedValue } from './lib/types'
import { ParseStyles } from './base'
// import { scanAndApplyStyles, setupClassObserver } from './lib/observer'

class MakeTenoxUI {
  readonly element: HTMLElement
  readonly property: Property
  readonly values: DefinedValue
  readonly breakpoints: Breakpoint[]
  readonly classes: Classes
  readonly config: MakeTenoxUIParams
  // readonly base: BaseStyler
  readonly parser: ParseStyles
  // private readonly create: ReturnType<typeof createTenoxUIComponents>

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

    this.config = {
      element: this.element,
      property: this.property,
      values: this.values,
      classes: this.classes,
      breakpoints: this.breakpoints
    }

    // this.base = new BaseStyler(this.config)
    this.parser = new ParseStyles(this.config)
  }

  public useDOM() {
    const classes = this.element.className.split(/\s+/)
    const scanner = () =>
      classes.forEach(className => {
        this.applyStyles(className)
      })

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          this.element.style.cssText = ''
          scanner()
        }
      })
    })

    observer.observe(this.element, { attributes: true })
  }

  public applyStyles(className: string): void {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined
    console.log(getType)
    if (this.parser.handlePredefinedStyle(getType, getPrefix)) return
    if (this.parser.handleCustomClass(getType, getPrefix)) return
    const parts = this.parser.parseClassName(className)
    if (!parts) return
    const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts
    this.parser.parseDefaultStyle(parsedPrefix, parsedType, value, unit, secValue, secUnit)
  }

  public applyMultiStyles(styles: string): void {
    styles.split(/\s+/).forEach(style => this.applyStyles(style))
  }
}

export { MakeTenoxUI }
export * from './lib/types'
