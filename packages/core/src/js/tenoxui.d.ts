/*!
 * tenoxui/core v1.0.4
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
interface MakeTenoxUIParams {
    element: HTMLElement | NodeListOf<HTMLElement>;
    property: Property;
    values?: DefinedValue;
    breakpoint?: Breakpoint[];
    classes?: Classes;
}
type CSSProperty = keyof CSSStyleDeclaration;
type CSSPropertyOrVariable = CSSProperty | `--${string}`;
type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[];
type Property = {
    [type: string]: GetCSSProperty | {
        property?: GetCSSProperty;
        value?: string;
    };
};
type Breakpoint = {
    name: string;
    min?: number;
    max?: number;
};
type DefinedValue = {
    [type: string]: {
        [value: string]: string;
    } | string;
};
type Classes = {
    [property in CSSPropertyOrVariable]?: {
        [className: string]: string;
    };
};
declare class makeTenoxUI {
    constructor({ element, property, values, breakpoint, classes }: MakeTenoxUIParams);
    private readonly htmlElement;
    private readonly styleAttribute;
    private readonly valueRegistry;
    private readonly breakpoints;
    private readonly classes;
    private scanAndApplyStyles;
    private updateStyles;
    private setupClassObserver;
    private valueHandler;
    private setCssVar;
    private setCustomValue;
    private setDefaultValue;
    private setCustomClass;
    private matchBreakpoint;
    private camelToKebab;
    private handleResponsive;
    private getPropName;
    private getInitialValue;
    private revertStyle;
    private pseudoHandler;
    private parseClassName;
    private getParentClass;
    private isObjectWithValue;
    private parseDefaultStyle;
    private applyPrefixedStyle;
    private handlePredefinedStyle;
    private handleCustomClass;
    addStyle(type: string, value?: string, unit?: string, classProp?: string): void;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
