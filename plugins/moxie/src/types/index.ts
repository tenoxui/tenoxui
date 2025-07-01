import type { CSSPropertyOrVariable } from '@tenoxui/core/types'

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

export type Value = { raw: string; data: string | null } | null

export type FnResult = {
  property: CSSPropertyOrVariable
  value: Value
}

export type UtilityFunctionResult = FnResult | FnResult[]
