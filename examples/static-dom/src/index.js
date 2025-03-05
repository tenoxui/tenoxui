const { TenoxUI } = __tenoxui_static__
const { property } = TENOXUI_PROPERTY
const ui = new TenoxUI({
  property
})

document.addEventListener('DOMContentLoaded', () => {
  const classNames = [...document.querySelectorAll('*[class]')].flatMap((a) => {
    var r
    return (r = a.getAttribute('class')) == null ? void 0 : r.split(/\s+/).filter(Boolean)
  })

  const styleTag = document.createElement('style')
  const stylesheet = ui.processClassNames(classNames).generateStylesheet()

  styleTag.textContent = stylesheet
  document.head.appendChild(styleTag)
})
