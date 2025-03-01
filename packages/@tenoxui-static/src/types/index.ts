import type { GetCSSProperty, Values, Aliases, Classes, Breakpoint } from '@tenoxui/types'

export type ApplyStyleObject = {
  SINGLE_RULE?: string[]
} & {
  [key in Exclude<string, 'SINGLE_RULE'>]?: string | ApplyStyleObject
}

type PropertyParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
}

type ValueParams = {
  key?: string | null
  value?: string
  unit?: string
  secondValue?: string
  secondUnit?: string
}

type PropertyValue = GetCSSProperty | ((params: PropertyParams) => GetCSSProperty)

type ValuePropType = string | ((params: ValueParams) => string)

export type PropertyFor = {
  for: string
  syntax: '<size>' | '<number>' | '<value>' | RegExp
  property: PropertyValue
  value?: ValuePropType
}

export type Property = {
  [type: string]:
    | PropertyValue
    | {
        property?: PropertyValue
        value?: ValuePropType
      }
    | PropertyFor[]
}

export type CoreConfig = {
  property?: Property
  values?: Values
  breakpoints?: Breakpoint[]
  classes?: Classes
  aliases?: Aliases
}
export type CoreConfigFull = {
  property?: Property
  values?: Values
  breakpoints?: Breakpoint[]
  classes?: Classes
  aliases?: Aliases
  attributify?: boolean
  attributifyPrefix?: string
  attributifyIgnore?: string[]
}

export interface TenoxUIConfig {
  property: Property
  values: Values
  classes: Classes
  breakpoints: Breakpoint[]
  aliases: Aliases
}

export interface Config {
  property?: Property
  values?: Values
  classes?: Classes
  aliases?: Aliases
  breakpoints?: Breakpoint[]
  reserveClass?: string[]
  apply?: ApplyStyleObject
}

export type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string
}

export type MediaQueryRule = {
  mediaKey: string
  ruleSet: string
}
