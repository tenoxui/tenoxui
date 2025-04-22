import type { GetCSSProperty, Values, Classes } from '@tenoxui/types'

export type PropertyParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
  raw?: Parsed
}

export type PropertyParamValue =
  | GetCSSProperty
  | ((params: PropertyParams) => null | GetCSSProperty)

export type ValuePropType = string | ((params: PropertyParams) => string | null) | null

export type PropertyValue =
  | PropertyParamValue
  | {
      property?: PropertyParamValue
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
}

export type Parsed = null | (string | undefined)[]

export type ProcessedStyle = {
  className: string
  cssRules: string | string[] | null
  value: string | null
  prefix?: string | null
}

export type Results = ProcessedStyle & {
  raw?: Parsed
}
