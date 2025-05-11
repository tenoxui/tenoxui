import { TenoxUI as Core, toKebabCase, Result } from '@tenoxui/core'
import { TenoxUI as Moxie } from '@tenoxui/moxie'
import { Config } from './types'
import type { CSSProperty } from '@tenoxui/types'

export class TenoxUI extends Core {
  private safelist: string[]
  private tabSize: number
  private simpleMode: boolean
  private classNameOrder: string[]

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
    moxieOptions = {},
    classNameOrder = []
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
    this.classNameOrder = classNameOrder
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

    let nestingLevel = 0
    let result = []

    const parts = input.split(';')

    for (let i = 0; i < parts.length; i++) {
      let part = parts[i].trim()
      if (part === '') continue

      // handle closing braces
      if (part.includes('}')) {
        const closingBraceParts = part.split('}')

        for (let j = 0; j < closingBraceParts.length; j++) {
          let subPart = closingBraceParts[j].trim()

          if (subPart !== '')
            result.push((nestingLevel > 0 ? this.addTabs(subPart) : subPart) + ';')

          // add closing brace
          if (j < closingBraceParts.length - 1) {
            nestingLevel = Math.max(0, nestingLevel - 1)
            result.push(nestingLevel > 0 ? this.addTabs('}') : '}')
          }
        }
      }

      // handle opening braces
      else if (part.includes('{')) {
        const openingBraceParts = part.split('{')

        for (let j = 0; j < openingBraceParts.length; j++) {
          let subPart = openingBraceParts[j].trim()

          if (subPart !== '') {
            const ending = j < openingBraceParts.length - 1 ? ' {' : ';'
            result.push((nestingLevel > 0 ? this.addTabs(subPart) : subPart) + ending)
          }
          if (j < openingBraceParts.length - 1) {
            nestingLevel++
          }
        }
      }

      // handle normal rules
      else result.push((nestingLevel > 0 ? this.addTabs(part) : part) + ';')
    }

    return result.join('\n')
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
        const rules = this.formatRules(rule.cssRules, rule.value)
        const valueItem =
          Array.isArray(rule.cssRules) || rule.value === null ? '' : `: ${rule.value}`

        return `${rules}${valueItem}`
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

  public processApplyObject(selectorObject: Record<string, string | string[]>): string[] {
    const finalResults: string[] = []

    for (const [rawSelector, classNames] of Object.entries(selectorObject)) {
      const data = this.process(classNames)
      if (!data || 0 > data.length) return []
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
          } else if (variants && variants.data) {
            if (variants.data.includes('&')) {
              const selector = variants.data.replace(/&/g, rawSelector)
              const finalRules = this.beautifyRules(rules + valueItem)
              variantBlocks.push(this.createCssBlock(selector, finalRules))
            } else {
              const finalRules = this.beautifyRules(rules + valueItem)
              const innerBlock = this.createCssBlock(rawSelector, finalRules)
              variantBlocks.push(this.createCssBlock(variants.data, innerBlock))
            }
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

  public sortedClassNameItem(classNames: string | string[]): Result[] | null {
    const processedResults = this.process(classNames)

    if (!processedResults || processedResults.length === 0) return null

    const sortedResults = [...processedResults]

    return sortedResults.sort((a, b) => {
      const aRaw = a.raw || []
      const bRaw = b.raw || []
      const aUtility = aRaw[1] || ''
      const bUtility = bRaw[1] || ''

      // find the index in the order array, default to -1 if not found
      const aIndex = this.classNameOrder.indexOf(aUtility)
      const bIndex = this.classNameOrder.indexOf(bUtility)

      // sort based on the index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }

      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      return 0
    })
  }

  public render(
    ...classParams: Array<string | string[] | Record<string, string | string[]>>
  ): string[] {
    let results: string[] = []

    if (this.safelist.length > 0) {
      const safelistData = this.sortedClassNameItem(this.safelist)
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
          const data = this.sortedClassNameItem(param)
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
          const data = this.sortedClassNameItem(classes)
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

export * from './types'
export { TenoxUI as Core } from '@tenoxui/core'
export type {
  PropertyParamValue,
  PropertyParams,
  ValuePropType,
  PropertyValue,
  Property,
  MoxieConfig,
  Config as CoreConfig,
  Parsed,
  ProcessedStyle
} from '@tenoxui/core'
export default TenoxUI
