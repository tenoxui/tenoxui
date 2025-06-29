import type { Utilities, Variants, Plugin, ProcessResult, Config } from './types'

export class TenoxUI {
  private utilities: Utilities
  private variants: Variants
  private plugins: Plugin[]
  private _cachedRegexp: { patterns: any; matcher: RegExp } | null = null
  public matcher: RegExp | null

  constructor({ variants = {}, utilities = {}, plugins = [] }: Config = {}) {
    this.utilities = utilities
    this.variants = variants
    this.plugins = [...plugins].sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this.matcher = null
    this.defaultPattern = '[\\w.-]+'
    this._initializeMatcher()
  }

  private _initializeMatcher() {
    const regexpResult = this.regexp()
    this.matcher = regexpResult.matcher
  }

  public use(plugin: Plugin): this {
    this.plugins.push(plugin)
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this._cachedRegexp = null
    this._initializeMatcher()
    return this
  }

  private createMatcher(variant: string, property: string, value: string) {
    return new RegExp(
      `^(?:(?<variant>${variant}):)?(?<property>${property})(?:-(?<value>${value}?))?$`
    )
  }

  public regexp() {
    if (this._cachedRegexp) {
      return this._cachedRegexp
    }

    let patterns = {
      variant: Object.keys(this.variants).join('|') || this.defaultPattern,
      property: Object.keys(this.utilities).join('|') || this.defaultPattern,
      value: this.defaultPattern
    }
    let matcher = this.createMatcher(patterns.variant, patterns.property, patterns.value)

    const regexpPlugins = this.plugins
      .filter((p) => p.regexp)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of regexpPlugins) {
      if (plugin.regexp) {
        try {
          const result = plugin.regexp({
            patterns,
            matcher,
            utilities: this.utilities,
            variants: this.variants
          })

          if (result) {
            if (result.patterns) {
              patterns = { ...patterns, ...result.patterns }
            }

            if (result.matcher) {
              matcher = result.matcher
            } else {
              matcher = this.createMatcher(patterns.variant, patterns.property, patterns.value)
            }
          }
        } catch (err) {
          console.error(`Plugin "${plugin.name}" regexp failed:`, err)
        }
      }
    }

    this._cachedRegexp = { patterns, matcher }
    return this._cachedRegexp
  }

  public parse(className: string, safelist?: string[]): any[] | null {
    let { patterns, matcher } = this.regexp()

    // Process class names with plugins (sorted by priority)
    const parsePlugins = this.plugins
      .filter((p) => p.parse)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of parsePlugins) {
      if (plugin.parse) {
        try {
          const result = plugin.parse(className, {
            patterns,
            matcher,
            utilities: this.utilities,
            variants: this.variants
          })
          if (result) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" parse failed:`, err)
        }
      }
    }

    // Default parser
    const match = className.match(matcher)
    if (!match) return null
    return match.groups
      ? [match[0], match.groups.variant, match.groups.property, match.groups.value]
      : match
  }

  private processValue(value: string): string | null {
    if (!value) return null

    // Process with plugins (sorted by priority)
    const valuePlugins = this.plugins
      .filter((p) => p.processValue)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of valuePlugins) {
      if (plugin.processValue) {
        try {
          const result = plugin.processValue(value, this.utilities)
          if (result !== null && result !== undefined) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" processValue failed:`, err)
        }
      }
    }

    return value
  }

  private processVariant(variant: string): string | null {
    if (!variant) return null

    // Process with plugins (sorted by priority)
    const variantPlugins = this.plugins
      .filter((p) => p.processVariant)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of variantPlugins) {
      if (plugin.processVariant) {
        try {
          const result = plugin.processVariant(variant, this.variants)
          if (result !== null && result !== undefined) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" processVariant failed:`, err)
        }
      }
    }

    return this.variants[variant] || null
  }

  public processUtilities({
    variant = null,
    property = '',
    value = '',
    className = ''
  }: {
    variant?: string | null
    property?: string
    value?: string
    className?: string
  } = {}): ProcessResult | null {
    // Process with plugins (sorted by priority)
    const utilityPlugins = this.plugins
      .filter((p) => p.processUtilities)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of utilityPlugins) {
      if (plugin.processUtilities) {
        try {
          const result = plugin.processUtilities({
            variant: variant
              ? {
                  raw: variant,
                  data: this.variants[variant] || null
                }
              : null,
            property: {
              name: property,
              data: this.utilities[property]
            },
            value: {
              raw: value,
              data: this.processValue(value)
            },
            className,
            utilities: this.utilities,
            variants: this.variants,
            parser: (className: string) => this.parse(className),
            regexp: () => this.regexp()
          })
          if (result) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" processUtilities failed:`, err)
        }
      }
    }

    const finalValue = this.processValue(value || '')
    const variantData = variant ? this.processVariant(variant) : null

    // More robust validation
    if (value && !finalValue) return null
    // if (variant && !variantData) return null
    if (!this.utilities[property]) return null

    return {
      className,
      variant: variant
        ? {
            name: variant,
            data: variantData!
          }
        : null,
      rules: {
        type: property,
        property: this.utilities[property]
      },
      value: finalValue
    }
  }

  public process(classNames: string | string[]): ProcessResult[] | null {
    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
    const results: ProcessResult[] = []

    for (const className of classList) {
      if (!className.trim()) continue

      let pluginHandled = false

      // Process with plugins (sorted by priority)
      const processPlugins = this.plugins
        .filter((p) => p.process)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))

      for (const plugin of processPlugins) {
        if (plugin.process) {
          try {
            const result = plugin.process(className, {
              regexp: () => this.regexp(),
              parser: (cls: string) => this.parse(cls),
              processor: (
                data: Partial<{
                  variant: string | null
                  property: string
                  value: string
                  className: string
                }>
              ) => this.processUtilities(data),
              utilities: this.utilities,
              variants: this.variants
            })
            if (result) {
              results.push(result)
              pluginHandled = true
              break
            }
          } catch (err) {
            console.error(`Plugin "${plugin.name}" process failed:`, err)
          }
        }
      }

      // Only run default parser if no plugin handled the className
      if (!pluginHandled) {
        const parsed = this.parse(className)
        if (!parsed) {
          continue
        }

        const [, variant, property, value] = parsed
        const processed = this.processUtilities({ variant, property, value, className })

        if (processed) {
          results.push(processed)
        }
      }
    }

    return results.length > 0 ? results : null
  }

  // Utility methods for debugging
  public getPluginsByPriority(): Plugin[] {
    return [...this.plugins].sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  public clearCache(): this {
    this._cachedRegexp = null
    this._initializeMatcher()
    return this
  }
}
