import {
  Property,
  DefinedValue,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSVariable,
  CSSProperty
} from './types'

export class ComputeValue {
  constructor(
    private readonly element: HTMLElement,
    private readonly properties: Property,
    private readonly values: DefinedValue
  ) {}

  public valueHandler(type: string, value: string, unit: string): string {
    const property = this.properties[type]
    const registryValue = this.values[value] as string
    let resolvedValue = registryValue || value

    // Early return for simple unit case
    if ((value + unit).length !== value.toString().length && unit !== '') {
      return value + unit
    }

    // Handle predefined value in property
    if (
      typeof property === 'object' &&
      'value' in property &&
      property.value &&
      !property.value.includes('{0}')
    ) {
      return property.value
    }

    // Handle special value formats
    if (resolvedValue.startsWith('$')) {
      return `var(--${resolvedValue.slice(1)})`
    }

    if (resolvedValue.startsWith('[') && resolvedValue.endsWith(']')) {
      const cleanValue = resolvedValue.slice(1, -1).replace(/_/g, ' ')
      return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
    }

    // Check type registry
    const typeRegistry = this.values[type]
    if (typeof typeRegistry === 'object') {
      resolvedValue = typeRegistry[value] || resolvedValue
    }

    return resolvedValue + unit
  }

  public setStyle(property: CSSPropertyOrVariable, value: string): void {
    ;(property as CSSVariable).startsWith('--')
      ? this.element.style.setProperty(property as CSSVariable, value)
      : ((this.element.style as any)[property as CSSProperty] = value)
  }

  public setCustomValue(
    { property, value: template }: { property: GetCSSProperty; value?: string },
    value: string,
    secondValue: string = ''
  ): void {
    const finalValue = template
      ? template.replace(/\{0}/g, value).replace(/\{1}/g, secondValue)
      : value

    Array.isArray(property)
      ? property.forEach((prop) => this.setStyle(prop, finalValue))
      : this.setStyle(property, finalValue)
  }

  public setDefaultValue(property: GetCSSProperty, value: string): void {
    Array.isArray(property)
      ? property.forEach((prop) => this.setStyle(prop, value))
      : this.setStyle(property, value)
  }

  public setCustomClass = this.setStyle.bind(this)
}
