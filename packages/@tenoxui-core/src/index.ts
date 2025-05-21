import type { Property } from '@tenoxui/moxie'
import type { Values, Classes, Aliases } from '@tenoxui/types'
import type { Variants, Breakpoints, TenoxUIConfig, Config, Result } from './types'
import { TenoxUI as Moxie, escapeCSSSelector } from '@tenoxui/moxie'
import { merge } from '@nousantx/someutils'

export class TenoxUI {
  private main: Moxie
  private prefixLoader: Moxie
  private engine: typeof Moxie
  private variants: Variants
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoints
  private tuiConfig: TenoxUIConfig

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = {},
    variants = {},
    tenoxui = Moxie,
    tenoxuiOptions = {},
    reservedVariantChars = [],
    prefixLoaderOptions = {}
  }: Partial<Config> = {}) {
    this.engine = tenoxui
    this.variants = variants
    this.property = property
    this.values = values
    this.classes = classes
    this.aliases = aliases
    this.breakpoints = breakpoints
    this.tuiConfig = merge(
      {
        property: this.property,
        values: this.values,
        classes: this.classes,
        prefixChars: reservedVariantChars
      },
      tenoxuiOptions
    )
    this.main = new this.engine(this.tuiConfig)
    this.prefixLoader = new this.engine(
      merge(
        {
          property: this.variants as Property,
          values: this.breakpoints,
          prefixChars: reservedVariantChars
        },
        prefixLoaderOptions
      )
    )
  }

  public createEngine(inputConfig: Partial<TenoxUIConfig> = {}): Moxie {
    return new this.engine(inputConfig)
  }

  public getConfig() {
    return this.tuiConfig
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

  public generatePrefix(prefix: string): null | string {
    if (this.prefixLoader.parse(prefix)) {
      const moxieRule = this.processCustomPrefix(prefix)
      if (moxieRule && typeof moxieRule === 'string') {
        if (moxieRule.startsWith('value:')) {
          const actualRule = moxieRule.substring(6)

          return actualRule
        }
        return moxieRule
      }
    }

    // handle direct prefix
    if (
      (prefix.startsWith('[') && prefix.endsWith(']')) ||
      (prefix.startsWith('(') && prefix.endsWith(')'))
    ) {
      return this.prefixLoader.processValue(prefix, '', '')
    }

    // handle breakpoints
    const breakpointQuery = this.getBreakpointQuery(prefix)
    if (breakpointQuery) return breakpointQuery

    return null
  }

  private isImportantClass(
    className: string,
    index: number,
    importantMap: Record<string, boolean>
  ): boolean {
    const uniqueKey = `${className}:${index}`
    return importantMap[uniqueKey] || false
  }

  private parseImportantClassNames(classNames: string | string[]): {
    parsedClassNames: string[]
    importantMap: Record<string, boolean>
  } {
    const parsedClassNames: string[] = []
    const importantMap: Record<string, boolean> = {}

    const classArray = Array.isArray(classNames)
      ? classNames
      : classNames.split(/\s+/).filter(Boolean)

    // collect all class names with their important status
    const processedClasses: { name: string; isImportant: boolean; originalIndex: number }[] = []

    classArray.forEach((className, index) => {
      if (className.startsWith('!')) {
        // remove the `!` prefix
        const originalName = className.slice(1)
        processedClasses.push({
          name: originalName,
          isImportant: true,
          originalIndex: index
        })
      } else {
        processedClasses.push({
          name: className,
          isImportant: false,
          originalIndex: index
        })
      }
    })

    // create unique keys for the importantMap
    processedClasses.forEach(({ name, isImportant, originalIndex }) => {
      parsedClassNames.push(name)

      // create a unique key using both the class name and its position
      const uniqueKey = `${name}:${originalIndex}`
      importantMap[uniqueKey] = isImportant
    })

    return { parsedClassNames, importantMap }
  }

  public processAlias(
    className?: string,
    prefix?: string,
    raw?: null | (string | undefined)[],
    isImportant: boolean = false
  ): {
    className: string
    rules: { cssRules: string | string[] | null; value: string | null; isImportant: boolean }[]
    isImportant: boolean
    prefix: null | { name: string; data: string | null }
    variants:
      | null
      | {
          className: string
          rules: {
            cssRules: string | string[] | null
            value: string | null
            isImportant: boolean
          }[]
          variant: string
        }[]
    raw: null | (string | undefined)[]
  } | null {
    if (!className || !this.aliases[className]) return null

    let finalClass = escapeCSSSelector(prefix ? `${prefix}:${className}` : className)

    const allRules: {
      cssRules: string | string[] | null
      value: string | null
      isImportant: boolean
    }[] = []
    const prefixRules: {
      className: string
      cssRules: string | string[] | null
      value: string | null
      isImportant: boolean
      variant: string
    }[] = []

    const { parsedClassNames, importantMap } = this.parseImportantClassNames(
      this.aliases[className]
    )

    this.main.process(parsedClassNames).map((item, index) => {
      const { cssRules, value, prefix: itemPrefix, raw } = item
      const isImportant = this.isImportantClass((raw as string[])[6], index, importantMap)

      const variants = itemPrefix
        ? { prefix: itemPrefix, data: this.generatePrefix(itemPrefix) }
        : null

      if (!variants) {
        allRules.push({
          cssRules,
          value,
          isImportant
        })
      } else if ((variants && variants.prefix === prefix) || !variants.data) return
      else {
        prefixRules.push({
          className: variants.data.includes('&')
            ? variants.data.replace('&', finalClass)
            : finalClass,
          cssRules,
          value,
          isImportant,
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
            value: curr.value,
            isImportant: curr.isImportant
          })
          return acc
        },
        {} as Record<
          string,
          {
            className: string
            rules: {
              cssRules: string | string[] | null
              value: string | null
              isImportant: boolean
            }[]
            variant: string
          }
        >
      )
    )

    return {
      className: (isImportant ? '\\!' : '') + finalClass,
      rules: allRules,
      isImportant,
      prefix: prefix ? { name: prefix, data: this.generatePrefix(prefix) } : null,
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

    const { parsedClassNames, importantMap } = this.parseImportantClassNames(classes)

    if (!parsedClassNames || parsedClassNames.length === 0) return null

    const result: Result[] = []

    parsedClassNames.forEach((className, index) => {
      const parsed = this.main.parse(className, Object.keys(this.aliases))
      const isImportant = this.isImportantClass(className, index, importantMap)
      const aliasClass = parsed && parsed[0] ? className.slice(parsed[0].length + 1) : className
      if (parsed && parsed[1] && this.aliases[aliasClass]) {
        const [prefix] = parsed
        if (prefix && !this.generatePrefix(prefix)) return null

        const aliasResult = this.processAlias(aliasClass, prefix, parsed, isImportant)
        if (aliasResult) {
          result.push(aliasResult)
        }
      } else {
        const processed = this.main.process(className)

        processed.forEach((item) => {
          const { className: itemClassName, cssRules, value, prefix, raw } = item

          if (prefix && !this.generatePrefix(prefix)) return

          result.push({
            className: (isImportant ? '\\!' : '') + itemClassName,
            isImportant,
            cssRules,
            value,
            variants: prefix ? { name: prefix, data: this.generatePrefix(prefix) } : null,
            raw: raw || null
          })
        })
      }
    })

    return result
  }
}

export { escapeCSSSelector, constructRaw, regexp, TenoxUI as Moxie } from '@tenoxui/moxie'
export * from './utils/converter'
export * from './types'
export default TenoxUI
