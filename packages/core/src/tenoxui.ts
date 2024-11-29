import { Classes, Property, Breakpoint, Values, Aliases } from './types'
import { createTenoxUIComponents } from './utils/assigner'
import { parseClassName } from './lib/classNameParser'
import { scanAndApplyStyles, setupClassObserver } from './lib/observer'

export interface MakeTenoxUIParams {
  element: HTMLElement
  property?: Property
  values?: Values
  breakpoints?: Breakpoint[]
  classes?: Classes
  aliases?: Aliases
}

export type CoreConfig = Omit<MakeTenoxUIParams, 'element'>

export class MakeTenoxUI {
  public readonly element: HTMLElement
  public readonly property: Property
  public readonly values: Values
  public readonly breakpoints: Breakpoint[]
  public readonly classes: Classes
  public readonly aliases: Aliases
  public readonly create: ReturnType<typeof createTenoxUIComponents>

  constructor({
    element,
    property = {},
    values = {},
    breakpoints = [],
    classes = {},
    aliases = {}
  }: MakeTenoxUIParams) {
    this.element = element instanceof HTMLElement ? element : element[0]
    this.property = property
    this.values = values
    this.breakpoints = breakpoints
    this.classes = classes
    this.aliases = aliases

    this.create = createTenoxUIComponents({
      element: this.element,
      property: this.property,
      values: this.values,
      classes: this.classes,
      breakpoints: this.breakpoints
    })
  }

  public useDOM(element?: HTMLElement): void {
    const targetElement = element || this.element
    if (!targetElement) return

    const applyStyles = (className: string) => this.applyStyles(className)

    if (targetElement.className) {
      scanAndApplyStyles(applyStyles, targetElement)
      setupClassObserver(applyStyles, targetElement)
    }
  }

  private parseStylePrefix(className: string): { prefix?: string; type: string } {
    const [prefix, type] = className.split(':')
    return {
      prefix: type ? prefix : undefined,
      type: type || prefix
    }
  }

  public applyStyles(className: string): void {
    const { prefix, type } = this.parseStylePrefix(className)
    const processStyle = (style: string) => {
      if (this.create.parseStyles.handlePredefinedStyle(type, prefix)) return
      if (this.create.parseStyles.handleCustomClass(type, prefix)) return

      const parts = parseClassName(style, this.property)
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

    if (this.aliases && this.aliases[type]) {
      const aliasStyles = this.aliases[type].split(/\s+/).map((alias) => {
        if (prefix && alias.startsWith(`${prefix}:`)) {
          alias = alias.slice(prefix.length + 1)
        }
        return prefix ? `${prefix}:${alias}` : alias
      })

      aliasStyles.forEach(processStyle)
      return
    }

    processStyle(className)
  }

  public applyMultiStyles(styles: string): void {
    styles.split(/\s+/).forEach((style) => this.applyStyles(style))
  }
}

export * from './types'
