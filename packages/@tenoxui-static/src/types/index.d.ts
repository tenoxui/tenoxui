import type { Property, Values, Aliases, Classes, Breakpoint } from '@tenoxui/types';
export type ApplyStyleObject = {
    SINGLE_RULE?: string[];
} & {
    [key in Exclude<string, 'SINGLE_RULE'>]?: string | ApplyStyleObject;
};
export interface TenoxUIConfig {
    property: Property;
    values: Values;
    classes: Classes;
    breakpoints: Breakpoint[];
    aliases: Aliases;
}
export interface Config {
    property?: Property;
    values?: Values;
    classes?: Classes;
    aliases?: Aliases;
    breakpoints?: Breakpoint[];
    reserveClass?: string[];
    apply?: ApplyStyleObject;
}
export type ProcessedStyle = {
    className: string;
    cssRules: string | string[];
    value: string | null;
    prefix?: string;
};
export type MediaQueryRule = {
    mediaKey: string;
    ruleSet: string;
};
