/*!
 * tenoxui/css v0.9.0-alpha.7 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
type Property = {
    [key: string]: string | string[];
};
declare let allProps: Property, Classes: String[], AllClasses: NodeListOf<HTMLElement>;
declare class makeTenoxUI {
    element: HTMLElement;
    styles: Property;
    constructor(element: HTMLElement, styledProps?: Property);
    applyStyle(type: string, value: string, unit: string): void;
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
declare function use(...customPropsArray: object[]): void;
declare function tenoxui(...customPropsArray: object[]): void;
