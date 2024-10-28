export function scanAndApplyStyles(
  applyStylesCallback: (className: string) => void,
  htmlElement: HTMLElement
): void {
  const classes = htmlElement.className.split(/\s+/)
  classes.forEach((className) => {
    applyStylesCallback(className)
  })
}

export function setupClassObserver(
  applyStylesCallback: (className: string) => void,
  htmlElement: HTMLElement
): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        // htmlElement.style.cssText = ''
        scanAndApplyStyles(applyStylesCallback, htmlElement)
      }
    })
  })

  observer.observe(htmlElement, { attributes: true })
}
