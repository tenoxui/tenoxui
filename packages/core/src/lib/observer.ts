export class Observer {
  private htmlElement: HTMLElement

  constructor(htmlElement: HTMLElement) {
    this.htmlElement = htmlElement
  }

  public scanAndApplyStyles(applyStylesCallback: (className: string) => void): void {
    const classes = this.htmlElement.className.split(/\s+/)
    classes.forEach((className) => {
      applyStylesCallback(className)
    })
  }

  public setupClassObserver(applyStylesCallback: (className: string) => void): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.htmlElement.style.cssText = ''
          this.scanAndApplyStyles(applyStylesCallback)
        }
      })
    })

    observer.observe(this.htmlElement, { attributes: true })
  }
}
