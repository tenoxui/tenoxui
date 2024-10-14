import { Property, DefinedValue, GetCSSProperty, CSSPropertyOrVariable } from './types'

export class ComputeValue {
  private readonly htmlElement: HTMLElement
  private readonly styleAttribute: Property
  private readonly valueRegistry: DefinedValue

  constructor(element: HTMLElement, properties: Property, values: DefinedValue) {
    this.htmlElement = element
    this.styleAttribute = properties
    this.valueRegistry = values
  }

  public valueHandler(type: string, value: string, unit: string): string {
    const properties = this.styleAttribute[type]
    const registryValue = this.valueRegistry[value] as string
    let resolvedValue = registryValue || value

    if ((value + unit).length !== value.toString().length && unit !== '') {
      resolvedValue = value
    } else if (
      // is custom value property
      typeof properties === 'object' &&
      // has `value` field
      'value' in properties &&
      properties.value &&
      !properties.value.includes('{value}') // but got no `{value}` string
    ) {
      return properties.value // use its value without needs to add any value
    }
    // CSS variable property
    else if (resolvedValue.startsWith('$')) {
      return `var(--${resolvedValue.slice(1)})`
    }
    // Custom value
    else if (resolvedValue.startsWith('[') && resolvedValue.endsWith(']')) {
      const solidValue = resolvedValue
        .slice(1, -1)
        // .replace(/\\_/g, ' ') // old with `\_` instead of `_`
        .replace(/_/g, ' ')
      return solidValue.startsWith('--') ? `var(${solidValue})` : solidValue
    }

    // Use custom value from valueRegistry
    const typeRegistry = this.valueRegistry[type]

    if (typeof typeRegistry === 'object') {
      resolvedValue = typeRegistry[value] || resolvedValue
    }
    return resolvedValue + unit
  }

  /**
   * Handle default CSS variable style
   *
   * Instead of using CSS property directly, use `setProperty` -
   * to set variable and value to the element.
   */
  public setCssVar(variable: CSSPropertyOrVariable, value: string): void {
    this.htmlElement.style.setProperty(variable as string, value)
  }

  public setCustomValue(
    properties: { property: GetCSSProperty; value?: string },
    resolvedValue: string
  ): void {
    const { property, value } = properties
    let finalValue = resolvedValue

    if (value) {
      finalValue = value.replace(/{value}/g, resolvedValue)
    }

    // handle single property or array of property (multiple properties)
    if (typeof property === 'string') {
      // CSS variable or CSS property
      if (property.startsWith('--')) {
        this.setCssVar(property, finalValue)
      } else {
        ;(this.htmlElement.style as any)[property] = finalValue
      }
    } else if (Array.isArray(property)) {
      property.forEach((prop) => {
        if (typeof prop === 'string' && prop.startsWith('--')) {
          this.setCssVar(prop, finalValue)
        } else {
          ;(this.htmlElement.style as any)[prop] = finalValue
        }
      })
    }
  }

  // Handle default property and value
  public setDefaultValue(properties: GetCSSProperty, resolvedValue: string): void {
    const arrayOfProperty = Array.isArray(properties) ? properties : [properties]

    arrayOfProperty.forEach((property) => {
      if ((property as string).startsWith('--')) {
        this.setCssVar(property, resolvedValue)
      } else {
        ;(this.htmlElement.style as any)[property] = resolvedValue
      }
    })
  }

  // Custom class or Classes's utility.
  public setCustomClass(propKey: CSSPropertyOrVariable, value: string): void {
    if ((propKey as string).startsWith('--')) {
      this.setCssVar(propKey, value)
    } else {
      ;(this.htmlElement.style as any)[propKey] = value
    }
  }
}
