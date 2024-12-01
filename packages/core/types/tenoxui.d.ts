import { Classes, Property, Breakpoint, Values, Aliases } from '../dist/types';
import { createTenoxUIComponents } from '../dist/utils/assigner';
export interface MakeTenoxUIParams {
    element: HTMLElement;
    property?: Property;
    values?: Values;
    breakpoints?: Breakpoint[];
    classes?: Classes;
    aliases?: Aliases;
}
export type CoreConfig = Omit<MakeTenoxUIParams, 'element'>;
export declare class MakeTenoxUI {
    readonly element: HTMLElement;
    readonly property: Property;
    readonly values: Values;
    readonly breakpoints: Breakpoint[];
    readonly classes: Classes;
    readonly aliases: Aliases;
    readonly create: ReturnType<typeof createTenoxUIComponents>;
    constructor({ element, property, values, breakpoints, classes, aliases }: MakeTenoxUIParams);
    useDOM(element?: HTMLElement): void;
    private parseStylePrefix;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
}
export * from '../dist/types';
