export interface CreatePatternsConfig {
  variants?: string[]
  utilities?: string[]
  inputPrefixChars?: string[]
  valuePatterns?: (string | RegExp)[]
}

export interface Patterns {
  variant: string
  property: string
  value: string
}

export interface CreateRegexpResult {
  patterns: Patterns
  matcher: RegExp
  debug: {
    variantPattern: string
    propertyPattern: string
    valuePattern: string
    fullPattern: string
  }
}

export type MatcherOptions = {
  strict?: boolean
  withValue?: boolean
  strictValue?: boolean
  valueMode?: 1 | 2
}
