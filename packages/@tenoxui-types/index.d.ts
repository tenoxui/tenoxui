export type CSSProperty = keyof CSSStyleDeclaration
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[]
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string }
}
export type Values = { [type: string]: { [value: string]: string } | string }
export type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string
  }
}
export type Aliases = Record<string, string>
export type Breakpoint = { name: string; min?: number; max?: number }
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
