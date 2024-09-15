/*!
 * tenoxui/core v1.0.5
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */
interface MakeTenoxUIParams {
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
type Breakpoint = {
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
declare class makeTenoxUI {
    /**
     * WARNING: Entering this hell
     * is like stepping into a maze with no exit.
     * Good luck :)
     */
    private readonly htmlElement;
    private readonly styleAttribute;
    private readonly valueRegistry;
    private readonly breakpoints;
    private readonly classes;
    constructor({ element, property, values, breakpoints, classes }: MakeTenoxUIParams);
    useDOM(): void;
    private updateStyles;
    private scanAndApplyStyles;
    private setupClassObserver;
    private valueHandler;
    /**
     * Handle default CSS variable style
     *
     * Instead of using CSS property directly, use `setProperty` -
     * to set variable and value to the element.
     */
    private setCssVar;
    /**
     * Handle custom value property.
     *
     * Style handler for custom value field on `this.styleAttribute` -
     * if available.
     *
     * It will replace every `{value}` string with inputted value. Example :
     *
     * px: {
     *   property: 'padding',
     *   value: '10px {value} 1rem {value}'
     * }
     *
     * Usage:
     * `px-2rem` _ the output style will be `10px 2rem 1rem 2rem`.
     *
     */
    private setCustomValue;
    private setDefaultValue;
    private setCustomClass;
    private isObjectWithValue;
    private matchBreakpoint;
    private camelToKebab;
    private handleResponsive;
    private getPropName;
    private getInitialValue;
    private revertStyle;
    /**
     * Handle pseudo class name.
     *
     * Imitating something like hover or focus effect with javascript. With this setup -
     * it is possible to correctly imitate pseudo event, but with less extensibility.
     *
     * To do this, we need to get the initial value of the element before the event -
     * is handled. And after the event is no longer available, we will -
     * revert the style, we will re-apply the initial value back to the element.
     *
     * Example :
     * { property: { bg: 'backgroundColor' } }
     *
     * <div class="bg-red hover:bg-blue"></div>
     *
     * The initial value of the element is `red`, when the hover event is available -
     * the current `background-color` will replaced with `blue`, and will back -
     * to `red` after hover event is done.
     *
     */
    private pseudoHandler;
    private classNameRegEx;
    private parseClassName;
    private getParentClass;
    private applyPrefixedStyle;
    private parseDefaultStyle;
    private handlePredefinedStyle;
    private handleCustomClass;
    addStyle(type: string, value?: string, unit?: string, classProp?: string): void;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
export { makeTenoxUI };
