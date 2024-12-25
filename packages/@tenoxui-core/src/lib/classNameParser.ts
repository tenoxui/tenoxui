import { Property, Classes } from '../types'

function getAllClassNames(classRegistry: Classes | undefined): string[] {
  if (!classRegistry) return []

  const classNames = new Set<string>()
  Object.values(classRegistry).forEach(classObj => {
    if (classObj && typeof classObj === 'object') {
      Object.keys(classObj).forEach(className => {
        classNames.add(className)
      })
    }
  })
  return Array.from(classNames)
}

function getTypePrefixes(styleAttribute: Property, classRegistry?: Classes): string {
  const propertyTypes = Object.keys(styleAttribute)

  if (!classRegistry) {
    return propertyTypes.sort((a, b) => b.length - a.length).join('|')
  }

  const classNames = getAllClassNames(classRegistry)
  return [...propertyTypes, ...classNames].sort((a, b) => b.length - a.length).join('|')
}

function generateClassNameRegEx(styleAttribute: Property, classRegistry?: Classes): RegExp {
  const typePrefixes = getTypePrefixes(styleAttribute, classRegistry)
  return new RegExp(
    `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])(?:-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?)?`
  )
}

export function parseClassName(
  className: string,
  styleAttribute: Property,
  classRegistry?: Classes
):
  | [
      string | undefined,
      string,
      string | undefined,
      string | undefined,
      string | undefined,
      string | undefined
    ]
  | null {

  if (classRegistry) {
    const prefixMatch = className.match(/^([a-zA-Z0-9-]+):(.+)$/)
    if (prefixMatch) {
      const [, prefix, baseClassName] = prefixMatch
      for (const property of Object.keys(classRegistry)) {
        const classObj = classRegistry[property as keyof Classes]
        if (
          classObj &&
          typeof classObj === 'object' &&
          Object.keys(classObj).includes(baseClassName)
        ) {
          return [prefix, baseClassName, undefined, undefined, undefined, undefined]
        }
      }
    }
  }

  if (classRegistry) {
    for (const property of Object.keys(classRegistry)) {
      const classObj = classRegistry[property as keyof Classes]
      if (classObj && typeof classObj === 'object' && Object.keys(classObj).includes(className)) {
        return [undefined, className, undefined, undefined, undefined, undefined]
      }
    }
  }

  // Check for regular property-based classes
  const classNameRegEx: RegExp = generateClassNameRegEx(styleAttribute, classRegistry)
  const match = className.match(classNameRegEx)

  if (!match) return null

  const [, prefix, type, value, unit, secValue, secUnit] = match
  return [prefix, type, value, unit, secValue, secUnit]
}
