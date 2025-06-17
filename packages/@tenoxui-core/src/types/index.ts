import { Core as Moxie } from '../lib/core'
import type { GetCSSProperty, Values, Classes, Aliases } from '@tenoxui/types'

export type PropertyParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
  raw?: Parsed
}

export type DirectValue = `value:${string}`

export type PropertyParamValue =
  | GetCSSProperty
  | DirectValue
  | ((params: PropertyParams) => null | GetCSSProperty | DirectValue | Partial<ProcessedStyle>)

export type ValuePropType = string | string[] | ((params: PropertyParams) => string | null) | null

export type PropertyValue =
  | PropertyParamValue
  | {
      property?: PropertyParamValue
      value?: ValuePropType
      group?: string
    }

export type Property<T = PropertyValue> = {
  [type: string]: T
}

export interface MoxieConfig {
  utilities?: Property
  values?: Values
  classes?: Classes
  prefixChars?: string[]
}

export type Parsed = null | (string | undefined)[]

export type ProcessedStyle = {
  className: string
  cssRules: string | string[] | null
  value: string | null
  prefix?: string | null
  isCustom?: boolean | null
}

export type Results = ProcessedStyle & {
  raw?: Parsed
}

export type VariantParamValue =
  | string
  | DirectValue
  | ((params: PropertyParams) => null | string | DirectValue)

export type ValueVariantType =
  | string
  | string[]
  | ((params: PropertyParams) => string | null)
  | null

export type VariantValue =
  | VariantParamValue
  | {
      property?: VariantParamValue
      value?: ValueVariantType
    }

export type Variants = {
  [variantName: string]: VariantValue
}

export type Breakpoints = {
  [bpName: string]: string
}

export interface Config {
  utilities: Property
  values: Values
  classes: Classes
  variants: Variants
  breakpoints: Breakpoints
  aliases: Aliases
  tenoxui: typeof Moxie
  tenoxuiOptions: MoxieConfig
  reservedVariantChars: string[]
  prefixLoaderOptions: MoxieConfig
  plugins: Plugin[]
}

export type Result =
  | {
      className: string
      cssRules: string | string[] | null
      value: string | null
      isImportant: boolean
      variants: null | { name: string; data: string | null }
      raw: null | (string | undefined)[]
    }
  | {
      className: string
      rules: { cssRules: string | string[] | null; value: string | null; isImportant: boolean }[]
      isImportant: boolean
      prefix: null | { name: string; data: string | null }
      variants:
        | null
        | {
            className: string
            rules: {
              cssRules: string | string[] | null
              value: string | null
              isImportant: boolean
            }[]
            variant: string
          }[]
      raw: null | (string | undefined)[]
    }

export interface Plugin<ResultType = Result> {
  name: string
  transform?: (param: Partial<ResultType>) => Partial<ResultType>
  processClassName?: (param: {
    className: string
    prefix?: string
    variant?: string
  }) => Partial<ResultType>
  processVariant?: (variant: string) => string
}
