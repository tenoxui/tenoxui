interface SelectorInfo {
  selector: string
  styles: string
}

interface ParsedValue {
  prefix: string
  value: string
}

export class AttributifyHandler {
  private readonly instance: any
  private readonly attributePrefix: string
  private readonly observedElements = new WeakSet<Element>()
  private readonly ignoredAttributes = new Set<string>()

  constructor(
    tenoxuiInstance: any,
    attributifyPrefix = 'tx-',
    attributifyIgnore: string[] = ['style', 'class', 'id', 'src']
  ) {
    this.instance = tenoxuiInstance
    this.attributePrefix = attributifyPrefix
    // Add each ignored attribute to the Set
    attributifyIgnore.forEach((attr) => this.ignoredAttributes.add(attr))
  }

  // Attribute management
  public addIgnoredAttributes(...attributes: string[]): void {
    attributes.forEach((attr) => this.ignoredAttributes.add(attr))
  }

  public removeIgnoredAttribute(attribute: string): void {
    this.ignoredAttributes.delete(attribute)
  }

  // Main processing methods
  public processElement(element: HTMLElement): void {
    if (this.observedElements.has(element)) return

    Array.from(element.attributes).forEach((attr) =>
      this.processAttribute(element, attr.name, attr.value)
    )

    this.observedElements.add(element)
    this.observeAttributes(element)
  }

  private processAttribute(element: HTMLElement, name: string, value: string | null): void {
    if (!value || this.ignoredAttributes.has(name)) return

    if (name === 'child') {
      this.processChildAttribute(element, value)
      return
    }

    value.split(/\s+/).forEach((part) => {
      this.parseValue(part).forEach((valueObj) => {
        const className = this.attributeToClassName(name, valueObj)
        if (className) {
          console.log(className)
          this.instance.applyStyles(className, element)
        }
      })
    })
  }

  // Child handling methods
  private processChildAttribute(element: HTMLElement, value: string): void {
    const selectors = this.parseChildSelector(value)
    selectors.forEach(({ selector, styles }) => {
      this.applyChildStyles(element, selector, styles)
    })
    this.observeChildChanges(element, selectors)
  }

  private parseChildSelector(selectorStr: string): SelectorInfo[] {
    const selectorPattern = /\((.*?)\):\s*([^;]+);/g
    const selectors: SelectorInfo[] = []
    let match: RegExpExecArray | null

    while ((match = selectorPattern.exec(selectorStr))) {
      const [, selector, styles] = match
      selectors.push({
        selector: selector.trim(),
        styles: styles.trim()
      })
    }

    return selectors
  }

  private applyChildStyles(parent: HTMLElement, childSelector: string, styles: string): void {
    parent.querySelectorAll(childSelector).forEach((child) => {
      styles.split(/\s+/).forEach((className) => {
        this.instance.applyStyles(className, child)
      })
    })
  }

  // Observer setup methods
  public observeChildChanges(element: HTMLElement, selectors: SelectorInfo[]): void {
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.handleAddedNodes(mutation.addedNodes, selectors)
        } else if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          this.handleAttributeChange(mutation.target, selectors)
        }
      })
    }).observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    })
  }

  public observeAttributes(element: HTMLElement): void {
    const attributesToObserve = Array.from(element.attributes)
      .map((attr) => attr.name)
      .filter((name) => !this.ignoredAttributes.has(name))

    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          const attrName = mutation.attributeName
          if (!this.ignoredAttributes.has(attrName)) {
            this.processAttribute(element, attrName, element.getAttribute(attrName))
          }
        }
      })
    }).observe(element, {
      attributes: true,
      attributeFilter: ['child', ...Object.keys(this.instance.property), ...attributesToObserve]
    })
  }

  private handleAddedNodes(nodes: NodeList, selectors: SelectorInfo[]): void {
    nodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        selectors.forEach(({ selector, styles }) => {
          if (node.matches(selector)) {
            styles.split(/\s+/).forEach((className) => {
              this.instance.applyStyles(className, node)
            })
          }
        })
      }
    })
  }

  private handleAttributeChange(target: Element, selectors: SelectorInfo[]): void {
    selectors.forEach(({ selector, styles }) => {
      if (target.matches(selector)) {
        styles.split(/\s+/).forEach((className) => {
          this.instance.applyStyles(className, target)
        })
      }
    })
  }

  private parseValue(value: string): ParsedValue[] {
    const valueRegex = /(?:([a-zA-Z0-9-]+):)?([^:\s]+)/g
    return Array.from(value.matchAll(valueRegex)).map(([, prefix, val]) => ({
      prefix: prefix || '',
      value: val
    }))
  }

  private attributeToClassName(name: string, valueObj: ParsedValue): string | null {
    const { prefix, value } = valueObj
    if (name === 'child') return null

    let baseClass: string | null = null

    if (name.startsWith(this.attributePrefix)) {
      const propertyName = name.slice(this.attributePrefix.length)
      if (propertyName in this.instance.property) {
        baseClass = `${propertyName}-${value}`
      } else {
        // handle direct css proeprty or variable
        baseClass = `[${propertyName}]-${value}`
      }
    } else if (name.startsWith('--')) {
      baseClass = `[${name}]-${value}`
    } else if (name.startsWith('data-')) {
      baseClass = `[${name.slice(5)}]-${value}`
    } else if (name in this.instance.property && !this.ignoredAttributes.has(name)) {
      baseClass = `${name}-${value}`
    } else if (name.startsWith('[') && name.endsWith(']')) {
      baseClass = `${name.slice(1, -1)}-${value}`
    } else if (!this.ignoredAttributes.has(name)) {
      baseClass = `[${name}]-${value}`
    }

    return baseClass ? (prefix ? `${prefix}:${baseClass}` : baseClass) : null
  }
}
