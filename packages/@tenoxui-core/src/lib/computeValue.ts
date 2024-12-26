import {
  Property,
  Values,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSVariable,
  CSSProperty
} from '../types'

export class ComputeValue {
  constructor(
    private readonly element: HTMLElement,
    private readonly properties: Property,
    private readonly values: Values
  ) {}

  private replaceWithValueRegistry(text: string): string {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      return this.values[key]?.toString() || match
    })
  }

  public valueHandler(type: string, value: string | undefined, unit: string): string {
    // Early return if value is undefined
    if (value === undefined) {
      return ''
    }

    const property = this.properties[type]

    // Add null check before accessing value registry
    const valueRegistry = value ? (this.values as Record<string, string>)[value] : undefined

    // Ensure value exists before string operations
    if (value && (value + unit).length !== value.toString().length && unit !== '') {
      return value + unit
    }

    let resolvedValue = valueRegistry || value

    if (
      typeof property === 'object' &&
      'value' in property &&
      property.value &&
      !property.value.includes('{0}')
    ) {
      return property.value
    }

    // Ensure resolvedValue is a string
    if (typeof resolvedValue !== 'string') {
      return ''
    }

    if (resolvedValue.startsWith('$')) {
      return `var(--${resolvedValue.slice(1)})`
    }

    if (resolvedValue.startsWith('[') && resolvedValue.endsWith(']')) {
      const cleanValue = resolvedValue.slice(1, -1).replace(/_/g, ' ')
      if (cleanValue.includes('{')) {
        const replacedValue = this.replaceWithValueRegistry(cleanValue)
        return replacedValue
      } else {
        return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
      }
    }

    const typeRegistry = this.values[type] as Record<string, string> | undefined
    if (typeRegistry && typeof typeRegistry === 'object') {
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
