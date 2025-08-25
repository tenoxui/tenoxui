import type { BaseProcessResult, CSSPropertyOrVariable } from '@tenoxui/core'
import type { Plugin } from '@nousantx/plugify'
import type { StringRules, ArrayRules, ObjectRules } from './utilityRulesResult'
import type { CreateRegexpResult } from './regexp'

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
  use: 'moxie'
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

export interface UtilityContext {
  className: string | ClassNameObject
  value: string | ProcessedValue
  raw: RegExpMatchArray
  key?: string | null
}

export type AllowedUtilityRules =
  | CSSRule
  | CSSRule[]
  | StringRules
  | CSSPropertyOrVariable[]
  | ArrayRules
  | ObjectRules

export interface UtilityResult {
  className?: string | ClassNameObject
  property?: CSSPropertyOrVariable | CSSPropertyOrVariable[]
  value?: string
  rules?: AllowedUtilityRules
  isImportant?: boolean
}

export type UtilityErrorResult = null | { fail?: true; reason?: string } | [null, string]

export interface UtilityFunction {
  (context: UtilityContext): UtilityResult | UtilityErrorResult
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

export type VariantFunction = (context: VariantContext) => VariantResult

export interface Variants {
  [key: string]: string | VariantFunction
}

export interface Values {
  [key: string]: string
}

export interface Config {
  values?: Values
  plugins?: Plugin<PluginTypes>[]
  priority?: number
  prefixChars?: string[]
  utilitiesName?: string
  typeSafelist?: string[]
  onMatcherCreated?: ((matcher: RegExp) => void) | null
}

export type CreateResultContext = (
  className: string | ClassNameObject,
  variant: string | null,
  property: string | string[],
  value: string,
  raw: RegExpMatchArray,
  isImportant: boolean,
  fullRules?: any
) => ProcessResult

export type CreateErrorResultContext = (className: string, reason: string) => InvalidResult

export interface ProcessValueContext {
  value: string
  raw: string
  key: string | null
  property: string
  createReturn: (value: string) => string | null | ProcessedValue
}

export interface ProcessUtilitiesContext {
  variant: string | null
  property: string | string[]
  value: string
  key: string | null
  raw: RegExpMatchArray
  isImportant: boolean
  createResult: CreateResultContext
  createErrorResult: CreateErrorResultContext
}

export type ProcessResultFn = ProcessResult | InvalidResult | null

export type ProcessVariantFn = (variant: string, variants?: any) => string | null

export type ProcessValueFn = (ctx: Partial<ProcessValueContext>) => string | null | ProcessedValue

export type ProcessUtilitiesFn = (
  ctx: { className: string | ClassNameObject } & Partial<ProcessUtilitiesContext>
) => ProcessResultFn

export type ProcessFn = (ctx: Partial<ProcessContext>) => ProcessResultFn

export interface ProcessContext {
  parser: CreateRegexpResult
  processVariant: ProcessVariantFn
  processValue: (value: string, type?: string) => string | null | ProcessedValue
  processUtilities: (context: {
    className: string | ClassNameObject
    value: string | ProcessedValue | null
    property: any
    variant: string | null
    raw: RegExpMatchArray
    isImportant: boolean
  }) => ProcessResultFn
  createResult: CreateResultContext
  createErrorResult: CreateErrorResultContext
}

export interface PluginTypes {
  processVariant: ProcessVariantFn
  processValue: ProcessValueFn
  processUtilities: ProcessUtilitiesFn
  process: ProcessFn
}

export interface PluginContext {
  variants?: Variants
  utilities?: {
    [utilitiesName: string]: Utilities
  }
}

export * from './regexp'
export * from './utilityRulesResult'
