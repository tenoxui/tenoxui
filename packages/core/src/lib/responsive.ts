import { Property, Classes, Breakpoint, CSSPropertyOrVariable } from './types'
import { StyleHandler } from './styleHandler'
import { isObjectWithValue } from '../utils/valueObject'

export class Responsive {
  private readonly htmlElement: HTMLElement
  private readonly styleAttribute: Property
  private readonly classes: Classes
  private readonly breakpoints: Breakpoint[]
  private readonly styler: StyleHandler

  constructor(
    element: HTMLElement,
    breakpoints: Breakpoint[],
    property: Property,
    classes: Classes,
    styler: StyleHandler
  ) {
    this.htmlElement = element
    this.styleAttribute = property
    this.classes = classes
    this.breakpoints = breakpoints

    this.styler = styler
  }

  private matchBreakpoint(
    bp: Breakpoint, // breakpoint object
    prefix: string, // className prefix
    width: number // current screen size
  ): boolean {
    if (bp.name !== prefix) return false
    if (bp.min !== undefined && bp.max !== undefined) {
      return width >= bp.min && width <= bp.max
    }
    if (bp.min !== undefined) return width >= bp.min
    if (bp.max !== undefined) return width <= bp.max
    return false
  }

  public handleResponsive(
    breakpointPrefix: string,
    type: string,
    value: string,
    unit: string,
    secondValue?: string,
    secondUnit?: string,
    propKey?: CSSPropertyOrVariable
  ): void {
    const properties = this.styleAttribute[type]

    // Handle screen resizing
    const handleResize = () => {
      const windowWidth = window.innerWidth
      const matchPoint = this.breakpoints.find((bp) =>
        this.matchBreakpoint(bp, breakpointPrefix, windowWidth)
      )

      // If className's prefix match current screen size
      if (matchPoint) {
        if (isObjectWithValue(properties)) {
          this.styler.addStyle(type)
        } else if (propKey && this.classes[propKey]) {
          this.styler.addStyle(type, value, unit, secondValue, secondUnit, propKey)
        } else {
          this.styler.addStyle(type, value, unit, secondValue, secondUnit)
        }
      } else {
        if (this.htmlElement) {
          this.htmlElement.style[type as any] = ''
        }
      }
    }

    // Initialize style from current screen size
    handleResize()
    window.addEventListener('resize', handleResize)
  }
}
