import type { Property } from '@tenoxui/moxie'
import type { Values, Classes, Aliases } from '@tenoxui/types'
import type { Variants, Breakpoints, TenoxUIConfig, Config, Result } from './types'
import { TenoxUI as Moxie } from '@tenoxui/moxie'

export class TenoxUI {
  private main: Moxie
  private prefixLoader: Moxie
  private engine: typeof Moxie
  private variants: Variants
  private customVariants: Property
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoints
  private tuiConfig: TenoxUIConfig

  constructor({
    variants = {},
    customVariants = {},
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = {},
    tenoxui = Moxie,
    tenoxuiOptions = {}
  }: Partial<Config> = {}) {
    this.engine = tenoxui
    this.variants = variants
    this.customVariants = customVariants
    this.breakpoints = {
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
      '2xl': '96rem',
      ...breakpoints
    }
    this.property = property
    this.classes = classes
    this.aliases = aliases
    this.values = values
    this.tuiConfig = {
      ...tenoxuiOptions,
      property: this.property,
      values: this.values,
      classes: this.classes
    }
    this.main = new this.engine(this.tuiConfig)
    this.prefixLoader = new this.engine({
      property: this.customVariants as Property,
      values: this.breakpoints
    })
  }

  public createEngine(inputConfig: Partial<TenoxUIConfig> = {}): Moxie {
    return new this.engine(inputConfig)
  }

  public getConfig() {
    return this.tuiConfig
  }

  private getPseudoSyntax(prefix: string): string {
    const doubleColonPrefixes = [
      'after',
      'backdrop',
      'before',
      'cue',
      'cue-region',
      'file-selector-button',
      'first-letter',
      'first-line',
      'grammar-error',
      'marker',
      'placeholder',
      'selection',
      'spelling-error',
      'target-text'
    ]

    return doubleColonPrefixes.includes(prefix) ? '::' : ':'
  }

  private getBreakpointQuery(prefix: string): string | null {
    if (prefix.startsWith('min-')) {
      const breakpointName = prefix.substring(4)
      if (this.breakpoints[breakpointName]) {
        return `@media (width >= ${this.breakpoints[breakpointName]})`
      }
    } else if (prefix.startsWith('max-')) {
      const breakpointName = prefix.substring(4)
      if (this.breakpoints[breakpointName]) {
        return `@media (width < ${this.breakpoints[breakpointName]})`
      }
    } else if (this.breakpoints[prefix]) {
      return `@media (width >= ${this.breakpoints[prefix]})`
    }
    return null
  }

  private isCustomPrefix(prefix: string): boolean {
    const parsed = this.prefixLoader.parse(prefix)
    return Boolean(parsed && parsed[1] && parsed[2])
  }

  private processCustomPrefix(prefix: string): string | string[] | null {
    try {
      const processedItems = this.prefixLoader.process(prefix)
      if (processedItems?.length > 0) {
        return processedItems[0].cssRules
      }
    } catch (error) {
      console.error(`Failed to process prefix ${prefix}:`, error)
    }
    return null
  }

  private generatePrefix(prefix: string): string {
    if (this.isCustomPrefix(prefix)) {
      const moxieRule = this.processCustomPrefix(prefix)
      if (moxieRule && typeof moxieRule === 'string') {
        if (moxieRule.startsWith('value:')) {
          const actualRule = moxieRule.substring(6)

          return actualRule
        }
        return moxieRule
      }
    }

    // Handle direct prefix
    if (
      (prefix.startsWith('[') && prefix.endsWith(']')) ||
      (prefix.startsWith('(') && prefix.endsWith(')'))
    ) {
      return this.prefixLoader.processValue(prefix, '', '')
    }

    // Handle breakpoints
    const breakpointQuery = this.getBreakpointQuery(prefix)
    if (breakpointQuery) return breakpointQuery

    if (this.variants[prefix]) return this.variants[prefix]

    const pseudoSyntax = this.getPseudoSyntax(prefix)
    return `&${pseudoSyntax}${prefix}`
  }

  public processAlias(
    className?: string,
    prefix?: string,
    raw?: null | (string | undefined)[]
  ): {
    className: string
    rules: { cssRules: string | string[] | null; value: string | null }[]
    variants:
      | null
      | {
          className: string
          rules: { cssRules: string | string[] | null; value: string | null }[]
          variant: string
        }[]
    raw: null | (string | undefined)[]
  } | null {
    if (!className || !this.aliases[className]) return null

    let finalClass = this.main.escapeCSSSelector(prefix ? `${prefix}:${className}` : className)

    const allRules: { cssRules: string | string[] | null; value: string | null }[] = []
    const prefixRules: {
      className: string
      cssRules: string | string[] | null
      value: string | null
      variant: string
    }[] = []

    this.main.process(this.aliases[className]).map((item) => {
      const { cssRules, value, prefix: itemPrefix } = item

      const variants = itemPrefix
        ? { prefix: itemPrefix, data: this.generatePrefix(itemPrefix) }
        : null

      if (!variants) {
        allRules.push({
          cssRules,
          value
        })
      } else if (variants && variants.prefix === prefix) return
      else {
        prefixRules.push({
          className: variants.data.includes('&')
            ? variants.data.replace('&', finalClass)
            : finalClass,
          cssRules,
          value,
          variant: variants.data
        })
      }

      return
    })

    const mergedVariants = Object.values(
      prefixRules.reduce(
        (acc, curr) => {
          const key = `${curr.className}|${curr.variant}`
          if (!acc[key]) {
            acc[key] = {
              className: curr.className,
              rules: [],
              variant: curr.variant
            }
          }
          acc[key].rules.push({
            cssRules: curr.cssRules,
            value: curr.value
          })
          return acc
        },
        {} as Record<
          string,
          {
            className: string
            rules: { cssRules: string | string[] | null; value: string | null }[]
            variant: string
          }
        >
      )
    )

    return {
      className: finalClass,
      rules: allRules,
      variants: mergedVariants.length > 0 ? mergedVariants : null,
      raw: raw || []
    }
  }

  public process(classNames: string | string[]): Result[] | null {
    const classes = classNames
      ? Array.isArray(classNames)
        ? classNames
        : classNames.split(/\s+/).filter(Boolean)
      : []

    if (!classes || classes.length === 0) return null

    const result: Result[] = []

    for (const className of classes) {
      const parsed = this.main.parse(className, Object.keys(this.aliases))

      if (parsed && parsed[1] && this.aliases[parsed[1]]) {
        const [prefix, type] = parsed
        const aliasResult = this.processAlias(type, prefix, parsed)
        if (aliasResult) {
          result.push(aliasResult)
        }
      } else {
        const processed = this.main.process(className)

        processed.forEach((item) => {
          const { className: itemClassName, cssRules, value, prefix, raw } = item
          result.push({
            className: itemClassName,
            cssRules,
            value,
            variants: prefix ? { name: prefix, data: this.generatePrefix(prefix) } : null,
            raw: raw || null
          })
        })
      }
    }

    return result
  }
}

export { TenoxUI as Moxie } from '@tenoxui/moxie'
export { is } from './utils/is'
export * from './utils/converter'
export * from './types'
export default TenoxUI
