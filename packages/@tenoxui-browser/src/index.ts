import { TenoxUI as Core } from 'tenoxui'
import { TenoxUI as Moxie } from '@tenoxui/moxie'
import { unescapeCSSSelector } from './utils/unescape'
import { Config, StatusInfo, type MutationCallback } from './types'

export class TenoxUI extends Core {
  private watch: boolean
  private styleId: string
  private selector: string
  private debounceDelay: number
  private isInitialized: boolean
  private processExisting: boolean
  private updateTimeout: number | null
  private apply: Record<string, string>
  private processedClasses: Set<string>
  private observer: MutationObserver | null
  private styleElement: HTMLStyleElement | null

  constructor({
    // tenoxui configuration
    moxie = Moxie,
    tabSize = 2,
    values = {},
    classes = {},
    aliases = {},
    property = {},
    variants = {},
    safelist = [],
    typeOrder = [],
    breakpoints = {},
    moxieOptions = {},
    selectorPrefix = '',
    prefixLoaderOptions = {},
    reservedVariantChars = [],
    // dom options
    apply = {},
    watch = true,
    debounceDelay = 10,
    processExisting = true,
    selector = '[class]',
    styleId = 'tenoxui-browser-id'
  }: Partial<Config> = {}) {
    super({
      moxie,
      values,
      aliases,
      classes,
      tabSize,
      property,
      variants,
      safelist,
      typeOrder,
      breakpoints,
      moxieOptions,
      selectorPrefix,
      prefixLoaderOptions,
      reservedVariantChars
    })

    this.apply = apply
    this.watch = watch
    this.styleId = styleId
    this.selector = selector
    this.updateTimeout = null
    this.debounceDelay = debounceDelay
    this.processExisting = processExisting

    this.observer = null
    this.styleElement = null
    this.isInitialized = false
    this.processedClasses = new Set<string>()
  }

  /**
   * Initialize the TenoxUI instance
   */
  public init(): this {
    if (this.isInitialized) {
      console.warn('TenoxUI is already initialized')
      return this
    }

    this.createStyleElement()

    if (this.processExisting) {
      this.scanAndProcessClasses()
    }

    if (this.watch) {
      this.startObserving()
    }

    this.isInitialized = true
    return this
  }

  /**
   * Create or get the style element for injecting CSS
   */
  private createStyleElement(): HTMLStyleElement {
    this.styleElement = document.getElementById(this.styleId) as HTMLStyleElement

    if (!this.styleElement) {
      this.styleElement = document.createElement('style')
      this.styleElement.id = this.styleId
      this.styleElement.setAttribute('data-tenoxui', 'true')
      document.head.appendChild(this.styleElement)
    }

    return this.styleElement
  }

  /**
   * Scan existing elements and process their classes
   */
  private scanAndProcessClasses(): void {
    const elements = document.querySelectorAll(this.selector)
    const allClasses = new Set<string>()

    elements.forEach((element) => {
      const classList = element.classList
      if (classList.length > 0) {
        classList.forEach((className) => {
          if (className.trim()) {
            allClasses.add(className)
          }
        })
      }
    })

    if (allClasses.size > 0) {
      this.processClasses(Array.from(allClasses))
    }
  }

  /**
   * Create styles from CSS and apply configuration
   */
  private createStyles(css: string): this {
    const styleFromApply = this.render(this.apply)
    return this.injectCSS(styleFromApply + '\n' + css)
  }

  /**
   * Process an array of class names and generate CSS
   */
  private processClasses(classNames: string[]): void {
    const newClasses = classNames.filter((className) => !this.processedClasses.has(className))

    if (newClasses.length === 0) return

    newClasses.forEach((className) => this.processedClasses.add(className))

    this.createStyles(this.render(newClasses))
  }

  /**
   * Inject CSS into the style element
   */
  private injectCSS(css: string): this {
    if (this.styleElement && css.trim()) {
      this.styleElement.textContent += '\n' + css
    }
    return this
  }

  /**
   * Start observing DOM changes for new classes
   */
  private startObserving(): void {
    if (!window.MutationObserver) {
      console.warn('MutationObserver not supported, dynamic class detection disabled')
      return
    }

    this.observer = new MutationObserver((mutations) => {
      this.debouncedUpdate(() => {
        this.handleMutations(mutations)
      })
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    })
  }

  /**
   * Handle DOM mutations and extract new classes
   */
  private handleMutations(mutations: MutationRecord[]): void {
    const newClasses = new Set<string>()

    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const element = mutation.target as Element
        if (element.classList) {
          element.classList.forEach((className) => {
            if (className.trim() && !this.processedClasses.has(className)) {
              newClasses.add(className)
            }
          })
        }
      }

      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.extractClassesFromElement(node as Element, newClasses)
          }
        })
      }
    })

    if (newClasses.size > 0) {
      this.processClasses(Array.from(newClasses))
    }
  }

  /**
   * Extract classes from an element and its descendants
   */
  private extractClassesFromElement(element: Element, classSet: Set<string>): void {
    if (element.classList) {
      element.classList.forEach((className) => {
        if (className.trim() && !this.processedClasses.has(className)) {
          classSet.add(className)
        }
      })
    }

    const descendants = element.querySelectorAll('[class]')
    descendants.forEach((descendant) => {
      descendant.classList.forEach((className) => {
        if (className.trim() && !this.processedClasses.has(className)) {
          classSet.add(className)
        }
      })
    })
  }

  /**
   * Debounce updates to avoid excessive processing
   */
  private debouncedUpdate(callback: MutationCallback): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    this.updateTimeout = setTimeout(callback, this.debounceDelay)
  }

  /**
   * Manually add classes for processing
   */
  public addClass(...classNames: (string | string[])[]): this {
    const result: string[] = []
    for (const item of classNames) {
      if (Array.isArray(item)) {
        result.push(...item)
      } else if (item) {
        result.push(item)
      }
    }
    this.processClasses(result)
    return this
  }

  /**
   * Rescan existing elements for classes
   */
  public rescan(): this {
    this.scanAndProcessClasses()
    return this
  }

  /**
   * Clear all processed classes and rescan
   */
  public refresh(): this {
    this.processedClasses.clear()
    if (this.styleElement) {
      this.styleElement.textContent = ''
    }
    this.scanAndProcessClasses()
    return this
  }

  /**
   * Stop observing DOM changes
   */
  public stopObserving(): this {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    return this
  }

  /**
   * Destroy the TenoxUI instance and clean up resources
   */
  public destroy(): this {
    this.stopObserving()
    if (this.styleElement) {
      this.styleElement.remove()
      this.styleElement = null
    }
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
      this.updateTimeout = null
    }
    this.processedClasses.clear()
    this.isInitialized = false
    return this
  }

  /**
   * Get status information about the current instance
   */
  public status(): StatusInfo {
    const classes = Array.from(this.processedClasses)
    const rulesData = this.getRulesData(classes)
    const processedResults = this.process(classes)

    return {
      processedClasses: [classes.length, classes],
      validClasses: [
        rulesData.length,
        processedResults ? processedResults.map((i) => unescapeCSSSelector(i.className)) : []
      ],
      isObserving: !!this.observer,
      isInitialized: this.isInitialized,
      styleElementExists: !!this.styleElement
    }
  }
}

export * from './types'
export default TenoxUI
