import {
  Property,
  Classes,
  Values,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSProperty,
  CSSVariable
} from '../types'
import { isObjectWithValue } from '../utils/valueObject'
import { ComputeValue } from './computeValue'

export class StyleHandler {
  private readonly computeValue: ComputeValue
  private readonly isInitialLoad: WeakMap<HTMLElement, boolean>

  constructor(
    private readonly element: HTMLElement,
    private readonly property: Property,
    private readonly values: Values,
    private readonly classes: Classes
  ) {
    this.computeValue = new ComputeValue(element, property, this.values)
    this.isInitialLoad = new WeakMap()

    if (element) {
      this.isInitialLoad.set(element, true)
    }
  }

  private handleTransitionProperty(property: string, value: string): void {
    const isInitial = this.isInitialLoad.get(this.element)

    if (!isInitial) {
      this.element.style[property as 'transition' | 'transitionDuration'] = value
      return
    }

    this.element.style.transition = 'none'
    this.element.style.transitionDuration = '0s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.element.style.transition = ''
        this.element.style.transitionDuration = ''
        this.element.style[property as 'transition' | 'transitionDuration'] = value
        this.isInitialLoad.set(this.element, false)
      })
    })
  }

  private handleCSSVariables(type: string, resolvedValue: string, secondValue: string): void {
    const items = type
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())

    items.forEach((item) => {
      const propertyDef = this.property[item]

      if (item.startsWith('--')) {
        this.computeValue.setCustomClass(item as CSSVariable, resolvedValue)
      } else if (propertyDef) {
        if (typeof propertyDef === 'object' && 'property' in propertyDef) {
          this.computeValue.setCustomValue(
            propertyDef as { property: GetCSSProperty; value?: string },
            resolvedValue,
            secondValue
          )
        } else {
          this.computeValue.setDefaultValue(propertyDef as CSSProperty, resolvedValue)
        }
      } else {
        this.computeValue.setDefaultValue(item as CSSProperty, resolvedValue)
      }
    })
  }

  public addStyle(
    type: string,
    value?: string,
    unit?: string,
    secondValue?: string,
    secondUnit?: string,
    classProp?: CSSPropertyOrVariable
  ): void {
    const propertyDef = this.property[type]

    // Handle class-based styles
    if (classProp && value && this.classes[classProp]) {
      this.computeValue.setCustomClass(classProp, value)
      return
    }

    // Handle custom value property without explicit value
    if (!value && isObjectWithValue(propertyDef)) {
      value = propertyDef.value
    }

    if (!value) return

    const resolvedValue = this.computeValue.valueHandler(type, value, unit || '')
    const resolvedSecondValue = secondValue
      ? this.computeValue.valueHandler(type, secondValue, secondUnit || '')
      : ''

    // Handle transition properties
    if (propertyDef === 'transition' || propertyDef === 'transitionDuration') {
      this.handleTransitionProperty(propertyDef, resolvedValue)
      return
    }

    // Handle CSS variables
    if (type.startsWith('[') && type.endsWith(']')) {
      this.handleCSSVariables(type, resolvedValue, resolvedSecondValue)
      return
    }

    // Handle custom value properties
    if (typeof propertyDef === 'object' && 'property' in propertyDef) {
      this.computeValue.setCustomValue(
        propertyDef as { property: GetCSSProperty; value?: string },
        resolvedValue,
        resolvedSecondValue
      )
      return
    }

    // Handle default properties
    if (propertyDef) {
      this.computeValue.setDefaultValue(propertyDef as CSSProperty, resolvedValue)
    }
  }
}
