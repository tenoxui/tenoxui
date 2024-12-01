import { Classes, Property, Breakpoint, Values, Aliases } from '../dist/types'
import { createTenoxUIComponents } from '../dist/utils/assigner'

declare module '@tenoxui/core/full' {
  export interface MakeTenoxUIParams {
    element: HTMLElement
    property?: Property
    values?: Values
    breakpoints?: Breakpoint[]
    classes?: Classes
    aliases?: Aliases
    attributify?: boolean
    attributifyPrefix?: string
    attributifyIgnore?: string[]
  }
  export type CoreConfig = Omit<MakeTenoxUIParams, 'element'>
  export declare class MakeTenoxUI {
    readonly element: HTMLElement
    readonly property: Property
    readonly values: Values
    readonly breakpoints: Breakpoint[]
    readonly classes: Classes
    readonly aliases: Aliases
    private attributify
    private attributifyPrefix
    private attributifyIgnore
    private attributifyHandler
    readonly create: ReturnType<typeof createTenoxUIComponents>
    constructor({
      element,
      property,
      values,
      breakpoints,
      classes,
      aliases,
      attributify,
      attributifyPrefix,
      attributifyIgnore
    }: MakeTenoxUIParams)
    private initAttributifyHandler
    useDOM(element?: HTMLElement): void
    private handleAttributify
    private parseStylePrefix
    applyStyles(className: string, targetElement?: HTMLElement): void
    private createComponentInstance
    applyMultiStyles(styles: string, targetElement?: HTMLElement): void
    enableAttributify(selector?: string): void
    private observeNewElements
  }
  export * from '../dist/types'
}
