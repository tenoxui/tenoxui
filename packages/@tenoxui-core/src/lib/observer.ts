export function scanAndApplyStyles(
  applyStylesCallback: (className: string) => void,
  htmlElement: Element
): void {
  const classAttribute = htmlElement.getAttribute('class') || ''
  const classNames = classAttribute.split(/\s+/)

  classNames.forEach((className) => {
    if (className.trim()) {
      applyStylesCallback(className)
    }
  })
}

export function setupClassObserver(
  applyStylesCallback: (className: string) => void,
  htmlElement: Element
): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (htmlElement instanceof HTMLElement) {
          htmlElement.style.cssText = ''
        }

        scanAndApplyStyles(applyStylesCallback, htmlElement)
      }
    })
  })

  observer.observe(htmlElement, { attributes: true })
}
