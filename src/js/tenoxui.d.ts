/*!
 * TenoxUI CSS v0.11.0-alpha.4
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
interface TypeObjects {
    [key: string]: string | TypeObjects;
}
interface CustomValue {
    [key: string]: {
        property?: string;
        customValue?: string;
    };
}
type Styles = TypeObjects | Record<string, TypeObjects[]>;
type Property = {
    [key: string]: string | string[] | {
        property?: string | string[];
        customValue?: string;
    };
};
type Breakpoint = {
    name: string;
    min?: number;
    max?: number;
}[];
type Classes = String[];
type AllClasses = NodeListOf<HTMLElement>;
type StylesRegistry = Record<string, string[]>;
type DefinedValue = {
    [key: string]: string;
};
declare let ALL_PROPS: Property;
declare let BREAKPOINTS: Breakpoint;
declare let CLASSES: Classes;
declare let ALL_CLASSES: AllClasses;
declare let VALUE_REGISTRY: DefinedValue;
declare let GLOBAL_STYLES_REGISTRY: string | Styles;
declare class makeTenoxUI {
    private ELEMENT;
    private STYLES;
    constructor(element: HTMLElement, styledProps?: Property);
    addStyle(type: string, value: string, unit: string): void;
    private handleResponsive;
    private camelToKebab;
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
