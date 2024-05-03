/*!
 * tenoxui/css v0.8.0 (https://github.com/tenoxui/css)
 * Copyright (c) 2024 NOuSantx
 * Licensed under the MIT License (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
declare let Classes: String[], AllClasses: NodeListOf<HTMLElement>;
declare class makeTenoxUI {
    element: HTMLElement;
    styles: any;
    constructor(element: HTMLElement);
    applyStyle(type: string, value: string, unit: string): void;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
declare function makeStyle(selector: string, styles: string | Record<string, string>): void;
declare function defineProps(...propsObjects: Record<string, string | string[]>[]): void;
type StylesObject = Record<string, string | Record<string, string>>;
declare function makeStyles(...stylesObjects: StylesObject[]): StylesObject;
declare function applyHovers(hovers: object): void;
declare function tenoxui(): void;
export { Classes, AllClasses, defineProps, makeStyle, makeStyles, applyHovers, makeTenoxUI, };
export default tenoxui;
