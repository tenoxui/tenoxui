import { TenoxUI as Core, toKebabCase } from '@tenoxui/core'
import { TenoxUI as Moxie } from '@tenoxui/moxie'
import { Config } from './types'
import type { CSSProperty } from '@tenoxui/types'

export class TenoxUI extends Core {
  private safelist: string[]
  private tabSize: number
  private simpleMode: boolean

  constructor({
    // core config
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = {},
    variants = {},
    customVariants = {},
    // tenoxui config
    safelist = [],
    tabSize = 2,
    simple = false,
    moxie = Moxie,
    moxieOptions = {}
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
    this.tabSize = simple ? 0 : tabSize
    this.simpleMode = simple
  }

  public simple() {
    this.simpleMode = true
    this.tabSize = 0
    return this
  }

  public addTabs(str: string, size: number = 2, fixedTabs: boolean = false): string {
    const spaces = ' '.repeat(fixedTabs ? size : this.tabSize)
    return str
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => `${spaces}${line}`)
      .join('\n')
  }

  public beautifyRules(input: string): string {
    if (this.simpleMode) return input

    return input
      .split(';')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line + ';')
      .join('\n')
  }

  private formatRules(cssRules: string | string[] | null, value: string | null): string {
    if (Array.isArray(cssRules) && value !== null) {
      return cssRules
        .map((prop: string) =>
          value
            ? `${toKebabCase(String(prop) as CSSProperty)}: ${value}`
            : toKebabCase(String(prop) as CSSProperty)
        )
        .join('; ')
    }
    return cssRules as string
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

  private createCssBlock(selector: string, rules: string): string {
    const spacing = this.simpleMode ? ' ' : '\n'

    return `${selector} {${spacing}${this.addTabs(rules)}${spacing}}`
  }

  private replaceAmpersand(template: string, className: string): string {
    return template.replace(/&/g, `.${className}`)
  }

  public processApplyObject(selectorObject: Record<string, string>): string[] {
    const finalResults: string[] = []

    for (const [rawSelector, classNames] of Object.entries(selectorObject)) {
      const data = this.process(classNames)
      if (!data || !data.length > 0) return []
      const baseRules: string[] = []
      const variantBlocks: string[] = []
      data.forEach((item) => {
        if ('rules' in item) {
          const mainRules = this.formatAliasRules(item.rules)
          baseRules.push(mainRules)

          if (item.variants && Array.isArray(item.variants)) {
            item.variants.forEach((variant: any) => {
              const variantRules = this.beautifyRules(this.formatAliasRules(variant.rules))
              const variantType = variant.variant

              if (variantType.includes('&')) {
                // Replace & with the raw selector
                const selector = variantType.replace(/&/g, rawSelector)
                variantBlocks.push(this.createCssBlock(selector, variantRules))
              } else {
                const innerBlock = this.createCssBlock(rawSelector, variantRules)
                variantBlocks.push(this.createCssBlock(variantType, innerBlock))
              }
            })
          }
        } else {
          const { cssRules, value, variants } = item
          const rules = this.formatRules(cssRules, value)
          const valueItem = Array.isArray(cssRules) || value === null ? '' : `: ${value}`

          if (!variants) {
            baseRules.push(rules + valueItem)
          } else if (variants.data.includes('&')) {
            const selector = variants.data.replace(/&/g, rawSelector)
            const finalRules = this.beautifyRules(rules + valueItem)
            variantBlocks.push(this.createCssBlock(selector, finalRules))
          } else {
            const finalRules = this.beautifyRules(rules + valueItem)
            const innerBlock = this.createCssBlock(rawSelector, finalRules)
            variantBlocks.push(this.createCssBlock(variants.data, innerBlock))
          }
        }
      })

      if (baseRules.length > 0) {
        const combinedBaseRules = this.beautifyRules(baseRules.join('; '))
        finalResults.push(this.createCssBlock(rawSelector, combinedBaseRules))
      }

      if (variantBlocks.length > 0) {
        finalResults.push(...variantBlocks)
      }
    }

    return finalResults
  }

  private processAliasItem(item: any, className?: string): string[] {
    const results: string[] = []
    const mainRules = this.beautifyRules(this.formatAliasRules(item.rules))
    const mainClassName = className || item.className

    if (item.prefix) {
      if (item.prefix.data.includes('&')) {
        // Handle ampersand variant, such as pseudo-classes
        const selector = this.replaceAmpersand(item.prefix.data, mainClassName)
        results.push(this.createCssBlock(selector, mainRules))
      } else {
        // Handle nested variant wrapper
        const innerBlock = this.createCssBlock(`.${mainClassName}`, mainRules)
        results.push(this.createCssBlock(item.prefix.data, innerBlock))
      }
    } else {
      // no variant
      results.push(this.createCssBlock(`.${mainClassName}`, mainRules))
    }

    // Process variants array if any
    if (item.variants && Array.isArray(item.variants)) {
      item.variants.forEach((variant: any) => {
        const variantRules = this.beautifyRules(this.formatAliasRules(variant.rules))
        const variantClassName = variant.className
        const variantType = variant.variant

        if (variantType.includes('&')) {
          const selector = this.replaceAmpersand(variantType, mainClassName)
          results.push(this.createCssBlock(selector, variantRules))
        } else {
          const innerBlock = this.createCssBlock(`.${variantClassName}`, variantRules)
          results.push(this.createCssBlock(variantType, innerBlock))
        }
      })
    }

    return results
  }

  private processShorthandItem(item: any): string {
    const { className, cssRules, value, variants } = item
    const rules = this.formatRules(cssRules, value)
    const valueItem = Array.isArray(cssRules) || value === null ? '' : `: ${value}`
    const finalRules = this.beautifyRules(rules + valueItem)

    if (!variants) {
      return this.createCssBlock(`.${className}`, finalRules)
    }

    if (variants.data.includes('&')) {
      const selector = this.replaceAmpersand(variants.data, className)
      return this.createCssBlock(selector, finalRules)
    } else {
      const innerBlock = this.createCssBlock(`.${className}`, finalRules)
      return this.createCssBlock(variants.data, innerBlock)
    }
  }

  public render(
    ...classParams: Array<string | string[] | Record<string, string | string[]>>
  ): string[] {
    let results: string[] = []

    if (this.safelist.length > 0) {
      const safelistData = this.process(this.safelist)
      if (safelistData && safelistData.length > 0) {
        safelistData.forEach((item) => {
          if ('rules' in item) results.push(...this.processAliasItem(item))
          else results.push(this.processShorthandItem(item))
        })
      }
    }

    // Process each parameter in order
    classParams.forEach((param) => {
      if (param === undefined || param === null) return

      // Process styles from object, direct styles
      if (typeof param === 'object' && !Array.isArray(param)) {
        results = results.concat(this.processApplyObject(param))
      }
      // Process array type
      else if (Array.isArray(param)) {
        if (param.length > 0) {
          const data = this.process(param)
          if (data && data.length > 0) {
            data.forEach((item) => {
              if ('rules' in item) results.push(...this.processAliasItem(item))
              else results.push(this.processShorthandItem(item))
            })
          }
        }
      }
      // Process string type
      else if (typeof param === 'string') {
        const classes = param.split(/\s+/).filter(Boolean)
        if (classes.length > 0) {
          const data = this.process(classes)
          if (data && data.length > 0) {
            data.forEach((item) => {
              if ('rules' in item) results.push(...this.processAliasItem(item))
              else results.push(this.processShorthandItem(item))
            })
          }
        }
      }
    })

    return results
  }
}

export { TenoxUI as Core } from '@tenoxui/core'
