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
    this.element = element
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
      const parts = parseClassName(style, this.property, this.classes)
      // console.log(parts)
      if (!parts) return
      const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts

      if (this.create.parseStyles.handlePredefinedStyle(type, prefix)) return
      if (
        this.create.parseStyles.handleCustomClass(
          parsedPrefix,
          parsedType,
          value,
          unit,
          secValue,
          secUnit
        )
      )
        return

      this.create.parseStyles.parseDefaultStyle(
        parsedPrefix,
        parsedType,
        value,
        unit,
        secValue,
        secUnit
      )
    }

    const resolveAlias = (alias: string, outerPrefix: string = ''): string => {
      const seen = new Set() // Prevent looping
      const resolve = (currentAlias: string, currentPrefix: string): string => {
        if (!this.aliases[currentAlias]) {
          // If the alias doesn't exist, keep the prefixed class name
          return currentPrefix ? `${currentPrefix}:${currentAlias}` : currentAlias
        }
        if (seen.has(currentAlias)) return currentAlias
        seen.add(currentAlias)

        const expanded = this.aliases[currentAlias]
          .split(/\s+/)
          .map((part: string): string => {
            const { prefix: innerPrefix, type: innerType } = this.parseStylePrefix(part)
            const combinedPrefix = currentPrefix || innerPrefix || ''
            return resolve(innerType, combinedPrefix)
          })
          .join(' ')
        return expanded
      }
      return resolve(alias, outerPrefix)
    }

    if (this.aliases && this.aliases[type]) {
      const resolvedAlias = resolveAlias(type, prefix)
      const aliasStyles = resolvedAlias.split(/\s+/).map((alias: string) => {
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
