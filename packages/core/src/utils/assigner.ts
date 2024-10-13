import {
  Classes,
  Property,
  MakeTenoxUIParams,
  Breakpoint,
  DefinedValue,
  GetCSSProperty
} from '../lib/types'
import { Observer } from '../lib/observer'
import { Parser } from '../lib/classNameParser'
import { ComputeValue } from '../lib/computeValue'
import { StyleHandler } from '../lib/styleHandler'
import { Responsive } from '../lib/responsive'
import { Pseudo } from '../lib/pseudoClass'
import { ParseStyles } from '../lib/styleParser'

export class TenoxUIContext {
  readonly element: HTMLElement
  readonly property: Property
  readonly values: DefinedValue
  readonly breakpoints: Breakpoint[]
  readonly classes: Classes

  constructor({
    element,
    property = {},
    values = {},
    breakpoints = [],
    classes = {}
  }: MakeTenoxUIParams) {
    this.element = element instanceof HTMLElement ? element : element[0]
    this.property = property
    this.values = values
    this.breakpoints = breakpoints
    this.classes = classes
  }
}

export function createTenoxUIComponents(context: TenoxUIContext) {
  const parser = new Parser(context.property)
  const computeValue = new ComputeValue(
    context.element,
    context.property,
    context.values,
    context.classes
  )
  const styler = new StyleHandler(
    context.element,
    context.property,
    context.values,
    context.classes
  )
  const pseudo = new Pseudo(
    context.element,
    context.property,
    context.classes,
    computeValue,
    styler
  )
  const responsive = new Responsive(
    context.element,
    context.breakpoints,
    context.property,
    context.classes,
    styler
  )
  const observer = new Observer(context.element)
  const parseStyles = new ParseStyles(
    context.property,
    context.values,
    context.classes,
    styler,
    pseudo,
    responsive
  )

  return { parser, computeValue, styler, responsive, observer, pseudo, parseStyles }
}
