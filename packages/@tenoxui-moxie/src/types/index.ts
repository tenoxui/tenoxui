import type { GetCSSProperty, Values, Aliases, Classes } from '@tenoxui/types'

export type PropertyParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
}

export type ValueParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
  property?: PropertyValue
}

export type PropertyParamValue = GetCSSProperty | ((params: PropertyParams) => GetCSSProperty)

export type ValuePropType = string | ((params: ValueParams) => string | null) | null

export type PropertyValue =
  | PropertyParamValue
  | {
      property?: PropertyValue
      value?: ValuePropType
      group?: string
    }

export type Property = {
  [type: string]: PropertyValue
}

export interface Config {
  property?: Property
  values?: Values
  classes?: Classes
  aliases?: Aliases
}

export type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string | null
}
