import { Property, DefinedValue, Classes } from '../types'
import { toKebabCase } from './converter'
import { RulesGenerator } from './generator'

export class ProcessClass {
  readonly property: Property
  readonly values: DefinedValue
  readonly classes: Classes
  readonly generator: RulesGenerator

  constructor(
    property: Property,
    values: DefinedValue,
    classes: Classes,
    generator: RulesGenerator
  ) {
    this.property = property
    this.values = values
    this.classes = classes
    this.generator = generator
  }

  processFinalValue(type: string, value: string, unit?: string): string {
    const typeRegistry = this.values[type]
    const valueRegistry = this.values[value]

    if (typeof typeRegistry === 'object' && typeRegistry !== null) {
      const specificValue = typeRegistry[value]
      if (specificValue) {
        return specificValue
      }
    }

    if (valueRegistry) {
      return typeof valueRegistry === 'string' ? valueRegistry : valueRegistry[value] || value
    }

    if (value.startsWith('$')) {
      return `var(--${value.slice(1)})`
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      const solidValue = value.slice(1, -1).replace(/_/g, ' ')
      return solidValue.startsWith('--') ? `var(${solidValue})` : solidValue
    }

    return value + (unit || '')
  }

  processCustomValue(type: string, prefix?: string): string | null {
    const properties = this.property[type]

    if (properties && typeof properties === 'object' && 'property' in properties) {
      const propertyVal = properties.property
      const propValue = properties.value

      if (Array.isArray(propertyVal)) {
        const rules = propertyVal
          .map((prop) => `${toKebabCase(String(prop))}: ${propValue}`)
          .join('; ')
        return this.generator.generateCSSRule(`${type}`, rules, null, prefix)
      }

      return propertyVal
        ? this.generator.generateCSSRule(
            `${type}`,
            toKebabCase(String(propertyVal)),
            properties.value,
            prefix
          )
        : null
    }

    return null
  }

  processCustomClass(prefix: string | undefined, className: string): string | null {
    const properties = Object.entries(this.classes)
      .filter(([, classObj]) => classObj.hasOwnProperty(className))
      .reduce(
        (acc, [propKey, classObj]) => {
          acc[toKebabCase(propKey)] = classObj[className]
          return acc
        },
        {} as Record<string, string>
      )

    if (Object.keys(properties).length > 0) {
      const rules = Object.entries(properties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')

      return this.generator.generateCSSRule(className, rules, null, prefix)
    }

    return null
  }
}
