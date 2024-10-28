import { Property, Classes, Breakpoint, CSSPropertyOrVariable } from './types'
import { StyleHandler } from './styleHandler'
import { isObjectWithValue } from '../utils/valueObject'

export class Responsive {
  constructor(
    private element: HTMLElement,
    private breakpoints: Breakpoint[],
    private property: Property,
    private classes: Classes,
    private styler: StyleHandler
  ) {}

  private matchBreakpoint({ name, min, max }: Breakpoint, prefix: string, width: number): boolean {
    if (name !== prefix) return false

    if (min !== undefined && max !== undefined) return width >= min && width <= max
    if (min !== undefined) return width >= min
    if (max !== undefined) return width <= max

    return false
  }

  public handleResponsive(
    breakpointPrefix: string,
    type: string,
    value: string,
    unit: string,
    secondValue = '',
    secondUnit = '',
    propKey?: CSSPropertyOrVariable
  ): void {
    const properties = this.property[type]

    const applyStyle = () => {
      if (isObjectWithValue(properties)) {
        this.styler.addStyle(type)
      } else if (propKey && this.classes[propKey]) {
        this.styler.addStyle(type, value, unit, secondValue, secondUnit, propKey)
      } else {
        this.styler.addStyle(type, value, unit, secondValue, secondUnit)
      }
    }

    const handleResize = () => {
      const windowWidth = window.innerWidth
      const matchPoint = this.breakpoints.find((bp) =>
        this.matchBreakpoint(bp, breakpointPrefix, windowWidth)
      )

      matchPoint ? applyStyle() : this.element?.style.setProperty(type, '')
    }

    // Initialize and set up resize listener
    handleResize()
    window.addEventListener('resize', handleResize)
  }
}
