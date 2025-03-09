export * from '@tenoxui/moxie'
import type {
  Config,
  TenoxUIConfig,
  ProcessedStyle,
  ApplyStyleObject,
  ClassModifier
} from '@tenoxui/moxie'
import { TenoxUI as Moxie } from '@tenoxui/moxie'
export { TenoxUI as Moxie } from '@tenoxui/moxie'
export class TenoxUI extends Moxie {
  private reserveClass: string[]
  private styleMap: Map<string, Set<string>>
  private apply: ApplyStyleObject
  private config: TenoxUIConfig

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    reserveClass = [],
    apply = {}
  }: Config = {}) {
    super({ property, values, classes, breakpoints, aliases })
    this.reserveClass = reserveClass
    this.styleMap = new Map()
    this.apply = apply
    this.config = { property, values, classes, breakpoints, aliases }

    if (this.reserveClass.length > 0) {
      this.processReservedClasses()
    }
  }

  public processClassNames(classNames: string | string[]) {
    const allClassNames = this.process(classNames)

    allClassNames.forEach(({ className, cssRules, value, prefix }: ProcessedStyle) => {
      this.addStyle(className, cssRules, value, prefix)
    })

    return this
  }

  private processReservedClasses() {
    this.reserveClass.forEach((className) => {
      const classArray = Array.isArray(className)
        ? className
        : className.split(/\s+/).filter(Boolean)
      this.processClassNames(classArray)
    })
  }

  public generateRulesFromClass(classNames: string | string[]) {
    const processedStyles = new Map<string, string>()

    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)

    classList.forEach((className) => {
      if (!className) return

      const aliasResult = this.processAlias(className)
      if (aliasResult) {
        const { cssRules } = aliasResult
        if (typeof cssRules === 'string') {
          processedStyles.set(cssRules, '')
        } else if (Array.isArray(cssRules)) {
          cssRules.forEach((rule) => processedStyles.set(rule, ''))
        }
        return
      }

      const parsed = this.parse(className)
      if (!parsed) return

      const [, type, value, unit, secValue, secUnit] = parsed
      const shouldClasses = this.processCustomClass(type, value, unit, undefined, secValue, secUnit)
      if (shouldClasses) {
        const { cssRules } = shouldClasses
        if (typeof cssRules === 'string') {
          processedStyles.set(cssRules, '')
        } else if (Array.isArray(cssRules)) {
          cssRules.forEach((rule) => processedStyles.set(rule, ''))
        }
        return
      }

      const result = this.processShorthand(type, value!, unit, undefined, secValue, secUnit)
      if (result) {
        const { cssRules, value: ruleValue } = result
        const finalValue = ruleValue !== null ? `: ${ruleValue}` : ''

        if (typeof cssRules === 'string') {
          processedStyles.set(cssRules, finalValue)
        } else if (Array.isArray(cssRules)) {
          cssRules.forEach((rule) => processedStyles.set(this.toKebabCase(rule), finalValue))
        }
      }
    })

    return new Set([...processedStyles.entries()].map(([prop, val]) => `${prop}${val}`))
  }

  private processApplyObject(obj: ApplyStyleObject, indentLevel: number = 0): string {
    let css = ''
    const indent = ' '.repeat(indentLevel)
    const ruleIndent = ' '.repeat(indentLevel + 2)

    if (obj.SINGLE_RULE) {
      css += obj.SINGLE_RULE.join('\n') + '\n'
      delete obj.SINGLE_RULE
    }

    for (const key in obj) {
      const value = obj[key]
      css += key ? `${indent}${key} {\n` : ''

      if (typeof value === 'string') {
        const rules = [...this.generateRulesFromClass(value)]
        // css += `${ruleIndent}${rules.join(`;\n${ruleIndent}`)};`
        css += `${key ? ruleIndent : indent}${rules.join(`; `)}`
        if (rules.length) css += '\n'
      } else if (typeof value === 'object') {
        css += this.processApplyObject(value, indentLevel + 2)
      }

      css += key ? `${indent}}\n` : ''
    }

    return css
  }

  public addStyle(
    className: string | ClassModifier,
    cssRules: string | string[],
    value?: string | null,
    prefix?: string | null,
    isCustomSelector: boolean | null = true
  ) {
    const pseudoClasses = [
      'hover',
      'focus',
      'active',
      'visited',
      'focus-within',
      'focus-visible',
      'checked',
      'disabled',
      'enabled',
      'target',
      'required',
      'valid',
      'invalid'
    ]

    const isPseudoClass = pseudoClasses.includes(prefix || '')
    const colon = isPseudoClass ? ':' : '::'
    const key = `${isCustomSelector ? '' : '.'}${
      prefix ? `${prefix}\\:${className}${colon}${prefix}` : className
    }`

    if (!this.styleMap.has(key)) {
      this.styleMap.set(key, new Set())
    }

    const styleSet = this.styleMap.get(key)!

    if (Array.isArray(cssRules)) {
      const combinedRule = cssRules
        .map((prop: string) =>
          value ? `${this.toKebabCase(String(prop))}: ${value}` : this.toKebabCase(String(prop))
        )
        .join('; ')
      styleSet.add(combinedRule)
    } else {
      styleSet.add(value ? `${cssRules}: ${value}` : cssRules)
    }

    return this
  }

  public getConfig() {
    return this.config
  }

  public getStyle() {
    return this.styleMap
  }

  public getCSSRules(): string {
    this.processReservedClasses()
    let stylesheet = ''
    this.styleMap.forEach((rules, selector) => {
      stylesheet += `${selector} { ${Array.from(rules)} }\n`
    })
    return stylesheet
  }

  public generate(classNames?: string | string[]) {
    if (classNames) this.processClassNames(classNames)
    this.processReservedClasses()
    const fixedCss =
      Object.keys(this.apply).length > 0 ? this.processApplyObject(this.apply) + '\n' : ''
    const mediaQueries = new Map()
    let stylesheet = ''

    this.styleMap.forEach((rules, selector) => {
      if (selector.startsWith('@media')) {
        const mediaQuery = selector
        if (!mediaQueries.has(mediaQuery)) mediaQueries.set(mediaQuery, new Set())

        rules.forEach((rule) => mediaQueries.get(mediaQuery).add(rule))
      } else if (selector.endsWith(';')) {
        stylesheet += `${selector}\n`
      } else {
        const styles = Array.from(rules).join(' ')
        const [type] = selector.split(':')
        const isMatchApply = this.apply[selector] || this.apply[type] ? '' : '.'

        stylesheet += `${isMatchApply}${selector} { ${styles} }\n`
      }
    })

    mediaQueries.forEach((rules, query) => {
      stylesheet += `${query} {\n`
      rules.forEach((rule: string) => {
        stylesheet += `  ${rule}\n`
      })
      stylesheet += '}\n'
    })

    return fixedCss + stylesheet
  }
}

export { Config, TenoxUIConfig }
export default TenoxUI
