export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable

export type RegexPatterns = {
  variant?: string
  utility?: string
  value?: string
}

export type BaseProcessResult<TClassName = string> = {
  className: TClassName
}

export type DefaultProcessUtilityResult = {
  variant: string | null
  utility: CSSPropertyOrVariable | string
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
  utility: string
  variant: string | null
  value: string | null
  raw: (string | undefined)[]
}>

export type OnInitContext<
  TUtilities extends object = Utilities,
  TVariants extends object = Variants
> = {
  utilities: TUtilities
  variants: TVariants
  process: {
    value: (value: string) => string | null
    variant: (variant: string) => string | null
    utility: (ctx: any) => unknown
  }
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

  init?: (context: OnInitContext<TUtilities, TVariants>) => void

  parse?: (className: string, context: ParseContext) => unknown | null

  regexp?: (context: RegexpContext) => {
    patterns?: RegexPatterns
    matcher?: RegExp
  } | null

  utility?: (context: ProcessUtilitiesContext) => TProcessUtilitiesResult | null | undefined

  value?: (value: string) => string | null

  variant?: (variant: string) => string | null

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
