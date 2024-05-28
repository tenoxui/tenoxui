/*!
 * TenoxUI CSS v0.10.0
 * Licensed under MIT (https://github.com/tenoxui/css/blob/main/LICENSE)
 */
type Property = {
  [key: string]: string | string[];
};
type Breakpoint = {
  name: string;
  min?: number;
  max?: number;
}[];
declare let allProps: Property;
declare class makeTenoxUI {
  private element;
  private styles;
  constructor(element: HTMLElement, styledProps?: Property);
  private camelToKebab;
  addStyle(type: string, value: string, unit: string): void;
  private handleResponsive;
  private pseudoStyles;
  applyStyles(className: string): void;
  applyMultiStyles(styles: string): void;
}
declare function makeStyle(selector: string, styles: string): void;
interface TypeObjects {
  [key: string]: string | TypeObjects;
}
type Styles = TypeObjects | Record<string, TypeObjects[]>;
declare function makeStyles(...stylesObjects: Styles[]): Styles;
declare function use(customConfig: { breakpoint?: Breakpoint; property?: Property[] }): void;
declare function tenoxui(...customPropsArray: Property[]): void;
export { allProps, makeStyle, makeStyles, makeTenoxUI, use, tenoxui as default };
