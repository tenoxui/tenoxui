export interface CreatePatternsConfig {
  variants?: string[]
  utilities?: string[]
  safelist?: string[]
  inputPrefixChars?: string[]
  valuePatterns?: string[]
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
