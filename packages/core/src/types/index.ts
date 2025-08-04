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
  property: string
  variant: string | null
  value: string | null
  raw: (string | undefined)[]
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
  TProcessResult = BaseProcessResult,
  TProcessUtilitiesResult = BaseProcessResult
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

export type PluginFactory<
  TProcessResult = BaseProcessResult,
  TUtilityResult = BaseProcessResult
> = () => Plugin<TProcessResult, TUtilityResult>[]

export type PluginLike<TProcessResult = BaseProcessResult, TUtilityResult = BaseProcessResult> =
  | Plugin<TProcessResult, TUtilityResult>
  | PluginFactory<TProcessResult, TUtilityResult>
