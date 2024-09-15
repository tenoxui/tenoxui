/*!
 * tenoxui/core v1.0.5
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */
type CSSProperty = keyof CSSStyleDeclaration;
export type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];
export type Property = {
    [type: string]: GetCSSProperty | {
        property?: GetCSSProperty;
        value?: string;
    };
};
export type DefinedValue = {
    [type: string]: {
        [value: string]: string;
    } | string;
};
export type Classes = {
    [property in CSSPropertyOrVariable]?: {
        [className: string]: string;
    };
};
export {};
