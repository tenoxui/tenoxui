interface InitialState {
  inline: string
  classes: string
}

interface TargetPair {
  elements: HTMLElement[]
  styles: string[]
  initialStates: Map<HTMLElement, InitialState>
}

interface TargetData {
  pairs: TargetPair[]
}

export class HoverTargetHandler {
  private hoverTargets = new Map<HTMLElement, TargetData>()
  private observedElements = new WeakSet<HTMLElement>()

  constructor(private instance: { applyStyles: (style: string, target: HTMLElement) => void }) {}

  private storeInitialStyles(element: HTMLElement): InitialState {
    return {
      inline: element.getAttribute('style') || '',
      classes: element.getAttribute('class') || ''
    }
  }

  private parseHoverTarget(value: string): { selector: string; styles: string }[] {
    const pairs: { selector: string; styles: string }[] = []
    const pattern = /\((.*?)\):\s*([^;]+);?/g
    let match: RegExpExecArray | null

    while ((match = pattern.exec(value))) {
      pairs.push({
        selector: match[1].trim(),
        styles: match[2].trim()
      })
    }

    return pairs
  }

  private handleMouseEnter = (element: HTMLElement) => {
    const targetData = this.hoverTargets.get(element)
    if (!targetData) return

    targetData.pairs.forEach(({ elements, styles }) => {
      elements.forEach((target) => {
        styles.forEach((style) => this.instance.applyStyles(style, target))
      })
    })
  }

  private handleMouseLeave = (element: HTMLElement) => {
    const targetData = this.hoverTargets.get(element)
    if (!targetData) return

    targetData.pairs.forEach(({ elements, initialStates }) => {
      elements.forEach((target) => {
        const initial = initialStates.get(target)
        if (initial) {
          target.style.cssText = initial.inline
          target.className = initial.classes
          initial.classes.split(/\s+/).forEach((className) => {
            if (className) this.instance.applyStyles(className, target)
          })
        }
      })
    })
  }

  private processHoverTarget(
    element: HTMLElement,
    selectorStylePairs: { selector: string; styles: string }[]
  ): void {
    if (this.observedElements.has(element)) return

    const targetData: TargetData = {
      pairs: selectorStylePairs
        .map(({ selector, styles }) => {
          const targets = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
          if (!targets.length) return null

          const initialStates = new Map(
            targets.map((target) => [target, this.storeInitialStyles(target)])
          )

          return {
            elements: targets,
            styles: styles.split(/\s+/),
            initialStates
          }
        })
        .filter((pair): pair is TargetPair => pair !== null)
    }

    this.hoverTargets.set(element, targetData)
    element.addEventListener('mouseenter', () => this.handleMouseEnter(element))
    element.addEventListener('mouseleave', () => this.handleMouseLeave(element))
    this.observedElements.add(element)

    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'hover-target') {
          const newValue = element.getAttribute('hover-target')
          if (newValue) {
            this.hoverTargets.delete(element)
            this.observedElements.delete(element)
            this.processHoverTarget(element, this.parseHoverTarget(newValue))
          }
        }
      })
    }).observe(element, { attributes: true, attributeFilter: ['hover-target'] })
  }

  public initializeElement(element: HTMLElement): void {
    const hoverTarget = element.getAttribute('hover-target')
    if (hoverTarget) {
      this.processHoverTarget(element, this.parseHoverTarget(hoverTarget))
    }
  }
}
