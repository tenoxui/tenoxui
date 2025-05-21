import type { GetCSSProperty, Values, Classes } from '@tenoxui/types'

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

export type Property = {
  [type: string]: PropertyValue
}

export interface Config {
  property?: Property
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
