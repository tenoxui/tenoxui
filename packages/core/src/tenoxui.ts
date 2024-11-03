import { Classes, Property, MakeTenoxUIParams, Breakpoint, DefinedValue } from './lib/types'
import { createTenoxUIComponents } from './utils/assigner'
import { parseClassName } from './lib/classNameParser'

class MakeTenoxUI {
  private static instances: Map<HTMLElement, MakeTenoxUI> = new Map()
  private static defaultStyles: Map<string, string> = new Map()

  private static getInstance(
    element: HTMLElement,
    config: Omit<MakeTenoxUIParams, 'element'>
  ): MakeTenoxUI {
    if (!this.instances.has(element)) {
      this.instances.set(element, new MakeTenoxUI({ element, ...config }))
    }
    return this.instances.get(element)!
  }

  // Changed from private to public
  public static setDefaultStyles(selector: string, styles: string): void {
    this.defaultStyles.set(selector, styles)
  }

  public static getDefaultStyles(element: HTMLElement): string | null {
    for (const [selector, styles] of this.defaultStyles) {
      if (element.matches(selector)) {
        return styles
      }
    }
    return null
  }

  // Added a new method to get all default styles
  public static getAllDefaultStyles(): Map<string, string> {
    return new Map(this.defaultStyles)
  }

  readonly element!: HTMLElement
  readonly property!: Property
  readonly values!: DefinedValue
  readonly breakpoints!: Breakpoint[]
  readonly classes!: Classes
  private readonly create!: ReturnType<typeof createTenoxUIComponents>

  constructor({
    element,
    property = {},
    values = {},
    breakpoints = [],
    classes = {}
  }: MakeTenoxUIParams) {
    const targetElement = element instanceof HTMLElement ? element : element[0]
    const existingInstance = MakeTenoxUI.instances.get(targetElement)
    if (existingInstance) {
      return existingInstance
    }

    this.element = targetElement
    this.property = property
    this.values = values
    this.breakpoints = breakpoints
    this.classes = classes
    this.create = createTenoxUIComponents({
      element: this.element,
      property: this.property,
      values: this.values,
      classes: this.classes,
      breakpoints: this.breakpoints
    })

    MakeTenoxUI.instances.set(this.element, this)
  }

  public useDOM(element?: HTMLElement): void {
    const targetElement = element || this.element
    if (!targetElement) return

    const reapplyDefaultStyles = () => {
      const defaultStyles = MakeTenoxUI.getDefaultStyles(targetElement)
      if (defaultStyles) {
        this.applyMultiStyles(defaultStyles)
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          targetElement.style.cssText = ''

          reapplyDefaultStyles()

          targetElement.className.split(/\s+/).forEach((className) => {
            if (className) this.applyStyles(className)
          })
        }
      })
    })
    reapplyDefaultStyles()
    targetElement.className.split(/\s+/).forEach((className) => {
      if (className) this.applyStyles(className)
    })

    observer.observe(targetElement, { attributes: true })
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
    styles.split(/\s+/).forEach((style) => {
      if (style) this.applyStyles(style)
    })
  }

  public static applyDefaultStyles(styles: Record<string, string>): void {
    Object.entries(styles).forEach(([selector, styleString]) => {
      this.setDefaultStyles(selector, styleString)
      document.querySelectorAll(selector).forEach((element) => {
        const instance = this.getInstance(element as HTMLElement, {})
        instance.applyMultiStyles(styleString)
      })
    })
  }
}

export { MakeTenoxUI }
export * from './lib/types'
