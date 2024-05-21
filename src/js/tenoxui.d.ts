/*!
 * tenoxui/css v0.10.0 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
type Property = {
    [key: string]: string | string[];
};
type Breakpoint = {
    name: string;
    min?: number;
    max?: number;
}[];
type Classes = String[];
type AllClasses = NodeListOf<HTMLElement>;
declare let allProps: Property, breakpoints: Breakpoint, classes: Classes, allClasses: AllClasses;
declare class makeTenoxUI {
    private element;
    private styles;
    constructor(element: HTMLElement, styledProps?: Property);
    applyStyle(type: string, value: string, unit: string): void;
    private applyResponsiveStyles;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
declare function makeStyle(selector: string, styles: string | Record<string, string>): void;
interface typeObjects {
    [key: string]: string | typeObjects;
}
type Styles = typeObjects | Record<string, typeObjects>;
declare function makeStyles(...stylesObjects: Styles[]): Styles;
declare function applyHovers(hovers: object): void;
declare function use(customConfig: {
    breakpoint?: Breakpoint;
    property?: Property[];
}): void;
declare function tenoxui(...customPropsArray: object[]): void;
