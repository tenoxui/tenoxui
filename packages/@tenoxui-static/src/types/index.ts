import type { GetCSSProperty, Values, Aliases, Classes, Breakpoint } from '@tenoxui/types'

export type ApplyStyleObject = {
  SINGLE_RULE?: string[]
} & {
  [key in Exclude<string, 'SINGLE_RULE'>]?: string | ApplyStyleObject
}

export type PropertyFor = {
  for: string
  syntax: '<size>' | '<number>' | '<value>' | RegExp
  property: GetCSSProperty
  value?: string
}

export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string } | PropertyFor[]
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
