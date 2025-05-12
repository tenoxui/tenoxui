import { TenoxUI as Moxie } from '@tenoxui/moxie'
import type { Property, Config as MoxieOptions } from '@tenoxui/moxie'
import type { Values, Classes, Aliases } from '@tenoxui/types'

export type VariantParams = {
  key?: string | null
  value?: string
  unit?: string
  raw?: (string | undefined)[]
}

export type DirectValue = `value:${string}`

export type VariantParamValue =
  | string
  | DirectValue
  | ((params: VariantParams) => null | string | DirectValue)

export type ValueVariantType = string | string[] | ((params: VariantParams) => string | null) | null

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
export interface TenoxUIConfig {
  property?: Property
  values?: Values
  classes?: Classes
}
export interface Config {
  property: Property
  values: Values
  classes: Classes
  variants: Variants
  breakpoints: Breakpoints
  aliases: Aliases
  tenoxui: typeof Moxie
  tenoxuiOptions: MoxieOptions
}
export type Result =
  | {
      className: string
      cssRules: string | string[] | null
      value: string | null
      variants: null | { name: string; data: string | null }
      raw: null | (string | undefined)[]
    }
  | {
      className: string
      rules: { cssRules: string | string[] | null; value: string | null }[]
      prefix: null | { name: string; data: string | null }
      variants:
        | null
        | {
            className: string
            rules: { cssRules: string | string[] | null; value: string | null }[]
            variant: string
          }[]
      raw: null | (string | undefined)[]
    }
export type {
  PropertyParamValue,
  PropertyParams,
  ValuePropType,
  PropertyValue,
  Property,
  Config as MoxieConfig,
  Parsed,
  ProcessedStyle
} from '@tenoxui/moxie'
