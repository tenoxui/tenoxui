// Type declarations for TenoxUI

declare module "tenoxui" {
  // Define the property type
  export interface Property {
    [key: string]: string | string[];
  }

  // Define the Classes and AllClasses variables
  export let Classes: string[];
  export let AllClasses: NodeListOf<HTMLElement>;

  // Define the newProp class
  export class newProp {
    constructor(name: string, values: string[]);
    tryAdd(): void;
  }

  // Define the makeTenoxUI class
  export class makeTenoxUI {
    constructor(element: HTMLElement);
    applyStyle(type: string, value: string, unit: string): void;
    applyStyles(className: string): void;
    applyMultiStyles(styles: string): void;
  }

  // Define the makeStyle function
  export function makeStyle(
    selector: string,
    styles: string | Record<string, string>
  ): void;

  // Define the defineProps function
  export function defineProps(
    propsObject: Record<string, string | string[]>
  ): void;

  // Define the makeStyles function
  export function makeStyles(
    stylesObject: Record<string, string | Record<string, string>>
  ): Record<string, string | Record<string, string>>;

  // Define the applyHover function
  export function applyHover(
    selector: string,
    notHover: string,
    isHover: string,
    styles?: string
  ): void;

  // Define the applyHovers function
  export function applyHovers(hovers: object): void;

  // Define the tenoxui function
  export default function tenoxui(): void;
}
