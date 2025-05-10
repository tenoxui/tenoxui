import { TenoxUI as Moxie } from '@tenoxui/moxie'
import type { Property, Config as MoxieOptions } from '@tenoxui/moxie'
import type { Values, Classes, Aliases } from '@tenoxui/types'

export type Variants = {
  [name: string]: string
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
  customVariants: Property
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
