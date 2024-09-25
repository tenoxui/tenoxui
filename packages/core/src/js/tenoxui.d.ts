/*!
 * tenoxui/core v1.1.0
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */
export interface MakeTenoxUIParams {
    element: HTMLElement | NodeListOf<HTMLElement>;
    property: Property;
    values?: DefinedValue;
    breakpoints?: Breakpoint[];
    classes?: Classes;
}
type CSSProperty = keyof CSSStyleDeclaration;
export type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];
export type Property = {
    [type: string]: GetCSSProperty | {
        property?: GetCSSProperty;
        value?: string;
    };
};
export type Breakpoint = {
    name: string;
    min?: number;
    max?: number;
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
