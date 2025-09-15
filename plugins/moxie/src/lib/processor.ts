import { SyncPluginSystem as PluginSystem } from '@nousantx/plugify'
import { createRegexp } from './regexp'
import { isProcessedValue, isUtilityConfig, isUtilityFunction, extractMatchGroups } from '../utils'
import type {
  Variants,
  Utilities,
  PluginTypes,
  UtilityResult,
  ProcessResult,
  InvalidResult,
  ProcessedValue,
  UtilityContext,
  ClassNameObject,
  CreateRegexpResult,
  Plugin as MoxiePlugin
} from '../types'

export class Processor {
  private parser: CreateRegexpResult
  private utilities: Utilities
  private variants: Variants
  private plugins: PluginSystem<PluginTypes>

  constructor(
    config: {
      parser?: CreateRegexpResult | null
      utilities?: Utilities
      variants?: Variants
      plugins?: MoxiePlugin[]
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
    this.plugins = new PluginSystem<PluginTypes>(config.plugins)
  }

  public processVariant(variant: string): string | null {
    if (!variant) return null

    const pluginResult = this.plugins.exec('processVariant', variant, this.variants)

    if (pluginResult) return pluginResult

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

    const processedValue = this.processValue(match?.[3] || '', match[2])
    if (isProcessedValue(processedValue)) {
      key = processedValue.key
      value = processedValue.value
    }

    return isUtilityFunction(variantHandler) ? variantHandler({ key, value }) : variantHandler
  }

  private escapeArbitrary(str: string): string {
    return str
      .slice(1, -1)
      .replace(/\\_/g, 'M0X13C55')
      .replace(/_/g, ' ')
      .replace(/M0X13C55/g, '_')
  }

  public processValue(rawValue: string, type?: string): string | ProcessedValue | null {
    if (!rawValue) return null

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

    const pluginResult = this.plugins.exec('processValue', {
      value,
      raw: rawValue,
      key: extractedFor,
      property: type,
      createReturn
    })

    if (pluginResult) return pluginResult

    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = this.escapeArbitrary(value)

      return createReturn(cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue)
    }

    return createReturn(value)
  }

  public processStrictPatterns(
    value: string,
    patterns: string | RegExp | (string | RegExp | (string | RegExp)[])[]
  ): void | boolean {
    if (value && patterns) {
      if (typeof patterns === 'string') return value === patterns
      if (patterns instanceof RegExp) return patterns.test(value)
      if (Array.isArray(patterns)) {
        return patterns.some((item) =>
          Array.isArray(item)
            ? this.processStrictPatterns(value, item)
            : typeof item === 'string'
              ? item === value
              : item instanceof RegExp && item.test(value)
        )
      }
    }
  }

  public processUtilities(context: {
    className: string | ClassNameObject
    value: string | ProcessedValue | null
    property: any
    variant: string | null
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

    const pluginResult = this.plugins.exec('processUtilities', {
      className,
      value,
      key,
      property,
      variant,
      raw,
      isImportant,
      createResult: this.createResult,
      createErrorResult: this.createErrorResult
    })

    if (pluginResult) return pluginResult

    if (typeof property !== 'function' && key) {
      return this.createErrorResult(
        className,
        `'${raw?.[2] || className}' utility shouldn't have keys, and '${key}' is defined`
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

    if (!className || !properties) return null

    if (typeof properties === 'object' && !Array.isArray(properties)) {
      if (isUtilityConfig(properties)) {
        const props = properties.property

        if (properties.value && Array.isArray(properties.value) && value) {
          if (!this.processStrictPatterns(value, properties.value)) {
            return this.createErrorResult(
              className,
              `'${raw?.[2] || className}' utility doesn't accept '${value}' as value`
            )
          }
        }

        if (typeof props === 'string' || Array.isArray(props)) {
          if (typeof props === 'string' && (props.includes(':') || props.startsWith('rules:'))) {
            if (value) {
              return this.createErrorResult(
                className,
                `'${
                  raw?.[2] || className
                }' utility shouldn't have values, and '${value}' is defined`
              )
            }
            return this.createResult(
              className,
              variant,
              '',
              '',
              raw,
              isImportant,
              props.startsWith('rules:') ? props.slice(6) : props
            )
          } else {
            if (!value) {
              return this.createErrorResult(
                className,
                `'${raw[2] || className}' utility should have a value`
              )
            }
            return this.createResult(className, variant, props, value, raw, isImportant)
          }
        }
      } else {
        if (value) {
          return this.createErrorResult(
            className,
            `'${raw?.[2] || className}' utility shouldn't have values, and '${value}' is defined`
          )
        }
        return this.createResult(className, variant, '', '', raw, isImportant, properties)
      }
    }

    if (typeof properties === 'string' || Array.isArray(properties)) {
      if (
        typeof properties === 'string' &&
        properties.startsWith('[') &&
        properties.endsWith(']')
      ) {
        if (!value)
          return this.createErrorResult(
            className,
            `'${raw?.[2] || className}' utility should have a value`
          )
        const props = properties.slice(1, -1).split(',')
        return this.createResult(
          className,
          variant,
          props.length > 1 ? props : properties.slice(1, -1),
          value || '',
          raw,
          isImportant
        )
      } else if (
        typeof properties === 'string' &&
        (properties.includes(':') || properties.startsWith('rules:'))
      ) {
        return value
          ? // direct string properties shouldn't have value
            null
          : this.createResult(
              className,
              variant,
              '',
              '',
              raw,
              isImportant,
              properties.startsWith('rules:') ? properties.slice(6) : properties
            )
      } else {
        return !value
          ? this.createErrorResult(
              className,
              `'${raw?.[2] || className}' utility should have a value`
            )
          : this.createResult(className, variant, properties, value, raw, isImportant)
      }
    }

    if (isUtilityFunction(properties)) {
      const utilityContext: UtilityContext = { className, value: value || '', raw, key }
      const result = properties(utilityContext)

      if (
        !result ||
        (typeof result === 'object' && ('reason' in result || 'fail' in result)) ||
        (Array.isArray(result) &&
          result.length === 2 &&
          !result[0] &&
          typeof result[1] === 'string')
      ) {
        return this.createErrorResult(
          className,
          result ? (Array.isArray(result) ? result[1] : result.reason) : 'undefined'
        )
      }

      if (typeof result === 'string') {
        if (result.includes(':') || result.startsWith('rules:')) {
          return this.createResult(
            className,
            variant,
            '',
            '',
            raw,
            isImportant,
            result.startsWith('rules:') ? result.slice(6) : result
          )
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

  private createErrorResult(
    className: string | ClassNameObject,
    reason = 'undefined'
  ): InvalidResult {
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

  public process(inputClass: string): ProcessResult | InvalidResult | null {
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
    if (
      value &&
      Array.isArray(prop) &&
      typeof prop[0] !== 'string' &&
      (prop[0] instanceof RegExp || Array.isArray(prop[0]))
    ) {
      if (!this.processStrictPatterns(value, prop[0])) {
        return this.createErrorResult(
          className,
          `'${match?.[2] || className}' utility doesn't accept '${value}' as value`
        )
      }
      finalProp = prop[1]
    }

    const data = {
      className: inputClass,
      property: finalProp,
      value: this.processValue(value || '', property),
      variant: finalVariant,
      raw: match,
      isImportant
    }

    const pluginResult = this.plugins.exec('process', className, {
      ...data,
      processUtilities: this.processUtilities,
      processValue: this.processValue,
      processVariant: this.processVariant,
      createResult: this.createResult,
      createErrorResult: this.createErrorResult,
      parser: this.parser
    })

    if (pluginResult) return pluginResult

    return this.processUtilities(data)
  }
}
