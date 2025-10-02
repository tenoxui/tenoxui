export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable

export type RegexPatterns = {
  variant?: string
  property?: string
  value?: string
}

export type BaseProcessResult<TClassName = string> = {
  className: TClassName
}

export type DefaultProcessUtilityResult = {
  variant: string | null
  property: CSSPropertyOrVariable | string
  value: string | null
  raw: (undefined | string)[]
}

export type ProcessResult<
  TClassName = string,
  Data = Partial<DefaultProcessUtilityResult>
> = BaseProcessResult<TClassName> & Data

export type ParseContext = {
  patterns: RegexPatterns
  matcher: RegExp
}

export type RegexpContext = {
  patterns?: RegexPatterns
  matcher?: RegExp
}

export type ProcessUtilitiesContext = Partial<{
  className: string
  property: string
  variant: string | null
  value: string | null
  raw: (string | undefined)[]
}>

export type ProcessContext = {
  regexp?: () => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
  parser?: (className: string) => unknown
  processUtility?: (
    context: Partial<{
      variant: string | null
      property: string
      value: string
      className: string
    }>
  ) => unknown
  processValue?: (value: string, utilities: Utilities) => string | null
  processVariant?: (variant: string, variants: Variants) => string | null
  utilities?: Utilities
  variants?: Variants
}

export type OnInitContext<
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> = {
  utilities: TUtilities
  variants: TVariants
  processValue: (value: string) => string | null
  processVariant: (variant: string) => string | null
  processUtilities: (ctx: any) => unknown
  parser: (className: string) => unknown
  regexp: () => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null
  addUtility: (name: string, value: any) => void
  addVariant: (name: string, value: any) => void
  addUtilities: (utilities: Record<string, any>) => void
  addVariants: (variants: Record<string, any>) => void
  invalidateCache: () => void
}

export interface Plugin<
  TProcessResult = BaseProcessResult,
  TProcessUtilitiesResult = BaseProcessResult,
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> {
  name: string
  priority?: number

  onInit?: (context: OnInitContext<TUtilities, TVariants>) => void

  parse?: (className: string, context: ParseContext) => unknown | null

  regexp?: (context: RegexpContext) => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null

  processUtilities?: (
    context: ProcessUtilitiesContext
  ) => TProcessUtilitiesResult | null | undefined

  processValue?: (value: string) => string | null

  processVariant?: (variant: string) => string | null

  process?: (className: string) => TProcessResult | null | undefined | void
}

export type Utilities<T = CSSPropertyOrVariable> = Record<string, T>
export type Variants<T = string> = Record<string, T>

export interface Config<
  TUtilities extends object = Utilities,
  TVariants extends object = Variants,
  TProcessResult = BaseProcessResult,
  TProcessUtilitiesResult = BaseProcessResult
> {
  utilities?: TUtilities
  variants?: TVariants
  plugins?: Plugin<TProcessResult, TProcessUtilitiesResult, TUtilities, TVariants>[]
}

export type PluginFactory<
  TProcessResult = BaseProcessResult,
  TUtilityResult = BaseProcessResult,
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> = () => Plugin<TProcessResult, TUtilityResult, TUtilities, TVariants>[]

export type PluginLike<
  TProcessResult = BaseProcessResult,
  TUtilityResult = BaseProcessResult,
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> =
  | Plugin<TProcessResult, TUtilityResult, TUtilities, TVariants>
  | PluginFactory<TProcessResult, TUtilityResult, TUtilities, TVariants>

/**
 * Utility type for creating type-safe plugins
 */
export type CreatePlugin<
  TUtilities extends object = Utilities,
  TVariants extends object = Variants,
  TProcessResult = BaseProcessResult,
  TProcessUtilitiesResult = BaseProcessResult
> = Plugin<TProcessResult, TProcessUtilitiesResult, TUtilities, TVariants>
