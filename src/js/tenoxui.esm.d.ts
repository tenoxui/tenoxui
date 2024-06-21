/*!
 * TenoxUI CSS v0.11.0-alpha.3
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
interface TypeObjects {
    [key: string]: string | TypeObjects;
}
type Styles = TypeObjects | Record<string, TypeObjects[]>;
type Property = {
    [key: string]: string | string[];
};
type Breakpoint = {
    name: string;
    min?: number;
    max?: number;
}[];
type DefinedValue = {
    [key: string]: string;
};
declare class makeTenoxUI {
    private ELEMENT;
    private STYLES;
    constructor(element: HTMLElement, styledProps?: Property);
    private camelToKebab;
    addStyle(type: string, value: string, unit: string): void;
    private handleResponsive;
    private pseudoHandler;
    private pseudoObjectHandler;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
declare function makeStyle(selector: string, styles: string): void;
declare function makeStyles(...stylesObjects: Styles[]): Styles;
declare function use(customConfig: {
    breakpoint?: Breakpoint;
    property?: Property[];
    values?: DefinedValue;
}): void;
declare function tenoxui(...customPropsArray: Property[]): void;
export { makeStyle, makeStyles, makeTenoxUI, use, tenoxui as default };
