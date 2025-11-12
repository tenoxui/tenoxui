export type CSSProperty = Extract<keyof CSSStyleDeclaration, string>
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable

export type RegexPatterns = Partial<
  Record<'variant' | 'utility' | 'value', string | (string | string[])[]>
>

export type BaseProcessResult<TClassName = string> = {
  className: TClassName
}

export type DefaultProcessUtilityResult = {
  variant: string | null
  utility: CSSPropertyOrVariable | string
  value: string | null
  match: (undefined | string)[]
}

export type ProcessResult<
  TClassName = string,
  Data = Partial<DefaultProcessUtilityResult>
> = BaseProcessResult<TClassName> & Data

export type ParseContext = {
  patterns: RegexPatterns
  regexp: RegExp
}

export type ProcessUtilityContext = Partial<{
  className: string
  utility: string
  variant: string | null
  value: string | null
  match: (string | undefined)[]
}>

export type InitContext<
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [variant: string]: any } = Variants
> = {
  getUtilities: () => TUtilities
  getVariants: () => TVariants
  process: {
    value: (value: string) => string | null
    variant: (variant: string) => string | null
    utility: (ctx: any) => unknown
    className: (cn: string) => unknown | null
    classNames: (cns: string | string[]) => unknown | null
  }
  parser: (className: string) => unknown
  regexp: () => {
    patterns?: RegexPatterns
    regexp?: RegExp
  } | null
  addUtility: <K extends keyof TUtilities>(name: K, value: TUtilities[K]) => void
  addVariant: <K extends keyof TVariants>(name: K, value: TVariants[K]) => void
  addUtilities: (variants: Partial<TUtilities>) => void
  addVariants: (variants: Partial<TVariants>) => void
  invalidateCache: () => void
}

export interface Plugin<
  TProcessResult = BaseProcessResult,
  TProcessUtilityResult = BaseProcessResult,
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [type: string]: any } = Variants
> {
  name: string
  priority?: number

  init?: (context: InitContext<TUtilities, TVariants>) => void

  parse?: (className: string, context: ParseContext) => unknown | null

  regexp?: (context: Partial<ParseContext>) => { patterns?: RegexPatterns; regexp?: RegExp } | null

  utility?: (context: ProcessUtilityContext) => TProcessUtilityResult | null | undefined

  value?: (value: string) => string | null

  variant?: (variant: string) => string | null

  process?: (className: string) => TProcessResult | null | undefined | void

  done?: (results: any) => unknown
}

export type Utilities<T = any> = Record<string, T>
export type Variants<T = any> = Record<string, T>

export interface Config<
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [type: string]: any } = Variants,
  TProcessResult = BaseProcessResult,
  TProcessUtilityResult = BaseProcessResult
> {
  utilities?: TUtilities
  variants?: TVariants
  plugins?: Plugin<TProcessResult, TProcessUtilityResult, TUtilities, TVariants>[]
  cacheSize?: number
}

export type PluginFactory<
  TProcessResult = BaseProcessResult,
  TUtilityResult = BaseProcessResult,
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [type: string]: any } = Variants
> = () => Plugin<TProcessResult, TUtilityResult, TUtilities, TVariants>[]

export type PluginLike<
  TProcessResult = BaseProcessResult,
  TUtilityResult = BaseProcessResult,
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [type: string]: any } = Variants
> =
  | Plugin<TProcessResult, TUtilityResult, TUtilities, TVariants>
  | PluginFactory<TProcessResult, TUtilityResult, TUtilities, TVariants>
