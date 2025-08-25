import { CSSPropertyOrVariable } from '@tenoxui/core'

export type StringRulesWithValue =
  | `${CSSPropertyOrVariable}:${string}`
  | `rules:${CSSPropertyOrVariable}:${string}`

export type StringRules = CSSPropertyOrVariable | StringRulesWithValue

export type PropsWithComa = `props:${string}`

export type ObjectRules = Partial<{
  [K in CSSPropertyOrVariable | PropsWithComa]: string | [string, boolean?]
}>

export type ArrayRules = [
  CSSPropertyOrVariable | CSSPropertyOrVariable[] | StringRulesWithValue,
  string,
  boolean?
]
