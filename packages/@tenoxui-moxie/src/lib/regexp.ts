import type { Property } from '../types'
import type { Classes } from '@tenoxui/types'

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/\\-]/g, '\\$&')
}

export function getAllClassNames(classRegistry: Classes | undefined): string[] {
  if (!classRegistry) return []
  const classNames = new Set<string>()

  Object.entries(classRegistry).forEach(([property, classObj]) => {
    if (classObj && typeof classObj === 'object') {
      Object.keys(classObj).forEach((className) => {
        classNames.add(className)
      })
    }
  })

  return Array.from(classNames)
}

export function getTypePrefixes({
  safelist = [],
  property = {},
  classes = {}
}: Partial<{
  safelist: string[]
  property: Property
  classes: Classes
}> = {}): string[] {
  const classRegistry = classes
  const propertyTypes = Object.keys(property)

  if (!classRegistry) {
    return [...propertyTypes, ...safelist].sort((a, b) => b.length - a.length)
  }

  const classConfigs = getAllClassNames(classRegistry)
  const classPatterns = [...classConfigs]

  return [...propertyTypes, ...classPatterns, ...safelist].sort((a, b) => b.length - a.length)
}

export function regexp({
  inputPrefixChars = [],
  safelist = [],
  property = {},
  classes = {}
}: Partial<{
  safelist: string[]
  property: Property
  classes: Classes
  inputPrefixChars: string[]
}> = {}) {
  // escape possible characters before passed to `type` RegExp pattern
  let typePrefixes: string | string[] = getTypePrefixes({ safelist, property, classes }).map(
    escapeRegex
  )

  if (typePrefixes.length > 0) {
    typePrefixes = typePrefixes.join('|') + '|'
  }

  // Common pattern for handling complex nested structures
  const nestedBracketPattern = '\\[[^\\]]+\\]'
  const nestedParenPattern = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'
  const nestedBracePattern = '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'

  const prefixChars = `[${['a-zA-Z0-9_\\-', ...inputPrefixChars].join('')}]`

  // 1. Prefix pattern
  const prefixPattern =
    // Simple prefix (hover, md, focus, etc.)
    prefixChars +
    '+|' +
    // value-like prefix (nth-(4), max-[445px], etc.)
    prefixChars +
    '+(?:-(?:' +
    nestedBracketPattern +
    '|' +
    nestedParenPattern +
    '|' +
    nestedBracePattern +
    '))|' +
    // added support for custom secondValue for prefix
    prefixChars +
    '+(?:-(?:' +
    nestedBracketPattern +
    '|' +
    nestedParenPattern +
    '|' +
    nestedBracePattern +
    '))?(?:\\/' +
    '[a-zA-Z0-9_\\-]' +
    '+)|' +
    // Direct bracket, parenthesis, or brace content
    nestedBracketPattern +
    '|' +
    nestedParenPattern +
    '|' +
    nestedBracePattern

  // 2. Type pattern
  const typePattern = `(${typePrefixes}\\[[^\\]]+\\])`

  // 3. Separator
  const separator = '(?:-)'

  // 4. Value pattern - modified to handle $ variables correctly
  const valuePattern =
    '(-?(?:\\d+(?:\\.\\d+)?)|' + // Numbers
    '(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|' + // Words with hyphens
    '(?:#[0-9a-fA-F]+)|' + // Hex colors
    nestedBracketPattern +
    '|' + // Bracket content
    nestedBracePattern +
    '|' + // Curly brace content
    nestedParenPattern +
    '|' + // Parentheses content
    '(?:\\$[^\\s\\/]+))' // Dollar sign content

  // 5. Unit pattern (optional)
  const unitPattern = '([a-zA-Z%]*)'

  // 6. Secondary value pattern (optional)
  const secondaryPattern =
    '(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|' + // Same pattern as valuePattern
    '(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|' +
    '(?:#[0-9a-fA-F]+)|' +
    nestedBracketPattern +
    '|' +
    nestedBracePattern +
    '|' +
    nestedParenPattern +
    '|' +
    '(?:\\$[^\\s\\/]+))' +
    '([a-zA-Z%]*))?'

  return {
    prefix: prefixPattern,
    type: typePattern,
    separator: separator,
    value: valuePattern,
    unit: unitPattern,
    secondValuePattern: secondaryPattern,
    all:
      '^(?:(' +
      prefixPattern +
      '):)?' +
      typePattern +
      separator +
      valuePattern +
      unitPattern +
      secondaryPattern +
      '$'
  }
}
