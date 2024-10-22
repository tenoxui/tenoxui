import {
  Property,
  Classes,
  DefinedValue,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSProperty,
  CSSVariable
} from './types'
import { isObjectWithValue } from '../utils/valueObject'
import { ComputeValue } from './computeValue'

export class StyleHandler {
  private readonly htmlElement: HTMLElement
  private readonly styleAttribute: Property
  private readonly valueRegistry: DefinedValue
  private readonly classes: Classes
  private readonly computeValue: ComputeValue
  private readonly isInitialLoad: WeakMap<HTMLElement, boolean>

  constructor(element: HTMLElement, property: Property, values: DefinedValue, classes: Classes) {
    this.htmlElement = element
    this.styleAttribute = property
    this.valueRegistry = values
    this.classes = classes
    this.computeValue = new ComputeValue(this.htmlElement, this.styleAttribute, this.valueRegistry)
    this.isInitialLoad = new WeakMap<HTMLElement, boolean>()

    if (!this.isInitialLoad.has(element)) {
      this.isInitialLoad.set(element, true)
    }
  }

  // private isInitialLoad: boolean = true

  public addStyle(
    type: string, // shorthand prefixes or class name for Classes
    value?: string,
    unit?: string,
    secondValue?: string,
    secondUnit?: string,
    classProp?: CSSPropertyOrVariable // for Classes css property
  ): void {
    const properties = this.styleAttribute[type]
    const definedClass = this.classes

    // Use className from definedClass or Classes instead
    if (classProp && value && definedClass[classProp]) {
      this.computeValue.setCustomClass(classProp, value)
    }

    // No value included and is custom value property
    // e.g. { myBg: { property: 'background' value: 'blue'} }
    // use as _ <div class="myBg"></div> _ for `background: blue;``
    if (!value && isObjectWithValue(properties)) {
      value = properties.value
    }

    if (!value) return

    const resolvedValue = this.computeValue.valueHandler(type, value, unit || '')

    let resolvedSecondValue = ''
    if (secondValue) {
      resolvedSecondValue = this.computeValue.valueHandler(type, secondValue, secondUnit || '')
    }

    /**
     * This section will remove `transition` or `transitionDuration` property -
     * when the page loaded. It also ensures the element doesn't create unnecessary -
     * layout shift because tenoxui compute every styles at the same time when -
     * the page loaded.
     *
     * Ima struggle with this. Really :(
     */
    if (properties === 'transition' || properties === 'transitionDuration') {
      const isInitialLoad = this.isInitialLoad.get(this.htmlElement)

      if (isInitialLoad) {
        this.htmlElement.style.transition = 'none'
        this.htmlElement.style.transitionDuration = '0s'

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.htmlElement.style.transition = ''
            this.htmlElement.style.transitionDuration = ''
            if (properties === 'transition') {
              this.htmlElement.style.transition = resolvedValue
            } else {
              this.htmlElement.style.transitionDuration = resolvedValue
            }
            this.isInitialLoad.set(this.htmlElement, false)
          })
        })
      } else {
        if (properties === 'transition') {
          this.htmlElement.style.transition = resolvedValue
        } else {
          this.htmlElement.style.transitionDuration = resolvedValue
        }
      }
      return
    }

    // Other states for applying the style

    // CSS variable className
    if (type.startsWith('[') && type.endsWith(']')) {
      // Remove square brackets and split by commas
      const items = type
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())

      items.forEach((item) => {
        const attrProps = this.styleAttribute[item]

        if (item.startsWith('--')) {
          // If the item starts with "--", treat it as a CSS variable
          this.computeValue.setCssVar(item as CSSVariable, resolvedValue)
        } else if (attrProps) {
          if (typeof attrProps === 'object' && 'property' in attrProps) {
            this.computeValue.setCustomValue(
              attrProps as { property: GetCSSProperty; value?: string },
              resolvedValue,
              resolvedSecondValue
            )
          } else {
            this.computeValue.setDefaultValue(attrProps as CSSProperty, resolvedValue)
          }
        } else {
          this.computeValue.setDefaultValue(item as CSSProperty, resolvedValue)
        }
      })
    }
    // Custom value property handler
    else if (typeof properties === 'object' && 'property' in properties) {
      this.computeValue.setCustomValue(
        properties as { property: GetCSSProperty; value?: string },
        resolvedValue,
        resolvedSecondValue
      )
    }
    // Default value handler
    else if (properties) {
      this.computeValue.setDefaultValue(properties as CSSProperty, resolvedValue)
    }
  }
}
