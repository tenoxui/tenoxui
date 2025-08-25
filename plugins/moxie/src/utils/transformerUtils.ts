import type { CSSPropertyOrVariable } from '@tenoxui/core'
import type { CSSRule, ClassNameObject } from '../types'
import { toKebabCase, escapeSelector } from './'

/**
 * Helper to check if css ptoperty or variable
 */
export function transformProps(prop: CSSPropertyOrVariable) {
  return ((prop as string).startsWith('--') ? prop : toKebabCase(prop)) as string
}

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
    return property
      .map((prop) => `${transformProps(prop as CSSPropertyOrVariable)}: ${value}${important}`)
      .join('; ')
  }

  return `${transformProps(property as CSSPropertyOrVariable)}: ${value}${important}`
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
        props = (property.startsWith('props:') ? property.slice(6) : property)
          .split(',')
          .map((x) => x.trim())
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
      if (!rule) return
      // handle array format: [property, value, isImportant?]
      if (Array.isArray(rule)) {
        return generateCSSRule(rule[0], rule[1], isImportant, rule[2])
      }

      if (typeof rule === 'object' && !Array.isArray(rule)) {
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
): string | null {
  if (!rules) return null
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
      return createReturn(processObjectRules(rules, isImportant))
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

    return variant.replace('@class', selector).replace(
      '@rules',
      // Remove { }
      rules.startsWith('{') && rules.endsWith('}') ? rules.slice(1, -1).trim() : rules.trim()
    )
  }

  return selector + ' ' + rules
}
