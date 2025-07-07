export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type RegexPatterns = {
  variant?: string
  property?: string
  value?: string
}
export type BaseProcessResult = {
  className: string
}
export type DefaultProcessUtilityResult = {
  variant:
    | null
    | {
        raw: string
        data: string | null
      }
    | string
  rules: {
    type: string
    property: CSSPropertyOrVariable
    value:
      | string
      | {
          raw: string | null
          data: string | null
        }
      | null
  }
}
export type ProcessResult<Data = Partial<DefaultProcessUtilityResult>> = BaseProcessResult & Data
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
  parser: (className: string) => unknown
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
  parser?: (className: string) => unknown
  processor?: (
    context: Partial<{
      variant: string | null
      property: string
      value: string
      className: string
    }>
  ) => unknown
  utilities?: Utilities
  variants?: Variants
}
export interface Plugin<
  TProcessUtilitiesResult extends BaseProcessResult = BaseProcessResult,
  TProcessResult extends BaseProcessResult = BaseProcessResult
> {
  name: string
  priority?: number
  parse?: (className: string, context: ParseContext) => unknown | null
  regexp?: (context: RegexpContext) => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
  processUtilities?: (
    context: ProcessUtilitiesContext
  ) => TProcessUtilitiesResult | null | undefined
  processValue?: (value: string, utilities: Utilities) => string | null
  processVariant?: (variant: string, variants: Variants) => string | null
  process?: (
    className: string,
    context?: ProcessContext
  ) => TProcessResult | null | undefined | void
  transform?: (data?: unknown) => unknown
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
