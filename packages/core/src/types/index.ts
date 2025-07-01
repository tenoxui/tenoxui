export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable

export type RegexPatterns = {
  variant?: string
  property?: string
  value?: string
}

// Base ProcessResult that all plugins must conform to
export type BaseProcessResult = {
  className: string
}

// Extended ProcessResult with optional framework-specific data
export type ProcessResult<
  Data = Partial<{
    variant: {
      name: string
      data: string | null
    } | null
    rules: {
      type: string
      property: CSSPropertyOrVariable
    }
    value: { raw: string | null; data: string | null }
  }>
> = BaseProcessResult & Data

// Plugin context types for better reusability
export type ParseContext = {
  patterns: RegexPatterns
  matcher: RegExp
  utilities: Utilities
  variants: Variants
}

export type RegexpContext = {
  patterns?: RegexPatterns
  matcher?: RegExp
  utilities?: Utilities
  variants?: Variants
}

export type ProcessUtilitiesContext = Partial<{
  className: string
  variant: {
    raw: string
    data: string | null
  } | null
  property: {
    name: string
    data: string | undefined
  }
  value: { raw: string; data: string | null }
  utilities: Utilities
  variants: Variants
  parser: (className: string) => any
  regexp: () => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
}>

export type ProcessContext = {
  regexp?: () => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
  parser?: (className: string) => any
  processor?: (
    context: Partial<{
      variant: string | null
      property: string
      value: string
      className: string
    }>
  ) => BaseProcessResult | null
  utilities?: Utilities
  variants?: Variants
}

// Generic plugin interface with better type constraints
export interface Plugin<
  TProcessUtilitiesResult extends BaseProcessResult = BaseProcessResult,
  TProcessResult extends BaseProcessResult = BaseProcessResult
> {
  name: string
  priority?: number

  // Parse method - returns structured data or null
  parse?: (className: string, context: ParseContext) => any | null

  // Regexp method - modifies regex patterns/matcher
  regexp?: (context: RegexpContext) => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null

  // ProcessUtilities - returns ProcessResult or null/undefined
  processUtilities?: (
    context: ProcessUtilitiesContext
  ) => TProcessUtilitiesResult | null | undefined

  // Value processing - transforms values
  processValue?: (value: string, utilities: Utilities) => string | null

  // Variant processing - transforms variants
  processVariant?: (variant: string, variants: Variants) => string | null

  // High-level process method - handles entire className
  process?: (className: string, context?: ProcessContext) => TProcessResult | null | undefined
}

export type Utilities<T = CSSPropertyOrVariable> = Record<string, T>
export type Variants<T = string> = Record<string, T>

export interface Config<
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> {
  utilities?: TUtilities
  variants?: TVariants
  plugins?: Plugin[]
}
