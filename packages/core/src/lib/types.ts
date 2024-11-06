// makeTenoxUI constructor param
export interface MakeTenoxUIParams {
  element: HTMLElement
  property?: Property
  values?: DefinedValue
  breakpoints?: Breakpoint[]
  classes?: Classes
}

// CSS properties mapping
export type CSSProperty = keyof CSSStyleDeclaration
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[]

// type and property
export type Property = {
  [type: string]: GetCSSProperty | { property?: GetCSSProperty; value?: string }
}

// breakpoint
export type Breakpoint = { name: string; min?: number; max?: number }

// value registry
export type DefinedValue = { [type: string]: { [value: string]: string } | string }

// defined class name from exact CSS property
export type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string
  }
}

export interface CoreConfig {
  property?: Property
  values?: DefinedValue
  breakpoints?: Breakpoint[]
  classes?: Classes
}