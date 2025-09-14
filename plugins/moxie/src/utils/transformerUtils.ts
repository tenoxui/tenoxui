import type { CSSPropertyOrVariable } from '@tenoxui/core'
import type { CSSRule, ClassNameObject } from '../types'
import { toKebabCase, escapeSelector } from './'

/**
 * Helper to check if css property or variable
 */
export function transformProps(prop: CSSPropertyOrVariable): string {
  return (prop as string).startsWith('--') ? (prop as string) : toKebabCase(prop)
}

/**
 * Helper for generating rules from variables
 */
export function generateCSSRule(
  property: string | string[],
  value: string,
  isImportant: boolean,
  localIsImportant?: boolean
): string {
  const important = localIsImportant || isImportant ? ' !important' : ''

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
  isClassName = true
): string {
  if (typeof className === 'string') {
    return (isClassName ? '.' : '') + escapeSelector(className)
  }

  const { raw, prefix = '', suffix = '' } = className
  const baseClass = raw || originalClassName
  return `${prefix}.${escapeSelector(baseClass)}${suffix}`
}

export function processObjectRules(
  rules: Record<string, string | [string, boolean?]>,
  isImportant = false
): string {
  return Object.entries(rules)
    .map(([property, value]) => {
      const pureProps = property.startsWith('props:') ? property.slice(6) : property
      const props = pureProps.includes(',') ? pureProps.split(',').map((x) => x.trim()) : pureProps

      const [val, localImportant] = Array.isArray(value) ? value : [value]
      return generateCSSRule(props, val, isImportant, localImportant)
    })
    .join('; ')
}

export function processRulesArray(
  rules: (CSSRule | string | [string | string[], string, boolean?])[],
  isImportant: boolean
): string {
  return rules
    .map((rule) => {
      if (!rule) return ''

      if (Array.isArray(rule)) {
        return generateCSSRule(rule[0], rule[1], isImportant, rule[2])
      }

      if (typeof rule === 'object') {
        return 'property' in rule
          ? generateCSSRule(rule.property, rule.value, isImportant, rule.isImportant)
          : processObjectRules(rule, isImportant)
      }

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
  rulesOnly = false
): string | null {
  if (!rules) return null

  const wrapRules = (content: string) => (rulesOnly ? content : `{ ${content} }`)

  if (Array.isArray(rules)) {
    return wrapRules(processRulesArray(rules, isImportant))
  }

  if (typeof rules === 'object') {
    const content =
      'property' in rules
        ? generateCSSRule(rules.property, rules.value, isImportant, rules.isImportant)
        : processObjectRules(rules, isImportant)
    return wrapRules(content)
  }

  if (typeof rules === 'string' && rules.includes(':')) {
    return wrapRules(processStringRules(rules, isImportant))
  }

  return wrapRules(rules)
}

export function processVariantSelector(
  variant: string,
  selector: string,
  rules: string,
  classNameObject?: ClassNameObject
): string | null {
  const getSelector = () =>
    classNameObject ? generateSelector(classNameObject, selector) : selector

  // Handle & replacement syntax (excluding @class variants)
  if (variant.includes('&') && !variant.includes('@class')) {
    if (classNameObject) {
      const parts = generateSelector(classNameObject, selector).split(escapeSelector(selector))
      return parts.length > 1
        ? `${parts.join(variant.replace(/&/g, escapeSelector(selector)))} ${rules}`
        : null
    }
    return `${variant.replace(/&/g, selector)} ${rules}`
  }

  // Handle @slot syntax
  if (variant.includes('@slot')) {
    return variant.replace('@slot', `${getSelector()} ${rules}`)
  }

  // Handle @class and @rules syntax
  if (variant.includes('@class')) {
    if (!variant.includes('@rules')) return null

    const cleanRules =
      rules.startsWith('{') && rules.endsWith('}') ? rules.slice(1, -1).trim() : rules.trim()

    return variant.replace('@class', getSelector()).replace('@rules', cleanRules)
  }

  return null
}
