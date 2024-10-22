export function extractClassNames(root) {
  return Array.from(
    new Set(
      root
        .querySelectorAll('*')
        .flatMap(element => element.getAttribute('class')?.split(/\s+/) || [])
    )
  )
}

export function extractClassNamesFromMethodCall(content) {
  const classNames = new Set()
  const parts = content.split(',').map(part => part.trim())
  parts.forEach(part => {
    if (part.startsWith("'") || part.startsWith('"')) {
      const className = part.slice(1, -1)
      if (className) classNames.add(className)
    }
  })
  return Array.from(classNames)
}

export function extractClassNamesFromAssignment(content) {
  const classNames = new Set()
  const match = content.match(/["'`]([^"'`]+)["'`]/)
  if (match) {
    match[1].split(/\s+/).forEach(className => classNames.add(className))
  }
  return Array.from(classNames)
}

export function extractClassNamesFromTemplateLiteral(content) {
  const classNames = new Set()
  const parts = content.split(/\${[^}]+}/)
  parts.forEach(part => {
    part.split(/\s+/).forEach(className => {
      if (className) classNames.add(className)
    })
  })
  return Array.from(classNames)
}

export function extractClassNamesFromConditional(content) {
  const classNames = new Set()
  const parts = content.split(/[?:]/)
  parts.forEach(part => {
    const match = part.match(/["'`]([^"'`]+)["'`]/)
    if (match) {
      match[1].split(/\s+/).forEach(className => classNames.add(className))
    }
  })
  return Array.from(classNames)
}
