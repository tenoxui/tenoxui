// assigner.ts
import { Classes, Property, Breakpoint, Values } from '../types'
import { ComputeValue } from '../lib/computeValue'
import { StyleHandler } from '../lib/styleHandler'
import { Responsive } from '../lib/responsive'
import { Pseudo } from '../lib/pseudoClass'
import { ParseStyles } from '../lib/styleParser'

// Define a type for the required parameters
type RequiredTenoxUIParams = {
  element: HTMLElement
  property: Property
  values: Values
  breakpoints: Breakpoint[]
  classes: Classes
}

export function createTenoxUIComponents(context: RequiredTenoxUIParams) {
  const computeValue = new ComputeValue(context.element, context.property, context.values)
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
    context.classes,
    styler
  )
  const parseStyles = new ParseStyles(context.property, context.classes, styler, pseudo, responsive)
  return { computeValue, styler, responsive, pseudo, parseStyles }
}
