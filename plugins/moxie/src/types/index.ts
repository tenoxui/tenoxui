import type { BaseProcessResult, CSSPropertyOrVariable } from '@tenoxui/core'
import type { Plugin as Plugify } from '@nousantx/plugify'
import type { StringRules, ArrayRules, ObjectRules } from './utilityRulesResult'
import type { CreateRegexpResult, Patterns, MatcherOptions } from './regexp'

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
  value: string | null
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

export type UtilityFunction = (
  context: UtilityContext
) => AllowedUtilityRules | UtilityResult | UtilityErrorResult

export interface UtilityConfig {
  property?: CSSPropertyOrVariable | CSSPropertyOrVariable[] | UtilityFunction
  value?: StringOrRegex
}

export type AcceptedUtility =
  | CSSPropertyOrVariable
  | CSSPropertyOrVariable[]
  | UtilityConfig
  | UtilityFunction

export type Utility = AcceptedUtility | [AcceptedPatterns | PatternConfig, AcceptedUtility]

export interface Utilities {
  [key: string]: Utility
}

export type ArrayPattern = (string | RegExp | (string | RegExp)[])[]

export type ArbitraryPattern = 'variable' | 'loose' | boolean | AcceptedPatterns

export type AcceptedPatterns = string | RegExp | ArrayPattern

export interface PatternConfig {
  arbitrary?: ArbitraryPattern
  patterns?: AcceptedPatterns
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

export type StringOrRegex = (string | RegExp)[]

export type MatcherCreationHooks =
  | ((result: { patterns: Patterns; matcher: RegExp }) => void)
  | null

export interface Config {
  plugins?: Plugin[]
  priority?: number
  prefixChars?: string[]
  utilitiesName?: string
  typeSafelist?: StringOrRegex
  valuePatterns?: StringOrRegex
  variantPatterns?: StringOrRegex
  matcherOptions?: MatcherOptions
  onMatcherCreated?: MatcherCreationHooks
}

export interface CreatorConfig {
  plugins?: Plugin[]
  priority?: number
  variants?: Variants
  utilities?: Utilities
  prefixChars?: string[]
  typeSafelist?: StringOrRegex
  valuePatterns?: StringOrRegex
  variantPatterns?: StringOrRegex
  matcherOptions?: MatcherOptions
  quickTransform?: boolean
  onMatcherCreated?: MatcherCreationHooks
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

type AddRegexTypeFn = (ctx?: StringOrRegex) => void
type AddUtilitiesFn = (utilities: Utilities) => void
type AddVariantsFn = (variants: Variants) => void

export interface RegexpPluginContext {
  addValuePatterns: AddRegexTypeFn
  addVariantPatterns: AddRegexTypeFn
  addTypeSafelist: AddRegexTypeFn
  addUtilities: AddUtilitiesFn
  addVariants: AddVariantsFn
  valuePatterns: StringOrRegex
  variantPatterns: StringOrRegex
  typeSafelist: StringOrRegex
  utilities: Utilities
  variants: Variants
  prefixChars: string[]
  matcherOptions: MatcherOptions
}

export interface PluginTypes {
  onInit: (ctx: RegexpPluginContext) => void
  processVariant: ProcessVariantFn
  processValue: ProcessValueFn
  processUtilities: ProcessUtilitiesFn
  process: ProcessFn
}

export type Plugin = Plugify<PluginTypes>

export interface PluginContext {
  variants?: Variants
  utilities?: {
    [utilitiesName: string]: Utilities
  }
}

export * from './regexp'
export * from './utilityRulesResult'
