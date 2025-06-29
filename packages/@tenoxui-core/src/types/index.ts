export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable

export type Utilities<T = CSSPropertyOrVariable> = Record<string, T>
export type Variants<T = string> = Record<string, T>

export type RegexPatterns = {
  variant?: string
  property?: string
  value?: string
}

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
    value: string | null
  }>
> = {
  className: string
} & Data

export interface Config {
  utilities?: Utilities
  variants?: Variants
  plugins?: Plugin[]
}

export interface Plugin {
  name: string
  priority?: number
  parse?: (
    className: string,
    context: {
      patterns: RegexPatterns
      matcher: RegExp
      utilities: Utilities
      variants: Variants
    }
  ) => any
  regexp?: (context: {
    patterns?: RegexPatterns
    matcher?: RegExp
    utilities?: Utilities
    variants?: Variants
  }) => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
  processUtilities?: (
    context: Partial<{
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
  ) => ProcessResult
  processValue?: (value: string, utilities: Utilities) => string | null
  processVariant?: (variant: string, variants: Variants) => string | null
  process?: (
    className: string,
    context?: {
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
      ) => ProcessResult | null
      utilities?: Utilities
      variants?: Variants
    }
  ) => any
}
