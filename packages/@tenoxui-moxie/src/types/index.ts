import type { GetCSSProperty, Values, Aliases, Classes } from '@tenoxui/types'

export type ApplyStyleObject = {
  SINGLE_RULE?: string[]
} & {
  [key in Exclude<string, 'SINGLE_RULE'>]?: string | ApplyStyleObject
}

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
  property?: GetCSSProperty
}

export type PropertyValue = GetCSSProperty | ((params: PropertyParams) => GetCSSProperty)

export type ValuePropType = string | ((params: ValueParams) => string | null) | null

export type Property = {
  [type: string]:
    | PropertyValue
    | {
        classNameSuffix?: string
        property?: PropertyValue
        value?: ValuePropType
      }
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
