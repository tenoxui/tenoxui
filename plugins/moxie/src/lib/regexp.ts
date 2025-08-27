import type { CreatePatternsConfig, Patterns, CreateRegexpResult } from '../types'
import { escapeRegex } from '../utils'

/**
 * Creates regex patterns for matching utilities, variants, and values
 */
export function createPatterns(config: CreatePatternsConfig = {}): Patterns {
  const {
    variants = [],
    utilities = [],
    safelist = [],
    inputPrefixChars = [],
    valuePatterns = []
  } = config

  // Extract and escape property names
  const propertyTypes = utilities
  const escapedProperties = propertyTypes.map(escapeRegex)

  // Extract and escape variant names
  const variantNames = variants
  const escapedVariants = variantNames.map(escapeRegex)

  // Sort by length (longest first) for better matching
  const allProperties = [...escapedProperties, ...safelist.map(escapeRegex)].sort(
    (a, b) => b.length - a.length
  )
  const allVariants = [...escapedVariants].sort((a, b) => b.length - a.length)

  // Define nested pattern matchers
  const nestedBrackets = '\\[[^\\]]+\\]'
  const nestedParens = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'
  const nestedBraces = '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'

  // Create character classes
  const prefixChars = `[${['a-zA-Z0-9_\\-', ...inputPrefixChars].join('')}]`
  const wordChars = '[a-zA-Z0-9_]'

  const variantPatternsDefault = [
    prefixChars + '+(?:-(?:' + nestedBrackets + '|' + nestedParens + '|' + nestedBraces + '))?',
    nestedBrackets,
    nestedParens,
    nestedBraces
  ]

  const patterns: Patterns = {
    // Variant pattern: matches known variants or custom patterns
    variant:
      allVariants.length > 0
        ? [allVariants.join('|'), ...variantPatternsDefault].join('|')
        : variantPatternsDefault.join('|'),

    // Property pattern: matches known properties or bracketed custom properties
    property:
      allProperties.length > 0
        ? allProperties.join('|') + '|' + '\\[[^\\]]+\\]+'
        : '\\[[^\\]]+\\]+',

    // Value pattern: matches various value formats
    value: [
      valuePatterns.join('|'),
      '-?\\d+(?:\\.\\d+)?', // Numbers (including decimals and negatives)
      wordChars + '+(?:-' + wordChars + '+)*', // Word chains
      nestedBrackets, // Bracketed values
      nestedBraces, // Braced values
      nestedParens, // Parenthesized values
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

/**
 * Creates a RegExp matcher from patterns
 */
export function createMatcher(patterns: Patterns): RegExp {
  const regexPattern = [
    '^',
    '(?:(?<variant>' + patterns.variant + '):)?', // Optional variant with colon
    '(?<property>' + patterns.property + ')', // Required property
    '(?:-(?<value>' + patterns.value + '))?', // Optional value with dash
    '$'
  ].join('')

  return new RegExp(regexPattern)
}

/**
 * Creates complete regexp configuration with patterns and matcher
 */
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
