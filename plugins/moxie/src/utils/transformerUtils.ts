import { toKebabCase, escapeSelector } from './'
import type { CSSRule, ClassNameObject } from '../types'

/*
 * Helper for generating rules from variables
 */
export function generateCSSRule(
  property: string | string[],
  value: string,
  isImportant: boolean,
  localIsImportant?: boolean
): string {
  const important = localIsImportant || isImportant ? ' !important' : ''

  // check if property is an array
  if (Array.isArray(property)) {
    return property.map((prop) => `${toKebabCase(prop)}: ${value}${important}`).join('; ')
  }

  return `${toKebabCase(property)}: ${value}${important}`
}

/**
 * Helper for processing string rules
 */
export function processStringRules(rules: string, isImportant = false): string {
  const cleanRules = rules.endsWith(';') ? rules.slice(0, -1) : rules
  const withoutImportant = isImportant ? cleanRules.replaceAll(' !important', '') : cleanRules
  return withoutImportant + (isImportant ? ' !important' : '')
}

export function generateSelector(
  className: string | ClassNameObject,
  originalClassName: string,
  isClassName: boolean = true
): string {
  if (typeof className === 'string') {
    return (isClassName ? '.' : '') + escapeSelector(className)
  }

  const { raw, prefix = '', suffix = '' } = className
  const baseClass = raw || originalClassName
  return `${prefix}.${escapeSelector(baseClass)}${suffix}`
}

export function processObjectRules(
  rules: {
    [props: string]: string | [string, boolean?]
  },
  isImportant: boolean = false
) {
  const result: [string | string[], string, boolean?][] = Object.entries(rules).map(
    ([property, value]) => {
      let props: string | string[] = property
      if (property.includes(',')) {
        props = property.split(',').map((x) => x.trim())
      }

      if (Array.isArray(value)) {
        return [props, ...value]
      }
      return [props, value]
    }
  )

  return result
    .map((item) => {
      return generateCSSRule(item[0], item[1], isImportant, item[2])
    })
    .join('; ')
}

export function processRulesArray(
  rules: (CSSRule | string | [string | string[], string, boolean?])[],
  isImportant: boolean
): string {
  return rules
    .map((rule) => {
      // handle array format: [property, value, isImportant?]
      if (Array.isArray(rule)) {
        return generateCSSRule(rule[0], rule[1], isImportant, rule[2])
      }

      if (typeof rule === 'object') {
        // handle object format: { property, value, isImportant? }
        if ('property' in rule) {
          return generateCSSRule(rule.property, rule.value, isImportant, rule.isImportant)
        } else {
          // handle object format: { property: value | [value, isImportant?] }
          return processObjectRules(rule, isImportant)
        }
      }

      // handle string format
      if (typeof rule === 'string' && rule.includes(':')) {
        return processStringRules(rule, isImportant)
      }

      return String(rule)
    })
    .filter(Boolean)
    .join('; ')
}

export function generateRuleBlock(
  rules: any,
  isImportant: boolean,
  rulesOnly: boolean = false
): string {
  const createReturn = (rules: string) => (!rulesOnly ? `{ ${rules} }` : rules)

  if (Array.isArray(rules)) {
    return createReturn(processRulesArray(rules, isImportant))
  }

  if (typeof rules === 'object') {
    if ('property' in rules) {
      return createReturn(
        generateCSSRule(rules.property, rules.value, isImportant, rules.isImportant)
      )
    } else {
      return processObjectRules(rules, isImportant)
    }
  }

  if (typeof rules === 'string' && rules.includes(':')) {
    return createReturn(processStringRules(rules, isImportant))
  }

  return createReturn(rules)
}

export function processVariantSelector(variant: string, selector: string, rules: string): string {
  // Handle & replacement syntax
  if (variant.includes('&')) {
    return variant.replace(/&/g, selector) + ' ' + rules
  }

  // Handle @slot syntax
  if (variant.includes('@slot')) {
    return variant.replace('@slot', selector + ' ' + rules)
  }

  // Handle @class and @rules syntax
  if (variant.includes('@class')) {
    if (!variant.includes('@rules')) return ''

    return variant.replace('@class', selector).replace('@rules', rules.slice(1, -1)) // Remove { }
  }

  return selector + ' ' + rules
}
