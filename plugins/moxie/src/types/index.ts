import type { CSSPropertyOrVariable } from '@tenoxui/core'

export interface CreatePatternsConfig {
  variants?: Record<string, any>
  utilities?: Record<string, any>
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

export interface Config {
  values?: Record<string, string>
  priority?: number
  typeSafelist?: string[]
  prefixChars?: string[]
}

export interface ProcessResult {
  className: string
  rules: {
    property: CSSPropertyOrVariable | FnResult[]
    value: Value
  }
  prefix?: {
    raw: string
    data: string | null
  } | null
}

export type Value = { raw: string; data: string | null } | string | null

export type FnResult = {
  property: CSSPropertyOrVariable
  value: Value
}

export type UtilityFunctionResult = { className?: string } & (FnResult | { rules: FnResult[] })

export type FnUtilityContext = (
  ctx?: Partial<{
    value: { raw: string; data: string | null } | string | null
    raw: (undefined | string)[]
    className: string
  }>
) => UtilityFunctionResult

export type UtilitiesType = FnUtilityContext | CSSPropertyOrVariable

export type Utilities = Record<string, UtilitiesType>
