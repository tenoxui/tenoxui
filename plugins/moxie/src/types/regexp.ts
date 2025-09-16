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
}

export type MatcherOptions = {
  strict?: boolean
  withValue?: boolean
  strictValue?: boolean
  valueMode?: 1 | 2
}
