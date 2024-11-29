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
    this.element = element instanceof HTMLElement ? element : element[0]
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

  public applyStyles(className: string, targetElement: HTMLElement = this.element): void {
    const create = this.createComponentInstance(targetElement)

    const processStyle = (style: string) => {
      const { prefix, type } = this.parseStylePrefix(style)

      if (create.parseStyles.handlePredefinedStyle(type, prefix)) return
      if (create.parseStyles.handleCustomClass(type, prefix)) return

      const parts = parseClassName(style, this.property)
      if (!parts) return

      const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts
      create.parseStyles.parseDefaultStyle(parsedPrefix, parsedType, value, unit, secValue, secUnit)
    }

    if (this.aliases && this.aliases[className]) {
      const aliasStyles = this.aliases[className].split(/\s+/)
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

  private parseStylePrefix(className: string): { prefix?: string; type: string } {
    const [prefix, type] = className.split(':')
    return {
      prefix: type ? prefix : undefined,
      type: type || prefix
    }
  }

  public applyMultiStyles(styles: string, targetElement: HTMLElement = this.element): void {
    styles.split(/\s+/).forEach((style) => this.applyStyles(style, targetElement))
  }

  public enableAttributify(selector = '*'): void {
    if (!this.attributify) {
      this.attributify = true
      this.initAttributifyHandler()
    }

    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => this.handleAttributify(element))

    this.observeNewElements(selector)
  }

  private observeNewElements(selector: string): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
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
