import type {
  ProcessResult,
  InvalidResult,
  ProcessedValue,
  Utilities,
  Variants,
  Values,
  UtilityContext,
  UtilityResult,
  CreateRegexpResult,
  ClassNameObject
} from '../types'
import { createRegexp } from './regexp'

export function isProcessedValue(value: any): value is { key: string; value: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.value === 'string'
  )
}

export function isUtilityFunction(utility: any): utility is Function {
  return typeof utility === 'function'
}

export function isUtilityConfig(utility: any): utility is { property?: any; value?: any } {
  return (
    typeof utility === 'object' && utility !== null && ('property' in utility || 'value' in utility)
  )
}

export function extractMatchGroups(match: RegExpMatchArray): {
  variant?: string
  property: string
  value?: string
} {
  const groups = match.groups || {}
  return {
    variant: groups.variant,
    property: groups.property || '',
    value: groups.value
  }
}

export class Processor {
  private parser: CreateRegexpResult
  private utilities: Utilities
  private variants: Variants
  private values: Values

  constructor(
    config: {
      parser?: CreateRegexpResult | null

      utilities?: Utilities
      variants?: Variants
      values?: Values
    } = {}
  ) {
    this.parser =
      config.parser ||
      createRegexp({
        utilities: config.utilities ? Object.keys(config.utilities) : [],
        variants: config.variants ? Object.keys(config.variants) : []
      })
    this.utilities = config.utilities || {}
    this.variants = config.variants || {}
    this.values = config.values || {}
  }

  public processVariant(variant: string): string | null {
    if (!variant) return null

    if (
      variant &&
      ((variant.startsWith('[') && variant.endsWith(']')) ||
        (variant.startsWith('(') && variant.endsWith(')')))
    ) {
      return this.escapeArbitrary(variant)
    }

    const match = variant.match(createRegexp({ utilities: Object.keys(this.variants) }).matcher)
    const variantHandler = match && this.variants[match[2]]

    if (!variantHandler) return null

    let key: string | null = null
    let value: string | null = match?.[3]

    const processedValue = this.processValue(match?.[3] || '')
    if (isProcessedValue(processedValue)) {
      key = processedValue.key
      value = processedValue.value
    }

    return isUtilityFunction(variantHandler) ? variantHandler({ key, value }) : variantHandler
  }

  private replaceWithValueRegistry(text: string): string {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      const val = this.values[key]
      return typeof val === 'string' ? val : match
    })
  }

  private escapeArbitrary(str: string): string {
    return str
      .slice(1, -1)
      .replace(/\\_/g, 'M0X13C55')
      .replace(/_/g, ' ')
      .replace(/M0X13C55/g, '_')
  }

  public processValue(rawValue: string): string | ProcessedValue {
    const pattern = /^(?:\(|\[)([^:]+):(.+)(?:\)|\])$/
    let extractedFor: string | null = null
    let value = rawValue || ''

    const matchValue = value.match(pattern)
    if (matchValue) {
      const extractedValue = matchValue[2].trim()
      extractedFor = matchValue[1].trim()
      value =
        (rawValue.startsWith('[') && rawValue.endsWith(']')) ||
        (rawValue.startsWith('(') && rawValue.endsWith(')'))
          ? rawValue.startsWith('[')
            ? `[${extractedValue}]`
            : `(${extractedValue})`
          : extractedValue
    }

    const createReturn = (processedValue: string): string | ProcessedValue =>
      extractedFor ? { key: extractedFor, value: processedValue } : processedValue

    if (this.values[value]) {
      return createReturn(this.values[value])
    }

    if (value.startsWith('$')) {
      return createReturn(`var(--${value.slice(1)})`)
    }

    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = this.escapeArbitrary(value)

      if (cleanValue.includes('{')) {
        return createReturn(this.replaceWithValueRegistry(cleanValue))
      }

      return createReturn(cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue)
    }

    return createReturn(value)
  }

  public processUtilities(context: {
    className: string
    value: string | ProcessedValue | null
    property: any
    variant: string | null
    utilities: Utilities
    raw: RegExpMatchArray
    isImportant: boolean
  }): ProcessResult | InvalidResult | null {
    const { className, value: finalValue, property, variant, raw, isImportant } = context

    let value: string | null
    let key: string | null = null

    if (finalValue && isProcessedValue(finalValue)) {
      value = finalValue.value
      key = finalValue.key
    } else {
      value = finalValue as string
    }

    if (typeof property === 'string' && key) {
      return this.createErrorResult(
        className,
        `String utility can't have key, and ${key} is parsed as key!`
      )
    }

    let properties = property

    if (
      raw?.[2] &&
      ((raw[2].startsWith('[') && raw[2].endsWith(']')) ||
        (raw[2].startsWith('(') && raw[2].endsWith(')')))
    ) {
      properties = raw[2]
    }

    if (!className || !properties) {
      return null
    }

    if (isUtilityConfig(properties) && properties.property) {
      const props = properties.property

      if (properties.value && Array.isArray(properties.value) && value) {
        const isValueAllowed = properties.value.some((item) =>
          typeof item === 'string' ? item === value : item instanceof RegExp && item.test(value)
        )

        if (!isValueAllowed) {
          return null
        }
      }

      if (typeof props === 'string' || Array.isArray(props)) {
        if (typeof props === 'string' && props.includes(':')) {
          return this.createResult(className, variant, '', '', raw, isImportant, props)
        } else {
          return this.createResult(className, variant, props, value, raw, isImportant)
        }
      }
    }

    if (typeof properties === 'string' || Array.isArray(properties)) {
      if (
        typeof properties === 'string' &&
        properties.startsWith('[') &&
        properties.endsWith(']')
      ) {
        const props = properties.slice(1, -1).split(',')
        return this.createResult(
          className,
          variant,
          props.length > 1 ? props : properties.slice(1, -1),
          value || '',
          raw,
          isImportant
        )
      } else if (typeof properties === 'string' && properties.includes(':')) {
        return value
          ? // direct string properties shouldn't have value
            null
          : this.createResult(className, variant, '', '', raw, isImportant, properties)
      } else {
        return this.createResult(className, variant, properties, value, raw, isImportant)
      }
    }

    if (isUtilityFunction(properties)) {
      const utilityContext: UtilityContext = { className, value: value || '', raw, key }
      const result = properties(utilityContext)

      if (!result) {
        return this.createErrorResult(className)
      }

      if (typeof result === 'string') {
        if (result.includes(':')) {
          return this.createResult(className, variant, '', '', raw, isImportant, result)
        }
        return this.createResult(className, variant, result, value, raw, isImportant)
      }

      const utilityResult = result as UtilityResult

      if (
        typeof utilityResult === 'object' &&
        ('property' in utilityResult || 'rules' in utilityResult)
      ) {
        return this.createResult(
          utilityResult.className || className,
          variant,
          utilityResult.property || property,
          utilityResult.value || value || '',
          raw,
          utilityResult.isImportant || isImportant,
          utilityResult.rules
        )
      } else {
        return this.createResult(className, variant, '', '', raw, isImportant, utilityResult)
      }
    }

    return null
  }

  private createErrorResult(className: string, reason = 'undefined'): InvalidResult {
    return {
      use: 'moxie',
      className,
      rules: null,
      reason
    }
  }

  private createResult(
    className: string | ClassNameObject,
    variant: string | null,
    property: string | string[],
    value: string,
    raw: RegExpMatchArray,
    isImportant: boolean,
    fullRules?: any
  ): ProcessResult {
    return {
      use: 'moxie',
      className,
      rules: fullRules || { property, value },
      variant,
      isImportant,
      raw
    }
  }

  process(inputClass: string): ProcessResult | InvalidResult | null {
    let className = inputClass
    const isImportant = className.startsWith('!') || className.endsWith('!')

    if (isImportant) {
      className = className.startsWith('!') ? className.slice(1) : className.slice(0, -1)
    }

    const match = className.match(this.parser.matcher)
    if (!match) return null

    const { variant, property, value } = extractMatchGroups(match)
    const finalVariant = variant ? this.processVariant(variant) : null

    const prop = this.utilities[property]
    let finalProp = prop
    if (Array.isArray(prop) && prop[0] instanceof RegExp) {
      if (value && !value.match(prop[0])) return null
      finalProp = prop[1]
    }

    return this.processUtilities({
      className: inputClass,
      property: finalProp,
      value: this.processValue(value || ''),
      variant: finalVariant,
      utilities: this.utilities,
      raw: match,
      isImportant
    })
  }
}
