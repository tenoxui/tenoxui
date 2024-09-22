type CSSProperty = keyof CSSStyleDeclaration;
type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string };
};
export const defaultProps: Property;
