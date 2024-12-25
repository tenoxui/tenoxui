import { Classes, Property, Breakpoint, Values, Aliases } from './types'
import { createTenoxUIComponents } from './utils/assigner'
import { parseClassName } from './lib/classNameParser'
import { scanAndApplyStyles, setupClassObserver } from './lib/observer'
import { AttributifyHandler } from './lib/attributify'

export interface MakeTenoxUIParams {
  element: HTMLElement
  property?: Property
  values?: Values
  breakpoints?: Breakpoint[]
  classes?: Classes
  aliases?: Aliases
  attributify?: boolean
  attributifyPrefix?: string
  attributifyIgnore?: string[]
}

export type CoreConfig = Omit<MakeTenoxUIParams, 'element'>

export class MakeTenoxUI {
  public readonly element: HTMLElement
  public readonly property: Property
  public readonly values: Values
  public readonly breakpoints: Breakpoint[]
  public readonly classes: Classes
  public readonly aliases: Aliases
  private attributify: boolean
  private attributifyPrefix: string
  private attributifyIgnore: string[]
  private attributifyHandler: AttributifyHandler | null = null
  public readonly create: ReturnType<typeof createTenoxUIComponents>

  constructor({
    element,
    property = {},
    values = {},
    breakpoints = [],
    classes = {},
    aliases = {},
    attributify = false,
    attributifyPrefix = 'tx-',
    attributifyIgnore = ['style', 'class', 'id', 'src']
  }: MakeTenoxUIParams) {
    this.element = element
    this.property = property
    this.values = values
    this.breakpoints = breakpoints
    this.classes = classes
    this.aliases = aliases
    this.attributify = attributify
    this.attributifyPrefix = attributifyPrefix
    this.attributifyIgnore = attributifyIgnore
    this.create = this.createComponentInstance(this.element)

    if (this.attributify) {
      this.initAttributifyHandler()
    }
  }

  private initAttributifyHandler(): void {
    this.attributifyHandler = new AttributifyHandler(
      this,
      this.attributifyPrefix,
      this.attributifyIgnore
    )
  }

  public useDOM(element?: HTMLElement): void {
    const targetElement = element || this.element
    if (!targetElement) return
    if (this.attributify && this.attributifyHandler) {
      this.handleAttributify(targetElement)
    }

    const applyStyles = (className: string) => this.applyStyles(className)

    if (targetElement.className) {
      scanAndApplyStyles(applyStyles, targetElement)
      setupClassObserver(applyStyles, targetElement)
    }
  }

  private handleAttributify(element: Element): void {
    if (!(element instanceof HTMLElement) || !this.attributifyHandler) return

    this.attributifyHandler.processElement(element)
    this.attributifyHandler.observeAttributes(element)
  }

  private parseStylePrefix(className: string): { prefix?: string; type: string } {
    const [prefix, type] = className.split(':')
    return {
      prefix: type ? prefix : undefined,
      type: type || prefix
    }
  }

  public applyStyles(className: string, targetElement: HTMLElement = this.element): void {
    const create = this.createComponentInstance(targetElement)
    const { prefix, type } = this.parseStylePrefix(className)

    const processStyle = (style: string) => {
      if (create.parseStyles.handlePredefinedStyle(type, prefix)) return

      const parts = parseClassName(style, this.property, this.classes)
      
      if (!parts) return
      const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts

      if (create.parseStyles.handleCustomClass(parsedPrefix, parsedType, value, unit)) return

      create.parseStyles.parseDefaultStyle(parsedPrefix, parsedType, value, unit, secValue, secUnit)
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

  private createComponentInstance(targetElement: HTMLElement) {
    return createTenoxUIComponents({
      element: targetElement,
      property: this.property,
      values: this.values,
      classes: this.classes,
      breakpoints: this.breakpoints
    })
  }

  public applyMultiStyles(styles: string, targetElement: HTMLElement = this.element): void {
    styles.split(/\s+/).forEach(style => this.applyStyles(style, targetElement))
  }

  public enableAttributify(selector = '*'): void {
    if (!this.attributify) {
      this.attributify = true
      this.initAttributifyHandler()
    }

    const elements = document.querySelectorAll(selector)
    elements.forEach(element => this.handleAttributify(element))

    this.observeNewElements(selector)
  }

  private observeNewElements(selector: string): void {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement && node.matches(selector)) {
            this.handleAttributify(node)
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}
export * from './types'
