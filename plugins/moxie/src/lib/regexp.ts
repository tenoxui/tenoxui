import type { CreatePatternsConfig, Patterns, CreateRegexpResult, MatcherOptions } from '../types'

/**
 * Creates regex patterns for matching utilities, variants, and values
 */
export function createPatterns(config: CreatePatternsConfig = {}): Patterns {
  const { variants = [], utilities = [], inputPrefixChars = [], valuePatterns = [] } = config

  // Sort by length (longest first) for better matching
  const allProperties = utilities.sort((a, b) => b.length - a.length)
  const allVariants = variants.sort((a, b) => b.length - a.length)

  // Define nested pattern matchers
  const nestedBrackets = '\\[[^\\]]+\\]'
  const nestedParens = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'

  // alphabetical characters
  const alphabeticalChars = '[a-zA-Z0-9_\\-]'

  // Create character classes
  const prefixChars = `[${[alphabeticalChars.slice(1, -1), ...inputPrefixChars].join('')}]`

  const variantPatternsDefault = [
    prefixChars + '+(?:-(?:' + nestedBrackets + '|' + nestedParens + '))?',
    nestedBrackets,
    nestedParens
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
      valuePatterns
        .map((pattern) => (pattern instanceof RegExp ? pattern.source : pattern))
        .join('|'),
      '-?\\d+(?:\\.\\d+)?', // Numbers (including decimals and negatives)
      alphabeticalChars + '+(?:-' + alphabeticalChars + '+)*', // Word chains
      nestedBrackets, // Bracketed values
      nestedParens // Parenthesized values
    ].join('|')
  }

  return patterns
}

/**
 * Create RegExp patterns from patterns
 */
export function createMatcher(patterns: Patterns, options: MatcherOptions = {}): RegExp {
  const { strict = true, withValue = true, strictValue = false, valueMode = 1 } = options

  const parts: string[] = []

  if (strict) parts.push('^')

  // Variants
  parts.push(`(?:(?<variant>${patterns.variant}):)?`)

  // Properties/Utilities
  parts.push(`(?<property>${patterns.property})`)

  // Values
  if (withValue) {
    parts.push(
      strictValue
        ? `-(?<value>${patterns.value})` // must exist
        : `(?:-${valueMode === 2 ? ')(' : ''}(?<value>${patterns.value}))?` // optional
    )
  }

  if (strict) parts.push('$')

  return new RegExp(parts.join(''))
}

/**
 * Creates complete regexp configuration with patterns and matcher
 */
export function createRegexp(
  config: CreatePatternsConfig = {},
  matcherOptions = {}
): CreateRegexpResult {
  const patterns = createPatterns(config)
  const matcher = createMatcher(patterns, matcherOptions)
  return {
    patterns,
    matcher
  }
}
