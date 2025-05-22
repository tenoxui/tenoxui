import { TenoxUI as Core, toKebabCase, Result } from '@tenoxui/core'
import { TenoxUI as Moxie } from '@tenoxui/moxie'
import { Config, ShorthandItem, AliasItem } from './types'
import type { CSSProperty } from '@tenoxui/types'

export class TenoxUI extends Core {
  private safelist: string[]
  private tabSize: number
  private typeOrder: string[]
  private selectorPrefix: string

  constructor({
    // core config
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = {},
    variants = {},
    // tenoxui config
    safelist = [],
    tabSize = 2,
    moxie = Moxie,
    moxieOptions = {},
    prefixLoaderOptions = {},
    reservedVariantChars = [],
    typeOrder = [],
    selectorPrefix = ''
  }: Partial<Config> = {}) {
    super({
      property,
      values,
      classes,
      aliases,
      breakpoints,
      tenoxui: moxie,
      tenoxuiOptions: moxieOptions,
      prefixLoaderOptions,
      reservedVariantChars,
      variants
    })

    this.safelist = safelist
    this.tabSize = tabSize
    this.typeOrder = typeOrder
    this.selectorPrefix = selectorPrefix
  }

  public addTabs(str: string, size: number = 2, fixedTabs: boolean = false): string {
    const spaces = ' '.repeat(fixedTabs ? size : this.tabSize)
    return str
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => `${spaces}${line}`)
      .join('\n')
  }

  public beautifyRules(input: string, isImportant: boolean = false): string {
    let nestingLevel = 0
    let result = []

    const partsTemp = isImportant ? input.replace(/\s*!important\s*/g, '') : input
    const parts = partsTemp.split(';')
    const hasImportant = isImportant ? ' !important;' : ';'

    for (let i = 0; i < parts.length; i++) {
      let part = parts[i].trim()
      if (part === '') continue

      // handle closing braces
      if (part.includes('}')) {
        const closingBraceParts = part.split('}')

        for (let j = 0; j < closingBraceParts.length; j++) {
          let subPart = closingBraceParts[j].trim()

          if (subPart !== '')
            result.push((nestingLevel > 0 ? this.addTabs(subPart) : subPart) + hasImportant)

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
            const ending = j < openingBraceParts.length - 1 ? ' {' : hasImportant
            result.push((nestingLevel > 0 ? this.addTabs(subPart) : subPart) + ending)
          }
          if (j < openingBraceParts.length - 1) {
            nestingLevel++
          }
        }
      }

      // handle normal rules
      else result.push((nestingLevel > 0 ? this.addTabs(part) : part) + hasImportant)
    }

    return result.join('\n')
  }

  public formatRules(cssRules: string | string[] | null, value: string | null): string {
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

  private formatAliasRules(
    rules: { cssRules: string | string[] | null; value: string | null; isImportant: boolean }[]
  ): string {
    return rules
      .map((rule) => {
        const rules = this.formatRules(rule.cssRules, rule.value)
        const valueItem =
          Array.isArray(rule.cssRules) || rule.value === null ? '' : `: ${rule.value}`

        return `${rules}${valueItem}${rule.isImportant ? ' !important' : ''}`
      })
      .join('; ')
  }

  private createCssBlock(selector: string, rules: string, allowPrefix: boolean = true): string {
    return `${allowPrefix ? this.selectorPrefix : ''}${selector} {\n${this.addTabs(rules)}\n}`
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
            item.variants.forEach((variant) => {
              const variantRules = this.beautifyRules(this.formatAliasRules(variant.rules))
              const variantType = variant.variant

              if (variantType.includes('&')) {
                // Replace & with the raw selector
                const selector = variantType.replace(/&/g, rawSelector)
                variantBlocks.push(this.createCssBlock(selector, variantRules))
              } else {
                const innerBlock = this.createCssBlock(rawSelector, variantRules)
                variantBlocks.push(this.createCssBlock(variantType, innerBlock, false))
              }
            })
          }
        } else {
          const { cssRules, value, variants, isImportant } = item
          const rules = this.formatRules(cssRules, value)
          const valueItem = Array.isArray(cssRules) || value === null ? '' : `: ${value}`

          if (!variants) {
            baseRules.push(this.beautifyRules(rules + valueItem, isImportant))
          } else if (variants && variants.data) {
            if (variants.data.includes('&')) {
              const selector = variants.data.replace(/&/g, rawSelector)
              const finalRules = this.beautifyRules(rules + valueItem, isImportant)
              variantBlocks.push(this.createCssBlock(selector, finalRules))
            } else {
              const finalRules = this.beautifyRules(rules + valueItem, isImportant)
              const innerBlock = this.createCssBlock(rawSelector, finalRules)
              variantBlocks.push(this.createCssBlock(variants.data, innerBlock, false))
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

  private processAliasItem(item: AliasItem, className?: string): string[] {
    const results: string[] = []
    const mainRules = this.beautifyRules(this.formatAliasRules(item.rules), item.isImportant)
    const mainClassName = className || item.className

    if (item.prefix && item.prefix.data) {
      if (item.prefix.data.includes('&')) {
        // Handle ampersand variant, such as pseudo-classes
        const selector = this.replaceAmpersand(item.prefix.data, mainClassName)
        results.push(this.createCssBlock(selector, mainRules))
      } else {
        // Handle nested variant wrapper
        const innerBlock = this.createCssBlock(`.${mainClassName}`, mainRules)
        results.push(this.createCssBlock(item.prefix.data, innerBlock, false))
      }
    } else {
      // no variant
      results.push(this.createCssBlock(`.${mainClassName}`, mainRules))
    }

    // Process variants array if any
    if (item.variants && Array.isArray(item.variants)) {
      item.variants.forEach((variant) => {
        const variantRules = this.beautifyRules(
          this.formatAliasRules(variant.rules),
          item.isImportant
        )
        const variantClassName = variant.className
        const variantType = variant.variant

        if (variantType.includes('&')) {
          const selector = this.replaceAmpersand(variantType, mainClassName)
          results.push(this.createCssBlock(selector, variantRules))
        } else {
          const innerBlock = this.createCssBlock(`.${variantClassName}`, variantRules)
          results.push(this.createCssBlock(variantType, innerBlock, false))
        }
      })
    }

    return results
  }

  private processShorthandItem(item: ShorthandItem): string {
    const { className, cssRules, value, variants, isImportant } = item
    const rules = this.formatRules(cssRules, value)
    const valueItem = Array.isArray(cssRules) || value === null ? '' : `: ${value}`
    const finalRules = this.beautifyRules(rules + valueItem, isImportant)

    if (!variants) {
      return this.createCssBlock(`.${className}`, finalRules)
    }

    if (variants.data && variants.data.includes('&')) {
      const selector = this.replaceAmpersand(variants.data, className)
      return this.createCssBlock(selector, finalRules)
    } else {
      const innerBlock = this.createCssBlock(`.${className}`, finalRules)
      return this.createCssBlock(variants.data as string, innerBlock, false)
    }
  }

  private sortedClassNameItem(classNames: string | string[]): Result[] | null {
    const processedResults = this.process(classNames)

    if (!processedResults || processedResults.length === 0) return null

    const sortedResults = [...processedResults]

    return sortedResults.sort((a, b) => {
      const aRaw = a.raw || []
      const bRaw = b.raw || []
      const aUtility = aRaw[1] || ''
      const bUtility = bRaw[1] || ''

      // find the index in the order array, default to -1 if not found
      const aIndex = this.typeOrder.indexOf(aUtility)
      const bIndex = this.typeOrder.indexOf(bUtility)

      // sort based on the index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }

      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      return 0
    })
  }

  public getRulesData(
    ...classParams: Array<string | string[] | Record<string, string | string[]>>
  ): string[] {
    let results: string[] = []

    // helper function for apply shorthand and alias
    const apply = (classNames: string | string[]) => {
      const data = this.sortedClassNameItem(classNames)
      if (data && data.length > 0) {
        data.forEach((item) => {
          if ('rules' in item) results.push(...this.processAliasItem(item))
          else results.push(this.processShorthandItem(item))
        })
      }
    }

    // process safelist
    if (this.safelist.length > 0) apply(this.safelist)

    // process parameters
    classParams.forEach((param) => {
      if (param === undefined || param === null) return

      // process object parameter
      if (typeof param === 'object' && !Array.isArray(param)) {
        results = results.concat(this.processApplyObject(param))
      }
      // process array ir string parameter
      else if (Array.isArray(param) || typeof param === 'string') {
        if (param.length > 0) apply(param)
      }
    })

    return results
  }

  public render(
    ...classParams: Array<string | string[] | Record<string, string | string[]>>
  ): string {
    return this.getRulesData(...classParams).join('\n')
  }
}

export * from './types'
export { TenoxUI as Core } from '@tenoxui/core'
export { escapeCSSSelector, constructRaw, regexp, Moxie } from '@tenoxui/core'
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
