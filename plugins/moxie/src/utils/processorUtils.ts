import type {
  ClassNameObject,
  InvalidResult,
  ProcessResult,
  AcceptedPatterns,
  PatternConfig,
  ArrayPattern,
  ArbitraryPattern,
  AllowedUtilityRules
} from '../types'

export function isProcessedValue(value: any): value is { key: string; value: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.value === 'string'
  )
}

export function isUtilityFunction(utility: any): utility is Function {
  return typeof utility === 'function'
}

export function isUtilityConfig(utility: any): utility is { property?: any; value?: any } {
  return (
    typeof utility === 'object' && utility !== null && ('property' in utility || 'value' in utility)
  )
}

export function extractMatchGroups(match: RegExpMatchArray): {
  variant?: string
  property: string
  value?: string
} {
  const groups = match.groups || {}
  return {
    variant: groups.variant,
    property: groups.property || '',
    value: groups.value
  }
}

/**
 * Arbitrary value helper
 */

export const isArbitrary = (value: string): boolean =>
  !!value &&
  ((value.startsWith('[') && value.endsWith(']')) || (value.startsWith('(') && value.endsWith(')')))

export const escapeArbitrary = (str: string): string =>
  str
    .slice(1, -1)
    .replace(/\\_/g, 'M0X13C55')
    .replace(/_/g, ' ')
    .replace(/M0X13C55/g, '_')

/**
 * Helper to check if a value match the given patterns
 */

export function processStrictPatterns(
  value: string,
  patterns: AcceptedPatterns | PatternConfig
): boolean {
  if (!value || !patterns) {
    return false
  }

  // Handle object configuration
  if (isPatternConfig(patterns)) {
    if (isArbitrary(value)) {
      return handleArbitraryValue(value, patterns.arbitrary)
    }
    return patterns.patterns ? matchesAnyPattern(value, patterns.patterns) : false
  }

  // Handle direct patterns
  return matchesAnyPattern(value, patterns)
}

export function matchesPattern(value: string, pattern: string | RegExp): boolean {
  return typeof pattern === 'string' ? value === pattern : pattern.test(value)
}

export function matchesPatternArray(value: string, patterns: ArrayPattern): boolean {
  return patterns.some((item) =>
    Array.isArray(item) ? matchesPatternArray(value, item) : matchesPattern(value, item)
  )
}

export function isPatternConfig(patterns: any): patterns is PatternConfig {
  return typeof patterns === 'object' && !Array.isArray(patterns) && !(patterns instanceof RegExp)
}

export function handleArbitraryValue(
  rawValue: string,
  arbitrary: ArbitraryPattern = 'variable'
): boolean {
  if (!arbitrary) return false
  const value = escapeArbitrary(rawValue)

  if (typeof arbitrary === 'string' && ['loose', 'variable'].includes(arbitrary)) {
    switch (arbitrary) {
      case 'variable':
        return value.includes('var') || value.includes('--')
      case 'loose':
        return true
      default:
        return false
    }
  } else {
    return matchesAnyPattern(value, arbitrary as AcceptedPatterns)
  }
}

export function matchesAnyPattern(value: string, patterns: AcceptedPatterns): boolean {
  if (typeof patterns === 'string') return value === patterns
  if (patterns instanceof RegExp) return patterns.test(value)
  if (Array.isArray(patterns)) return matchesPatternArray(value, patterns)
  return false
}

/**
 * Helper for creating utility result
 */

export function createErrorResult(
  className: string | ClassNameObject,
  reason = 'undefined'
): InvalidResult {
  return {
    use: 'moxie',
    className,
    rules: null,
    reason
  }
}

export function createResult(
  className: string | ClassNameObject,
  variant: string | null,
  property: string | string[],
  value: string,
  raw: RegExpMatchArray,
  isImportant: boolean,
  fullRules?: AllowedUtilityRules
): ProcessResult {
  return {
    use: 'moxie',
    className,
    rules: (fullRules as any) || { property, value },
    variant,
    isImportant,
    raw
  }
}
