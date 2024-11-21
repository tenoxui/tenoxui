export type CSSProperty = keyof CSSStyleDeclaration
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[]
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string }
}
export type DefinedValue = { [type: string]: { [value: string]: string } | string }
export type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string
  }
}
export type Breakpoint = { name: string; min?: number; max?: number }