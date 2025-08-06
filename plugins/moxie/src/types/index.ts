import type { BaseProcessResult, CSSPropertyOrVariable } from '@tenoxui/core'

export interface ProcessedValue {
  key: string
  value: string
}

export interface CSSRule {
  property: CSSPropertyOrVariable | CSSPropertyOrVariable[]
  value: string
  isImportant?: boolean
}

export interface ProcessResult extends BaseProcessResult<string | ClassNameObject> {
  use: string
  rules: CSSRule | CSSRule[] | string | null
  variant?: string | null
  isImportant?: boolean
  raw?: RegExpMatchArray
}

export interface InvalidResult extends ProcessResult {
  reason?: string
}

export interface ClassNameObject {
  full?: string
  raw?: string
  prefix?: string
  suffix?: string
}

export interface TransformResult {
  rules: string[]
  invalid: {
    moxie: ProcessResult[]
    rest: unknown[]
  }
}

export interface UtilityFunction {
  (context: UtilityContext): UtilityResult | null
}

export interface UtilityContext {
  className: string
  value: string | ProcessedValue
  raw: RegExpMatchArray
  key?: string | null
}

export interface UtilityResult {
  className?: string | ClassNameObject
  property?: CSSPropertyOrVariable | CSSPropertyOrVariable[]
  value?: string
  rules?:
    | CSSRule
    | CSSRule[]
    | string
    | [CSSPropertyOrVariable | CSSPropertyOrVariable[], string, boolean?]
    | { [key: CSSPropertyOrVariable | string]: string | [string, boolean?] }

  isImportant?: boolean
}

export interface UtilityConfig {
  property?: CSSPropertyOrVariable | CSSPropertyOrVariable[] | UtilityFunction
  value?: (string | RegExp)[]
}

type AcceptedUtility =
  | CSSPropertyOrVariable
  | CSSPropertyOrVariable[]
  | UtilityConfig
  | UtilityFunction

export interface Utilities {
  [key: string]: AcceptedUtility | [RegExp, AcceptedUtility]
}

export type VariantContext = {
  key?: string | null
  value?: string
}
export type VariantResult = string | null
export type VariantFunction = (context?: VariantContext) => VariantResult

export interface Variants {
  [key: string]: string | VariantFunction
}

export interface Values {
  [key: string]: string
}

export interface Config {
  values?: Values
  priority?: number
  prefixChars?: string[]
  utilitiesName?: string
  typeSafelist?: string[]
  onMatcherCreated?: ((matcher: RegExp) => void) | null
}

export interface CreatePatternsConfig {
  variants?: string[]
  utilities?: string[]
  safelist?: string[]
  inputPrefixChars?: string[]
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

export interface Plugin {
  name: string
  priority: number
  process(className: string, ctx: PluginContext): ProcessResult | void
}

export interface PluginContext {
  variants?: Variants
  utilities?: {
    [utilitiesName: string]: Utilities
  }
}
