import { TenoxUI as Core, Moxie } from '../core-2/index.es.js'
import { Config } from './types'

export class TenoxUI extends Core {
  private safelist: string[]

  constructor({
    // core config
    variants = {},
    customVariants = {},
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = {},
    moxie = Moxie,
    moxieOptions = {},
    // tenoxui config
    safelist = [],
    tabSize = 2
  }: Partial<Config> = {}) {
    super({
      property,
      values,
      classes,
      aliases,
      breakpoints,
      tenoxui: moxie,
      tenoxuiOptions: moxieOptions,
      variants,
      customVariants
    })

    this.safelist = safelist
    this.tabSize = tabSize
  }

  public addTabs(str: string, size: number = 2, fixedTabs: boolean = false): string {
    const spaces = ' '.repeat(fixedTabs ? size : this.tabSize)
    return str
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => `${spaces}${line}`)
      .join('\n')
  }

  private formatRules(cssRules: string | string[] | null, value: string | null): string {
    if (Array.isArray(cssRules) && value !== null) {
      return cssRules
        .map((prop: string) =>
          value
            ? `${this.main.toKebabCase(String(prop))}: ${value}`
            : this.main.toKebabCase(String(prop))
        )
        .join('; ')
    }
    return cssRules as string
  }

  public getData(classNames: string | string[]) {
    return super.process(classNames)
  }

  private formatAliasRules(rules: any[]): string {
    return rules
      .map((rule) => {
        if (typeof rule.cssRules === 'string' && rule.value === null) {
          return rule.cssRules
        } else {
          const prop = rule.cssRules
          const val = rule.value !== null ? `: ${rule.value}` : ''
          return `${prop}${val}`
        }
      })
      .join('; ')
  }

  private processAliasItem(item: any, results: string[]) {
    const mainRules = this.formatAliasRules(item.rules)
    const mainClassName = item.className

    const defaultClass = `.${mainClassName} {\n${this.addTabs(mainRules)}\n}`
    results.push(
      item.prefix
        ? !item.prefix.data.includes('&')
          ? `${item.prefix.data} {\n${this.addTabs(defaultClass)}\n}`
          : `${item.prefix.data.replace(/&/g, `.${mainClassName}`)} {\n${this.addTabs(
              mainRules
            )}\n}`
        : defaultClass
    )

    if (item.variants && Array.isArray(item.variants)) {
      item.variants.forEach((variant: any) => {
        const variantRules = this.formatAliasRules(variant.rules)
        const variantClassName = variant.className
        const variantType = variant.variant

        if (variantType.includes('&')) {
          const selector = variantType.replace(/&/g, `.${mainClassName}`)
          results.push(`${selector} {\n${this.addTabs(variantRules)}\n}`)
        } else {
          results.push(
            `${variantType} {\n${this.addTabs(
              `.${variantClassName} {\n${this.addTabs(variantRules)}\n}`
            )}\n}`
          )
        }
      })
    }
  }

  public process(classNames?: string | string) {
    const classes = [
      ...this.safelist,
      ...(classNames
        ? Array.isArray(classNames)
          ? classNames
          : classNames.split(/\s+/).filter(Boolean)
        : [])
    ]

    if (!classes.length) return []

    const data = this.getData(classes)
    const results: any[] = []

    data.forEach((item) => {
      const isAlias = item.rules && Array.isArray(item.rules)

      if (isAlias) {
        this.processAliasItem(item, results)
      } else {
        const { className: itemClassName, cssRules, value, variants } = item
        const rules = this.formatRules(cssRules, value)
        const finalValue = Array.isArray(cssRules) || value === null ? '' : `: ${value}`

        if (!variants) {
          results.push(`.${itemClassName} {\n${this.addTabs(rules + finalValue)}\n}`)
        } else {
          if (variants.data.includes('&')) {
            const selector = variants.data.replace(/&/g, `.${itemClassName}`)
            results.push(`${selector} {\n${this.addTabs(rules + finalValue)}\n}`)
          } else {
            results.push(
              `${variants.data} {\n${this.addTabs(
                `.${itemClassName} {\n${this.addTabs(rules + finalValue)}\n}`
              )}\n}`
            )
          }
        }
      }
    })

    return results
  }
}

export { TenoxUI as Core } from '@tenoxui/core'
