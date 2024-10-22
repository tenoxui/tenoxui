export type CSSProperty = keyof CSSStyleDeclaration
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[]
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string }
}
