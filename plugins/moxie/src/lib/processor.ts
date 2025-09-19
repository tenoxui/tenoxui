import { SyncPluginSystem as PluginSystem } from '@nousantx/plugify'
import { createRegexp } from './regexp'
import {
  isProcessedValue,
  isUtilityConfig,
  isUtilityFunction,
  isArbitrary,
  extractMatchGroups,
  escapeArbitrary,
  processStrictPatterns,
  createResult,
  createErrorResult
} from '../utils'
import type {
  Variants,
  Utilities,
  StringRules,
  PluginTypes,
  UtilityResult,
  ProcessResult,
  InvalidResult,
  ProcessedValue,
  UtilityContext,
  ClassNameObject,
  CreateRegexpResult,
  AllowedUtilityRules
} from '../types'

export class Processor {
  private parser: CreateRegexpResult
  private utilities: Utilities
  private variants: Variants

  constructor(
    config: {
      parser?: CreateRegexpResult | null
      utilities?: Utilities
      variants?: Variants
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
  }

  public processVariant(variant: string, pluginSystem?: PluginSystem<PluginTypes>): string | null {
    if (!variant) return null

    if (pluginSystem) {
      const pluginResult = pluginSystem.exec('processVariant', variant, this.variants)
      if (pluginResult) return pluginResult
    }

    if (variant && isArbitrary(variant)) return escapeArbitrary(variant)

    const match = variant.match(createRegexp({ utilities: Object.keys(this.variants) }).matcher)
    const variantHandler = match && this.variants[match[2]]

    if (!variantHandler) return null

    let key: string | null = null
    let value: string | null = match?.[3]

    const processedValue = this.processValue(match?.[3] || '', match[2], pluginSystem)
    if (isProcessedValue(processedValue)) {
      key = processedValue.key
      value = processedValue.value
    }

    return isUtilityFunction(variantHandler) ? variantHandler({ key, value }) : variantHandler
  }

  public processValue(
    rawValue: string,
    type?: string,
    pluginSystem?: PluginSystem<PluginTypes>
  ): string | ProcessedValue | null {
    if (!rawValue) return null

    const pattern = /^(?:\(|\[)([^:]+):(.+)(?:\)|\])$/
    let extractedFor: string | null = null
    let value = rawValue || ''

    const matchValue = value.match(pattern)
    if (matchValue) {
      const extractedValue = matchValue[2].trim()
      extractedFor = matchValue[1].trim()
      value = isArbitrary(rawValue)
        ? rawValue.startsWith('[')
          ? `[${extractedValue}]`
          : `(${extractedValue})`
        : extractedValue
    }

    const createReturn = (processedValue: string): string | ProcessedValue =>
      extractedFor ? { key: extractedFor, value: processedValue } : processedValue

    if (pluginSystem) {
      const pluginResult = pluginSystem.exec('processValue', {
        value,
        raw: rawValue,
        key: extractedFor,
        property: type,
        createReturn
      })
      if (pluginResult) return pluginResult
    }

    if (isArbitrary(value)) {
      const cleanValue = escapeArbitrary(value)

      return createReturn(cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue)
    }

    return createReturn(value)
  }

  public processUtilities(
    context: {
      className: string | ClassNameObject
      value: string | ProcessedValue | null
      property: any
      variant: string | null
      raw: RegExpMatchArray
      isImportant: boolean
    },
    pluginSystem?: PluginSystem<PluginTypes>
  ): ProcessResult | InvalidResult | null {
    const { className, value: finalValue, property, variant, raw, isImportant } = context

    let value: string | null
    let key: string | null = null

    if (finalValue && isProcessedValue(finalValue)) {
      value = finalValue.value
      key = finalValue.key
    } else {
      value = finalValue as string
    }

    if (pluginSystem) {
      const pluginResult = pluginSystem.exec('processUtilities', {
        className,
        value,
        key,
        property,
        variant,
        raw,
        isImportant
      })
      if (pluginResult) return pluginResult
    }

    if (typeof property !== 'function' && key) {
      return createErrorResult(
        className,
        `'${raw?.[2] || className}' utility shouldn't have keys, and '${key}' is defined`
      )
    }

    let properties = property

    if (raw?.[2] && isArbitrary(raw?.[2])) properties = raw[2]

    if (!className || !properties) return null

    if (typeof properties === 'object' && !Array.isArray(properties)) {
      if (isUtilityConfig(properties)) {
        const props = properties.property

        if (properties.value && Array.isArray(properties.value) && value) {
          if (!processStrictPatterns(value, properties.value)) {
            return createErrorResult(
              className,
              `'${raw?.[2] || className}' utility doesn't accept '${value}' as value`
            )
          }
        }

        if (typeof props === 'string' || Array.isArray(props)) {
          if (typeof props === 'string' && (props.includes(':') || props.startsWith('rules:'))) {
            if (value) {
              return createErrorResult(
                className,
                `'${
                  raw?.[2] || className
                }' utility shouldn't have values, and '${value}' is defined`
              )
            }
            return createResult(
              className,
              variant,
              '',
              '',
              raw,
              isImportant,
              (props.startsWith('rules:') ? props.slice(6) : props) as StringRules
            )
          } else {
            if (!value) {
              return createErrorResult(
                className,
                `'${raw[2] || className}' utility should have a value`
              )
            }
            return createResult(className, variant, props, value, raw, isImportant)
          }
        }
      } else {
        if (value) {
          return createErrorResult(
            className,
            `'${raw?.[2] || className}' utility shouldn't have values, and '${value}' is defined`
          )
        }
        return createResult(className, variant, '', '', raw, isImportant, properties)
      }
    }

    if (typeof properties === 'string' || Array.isArray(properties)) {
      if (
        typeof properties === 'string' &&
        properties.startsWith('[') &&
        properties.endsWith(']')
      ) {
        if (!value)
          return createErrorResult(
            className,
            `'${raw?.[2] || className}' utility should have a value`
          )
        const props = properties.slice(1, -1).split(',')
        return createResult(
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
          ? null
          : createResult(
              className,
              variant,
              '',
              '',
              raw,
              isImportant,
              (properties.startsWith('rules:') ? properties.slice(6) : properties) as StringRules
            )
      } else {
        return !value
          ? createErrorResult(className, `'${raw?.[2] || className}' utility should have a value`)
          : createResult(className, variant, properties, value, raw, isImportant)
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
        return createErrorResult(
          className,
          result ? (Array.isArray(result) ? result[1] : result.reason) : 'undefined'
        )
      }

      if (typeof result === 'string') {
        if (result.includes(':') || result.startsWith('rules:')) {
          return createResult(
            className,
            variant,
            '',
            '',
            raw,
            isImportant,
            (result.startsWith('rules:') ? result.slice(6) : result) as StringRules
          )
        }
        return createResult(className, variant, result, value, raw, isImportant)
      }

      const utilityResult = result as UtilityResult

      if (
        typeof utilityResult === 'object' &&
        ('property' in utilityResult || 'rules' in utilityResult)
      ) {
        return createResult(
          utilityResult.className || className,
          variant,
          utilityResult.property || property,
          utilityResult.value || value || '',
          raw,
          utilityResult.isImportant || isImportant,
          utilityResult.rules
        )
      } else {
        return createResult(
          className,
          variant,
          '',
          '',
          raw,
          isImportant,
          utilityResult as AllowedUtilityRules
        )
      }
    }

    return null
  }

  public processWithPlugins(
    inputClass: string,
    pluginSystem: PluginSystem<PluginTypes>
  ): ProcessResult | InvalidResult | null {
    let className = inputClass
    const isImportant = className.startsWith('!') || className.endsWith('!')

    if (isImportant) {
      className = className.startsWith('!') ? className.slice(1) : className.slice(0, -1)
    }

    const match = className.match(this.parser.matcher)

    if (!match) return null

    const { variant, property, value } = extractMatchGroups(match)
    const finalVariant = variant ? this.processVariant(variant, pluginSystem) : null

    const prop = this.utilities[property]
    let finalProp = prop
    if (
      value &&
      Array.isArray(prop) &&
      ((typeof prop[0] !== 'string' && (prop[0] instanceof RegExp || Array.isArray(prop[0]))) ||
        (typeof prop[0] === 'object' && 'patterns' in prop[0]))
    ) {
      if (!processStrictPatterns(value, prop[0])) {
        return createErrorResult(
          className,
          `'${match?.[2] || className}' utility doesn't accept '${value}' as value`
        )
      }
      finalProp = prop[1]
    }

    const data = {
      className: inputClass,
      property: finalProp,
      value: this.processValue(value || '', property, pluginSystem),
      variant: finalVariant,
      raw: match,
      isImportant
    }

    const pluginResult = pluginSystem.exec('process', className, {
      ...data,
      processUtilities: (ctx: any) => this.processUtilities(ctx, pluginSystem),
      processValue: (rawValue: string, type?: string) =>
        this.processValue(rawValue, type, pluginSystem),
      processVariant: (variant: string) => this.processVariant(variant, pluginSystem),
      parser: this.parser
    })

    if (pluginResult) return pluginResult

    return this.processUtilities(data, pluginSystem)
  }

  public process(inputClass: string): ProcessResult | InvalidResult | null {
    return this.processWithPlugins(inputClass, new PluginSystem<PluginTypes>([]))
  }
}
