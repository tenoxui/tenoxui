import { CreatePatternsConfig, Patterns, CreateRegexpResult } from '../types'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/\\-]/g, '\\$&')
}

function createPatterns({
  variants = {},
  utilities = {},
  safelist = [],
  inputPrefixChars = []
}: CreatePatternsConfig = {}): Patterns {
  const propertyTypes = Object.keys(utilities)
  const escapedProperties = propertyTypes.map(escapeRegex)

  const variantNames = Object.keys(variants)
  const escapedVariants = variantNames.map(escapeRegex)

  const allProperties = [...escapedProperties, ...safelist.map(escapeRegex)].sort(
    (a, b) => b.length - a.length
  )
  const allVariants = [...escapedVariants].sort((a, b) => b.length - a.length)

  const nestedBrackets = '\\[[^\\]]+\\]'
  const nestedParens = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'
  const nestedBraces = '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'

  const prefixChars = `[${['a-zA-Z0-9_\\-', ...inputPrefixChars].join('')}]`
  const wordChars = '[a-zA-Z0-9_]'

  const patterns: Patterns = {
    variant:
      allVariants.length > 0
        ? allVariants.join('|') +
          '|' +
          prefixChars +
          '+(?:-(?:' +
          nestedBrackets +
          '|' +
          nestedParens +
          '|' +
          nestedBraces +
          '))?|' +
          nestedBrackets +
          '|' +
          nestedParens +
          '|' +
          nestedBraces
        : prefixChars +
          '+(?:-(?:' +
          nestedBrackets +
          '|' +
          nestedParens +
          '|' +
          nestedBraces +
          '))?|' +
          nestedBrackets +
          '|' +
          nestedParens +
          '|' +
          nestedBraces,

    property:
      (allProperties.length > 0 ? allProperties.join('|') + '|' : '') + '\\[[^\\]]+\\]' + '+',

    value: [
      '-?\\d+(?:\\.\\d+)?',

      wordChars + '+(?:-' + wordChars + '+)*',
      '#[0-9a-fA-F]+',
      nestedBrackets,
      nestedBraces,
      nestedParens,
      '\\$[^\\s\\/]+',
      '(?:' +
        [
          '-?\\d+(?:\\.\\d+)?',
          wordChars + '+(?:-' + wordChars + '+)*',
          '#[0-9a-fA-F]+',
          nestedBrackets,
          '\\$[^\\s\\/]+'
        ].join('|') +
        ')' +
        '\\/' +
        '(?:' +
        [
          '-?\\d+(?:\\.\\d+)?',
          wordChars + '+(?:-' + wordChars + '+)*',
          '#[0-9a-fA-F]+',
          nestedBrackets,
          '\\$[^\\s\\/]+'
        ].join('|') +
        ')'
    ].join('|')
  }

  return patterns
}

export function createMatcher(patterns: Patterns): RegExp {
  const regexPattern =
    '^(?:(?<variant>' +
    patterns.variant +
    '):)?' +
    '(?<property>' +
    patterns.property +
    ')' +
    '(?:-(?<value>' +
    patterns.value +
    '))?$'

  return new RegExp(regexPattern)
}

export function createRegexp(config: CreatePatternsConfig = {}): CreateRegexpResult {
  const patterns = createPatterns(config)
  const matcher = createMatcher(patterns)

  return {
    patterns,
    matcher,
    debug: {
      variantPattern: patterns.variant,
      propertyPattern: patterns.property,
      valuePattern: patterns.value,
      fullPattern: matcher.source
    }
  }
}
