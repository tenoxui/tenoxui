import type { Plugin, ProcessUtilitiesContext, CSSPropertyOrVariable } from '@tenoxui/core/types'
import { createRegexp } from './lib/regexp'
import type { UtilityFunctionResult, Config, ProcessResult, Value, FnResult } from './types'

function isUtilityFunction(
  prop: unknown
): prop is (value: { raw: string; data: string | null } | null) => UtilityFunctionResult {
  return typeof prop === 'function'
}

export function Moxie(config: Config = {}): Plugin<ProcessResult> {
  const { values = {} } = config

  const replaceWithValueRegistry = (text: string): string => {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      const val = values[key]
      return typeof val === 'string' ? val : match
    })
  }

  const processValue = (value: string): string => {
    if (value.startsWith('$')) {
      return `var(--${value.slice(1)})`
    }

    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = value
        .slice(1, -1)
        .replace(/\\_/g, 'M0X13C55')
        .replace(/_/g, ' ')
        .replace(/M0X13C55/g, '_')

      if (cleanValue.includes('{')) {
        return replaceWithValueRegistry(cleanValue)
      }

      return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
    }

    return value
  }

  return {
    name: 'tenoxui-moxie',

    regexp({ utilities }) {
      return {
        matcher: createRegexp({ utilities }).matcher
      }
    },

    processValue(value: string): string {
      return processValue(value)
    },

    processUtilities(context: ProcessUtilitiesContext): ProcessResult | null {
      const { className, value, property, variant, utilities } = context

      if (!className || !value || !property || !utilities) {
        return null
      }

      const propertyConfig = utilities[property.name]
      let finalProperty: CSSPropertyOrVariable | FnResult[]
      let finalValue: Value = value

      if (isUtilityFunction(propertyConfig)) {
        const result = propertyConfig(value)

        if (Array.isArray(result)) {
          finalProperty = result
          finalValue = null
        } else if (typeof result === 'object' && result !== null) {
          finalProperty = result.property
          finalValue: result.value
        } else {
          finalProperty = (property.data || property.name) as CSSPropertyOrVariable
        }
      } else {
        finalProperty = (propertyConfig || property.data || property.name) as CSSPropertyOrVariable
      }

      return {
        className,
        rules: {
          property: finalProperty,
          value: finalValue
        },
        prefix: variant || null
      }
    }
  }
}

export default Moxie
