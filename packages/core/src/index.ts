import type {
  Config,
  Plugin,
  Variants,
  Utilities,
  PluginLike,
  ParseContext,
  PluginFactory,
  RegexpContext,
  RegexPatterns,
  ProcessContext,
  BaseProcessResult,
  ProcessUtilitiesContext,
  DefaultProcessUtilityResult
} from './types'

export class TenoxUI<
  TUtilities extends { [type: string]: any } = Utilities,
  TVariants extends { [variant: string]: any } = Variants,
  TProcessResult extends BaseProcessResult<any> = BaseProcessResult<string>,
  TProcessUtilitiesResult extends BaseProcessResult<any> = BaseProcessResult<string>
> {
  private utilities: TUtilities
  private variants: TVariants
  private plugins: Plugin[]
  private _cachedRegexp: { patterns: RegexPatterns; matcher: RegExp } | null = null
  public matcher: RegExp | null
  private defaultPattern: string

  constructor(config: Config<TUtilities, TVariants, TProcessResult, TProcessUtilitiesResult> = {}) {
    const { variants, utilities, plugins = [] } = config
    this.utilities = (utilities || {}) as TUtilities
    this.variants = (variants || {}) as TVariants
    this.plugins = this.flattenPlugins(plugins).sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    )
    this.matcher = null
    this.defaultPattern = '[\\w.-]+'
    this._initializeMatcher()
  }

  private flattenPlugins(plugins: (Plugin | PluginFactory | PluginLike)[]): Plugin[] {
    const flattened: Plugin[] = []

    for (const plugin of plugins) {
      if (typeof plugin === 'function') {
        const result = plugin()
        if (Array.isArray(result)) {
          flattened.push(...result)
        } else {
          flattened.push(result)
        }
      } else if (Array.isArray(plugin)) {
        flattened.push(...plugin)
      } else {
        flattened.push(plugin as Plugin)
      }
    }

    return flattened
  }

  private _initializeMatcher() {
    const regexpResult = this.regexp()
    this.matcher = regexpResult.matcher
  }

  public use(...plugin: (Plugin | PluginFactory | PluginLike)[]): this {
    const newPlugins = this.flattenPlugins(plugin)
    this.plugins.push(...newPlugins)
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this._cachedRegexp = null
    this._initializeMatcher()
    return this
  }

  private createMatcher(variant?: string, property?: string, value?: string) {
    return new RegExp(
      `^(?:(?<variant>${variant || this.defaultPattern}):)?(?<property>${
        property || this.defaultPattern
      })(?:-(?<value>${value || this.defaultPattern}?))?$`
    )
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\/\\-]/g, '\\$&')
  }

  public regexp() {
    if (this._cachedRegexp) {
      return this._cachedRegexp
    }

    let patterns: RegexPatterns = {
      variant: Object.keys(this.variants).map(this.escapeRegex).join('|') || this.defaultPattern,
      property: Object.keys(this.utilities).map(this.escapeRegex).join('|') || this.defaultPattern,
      value: this.defaultPattern
    }
    let matcher = this.createMatcher(patterns.variant, patterns.property, patterns.value)

    const regexpPlugins = this.plugins
      .filter((p) => p.regexp)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of regexpPlugins) {
      if (plugin.regexp) {
        try {
          const context: RegexpContext = {
            patterns,
            matcher,
            utilities: this.utilities,
            variants: this.variants
          }

          const result = plugin.regexp(context)

          if (result) {
            if (result.patterns) {
              patterns = { ...patterns, ...result.patterns }
            }

            if (result.matcher) {
              matcher = result.matcher
            } else {
              matcher = this.createMatcher(
                patterns.variant || this.defaultPattern,
                patterns.property || this.defaultPattern,
                patterns.value || this.defaultPattern
              )
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

  public parse(className: string, safelist?: string[]): (undefined | string)[] | any | null {
    let { patterns, matcher } = this.regexp()

    const parsePlugins = this.plugins
      .filter((p) => p.parse)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of parsePlugins) {
      if (plugin.parse) {
        try {
          const context: ParseContext = {
            patterns,
            matcher,
            utilities: this.utilities,
            variants: this.variants
          }

          const result = plugin.parse(className, context)
          if (result) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" parse failed:`, err)
        }
      }
    }

    const match = className.match(matcher)
    return !match
      ? null
      : match.groups
        ? [match[0], match.groups.variant, match.groups.property, match.groups.value]
        : match
  }

  private processValue(value: string): string | null {
    if (!value) return null

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

  public processUtilities<T = BaseProcessResult>({
    variant = null,
    property = '',
    value = '',
    className = ''
  }: {
    variant?: string | null
    property?: string
    value?: string
    className?: string
  } = {}): T | (BaseProcessResult & DefaultProcessUtilityResult) | unknown {
    const utilityPlugins = this.plugins
      .filter((p) => p.processUtilities)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of utilityPlugins) {
      if (plugin.processUtilities) {
        try {
          const context: ProcessUtilitiesContext = {
            className,
            property: this.utilities[property],
            value: this.processValue(value),
            variant: variant ? this.processVariant(variant) : null,
            raw: this.parse(className),
            utilities: this.utilities,
            variants: this.variants,
            parser: (className: string) => this.parse(className),
            regexp: () => this.regexp()
          }

          const result = plugin.processUtilities(context)

          if (result !== null && result !== undefined) return result as T
        } catch (err) {
          console.error(`Plugin "${plugin.name}" processUtilities failed:`, err)
        }
      }
    }

    const finalValue = this.processValue(value || '')
    const variantData = variant ? this.processVariant(variant) : null

    if (!this.utilities[property]) return null

    return {
      className,
      property: this.utilities[property],
      value: finalValue,
      variant: variantData,
      raw: this.parse(className)
    } satisfies BaseProcessResult & DefaultProcessUtilityResult
  }

  public process<T = unknown>(classNames: string | string[]): T[] | T | null {
    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
    const results: T[] = []

    if (classList.length < 0) return null

    for (const className of classList) {
      if (!className.trim()) continue

      let pluginHandled = false

      const processPlugins = this.plugins
        .filter((p) => p.process)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))

      for (const plugin of processPlugins) {
        if (plugin.process) {
          try {
            const context: ProcessContext = {
              regexp: () => this.regexp(),
              parser: (cls: string) => this.parse(cls),
              processUtility: (
                ctx: Partial<{
                  variant: string | null
                  property: string
                  value: string
                  className: string
                }>
              ) => this.processUtilities(ctx),
              processValue: (value: string) => this.processValue(value),
              processVariant: (variant: string) => this.processVariant(variant),
              utilities: this.utilities,
              variants: this.variants
            }

            const result = plugin.process(className, context)
            if (result !== null && result !== undefined) {
              results.push(result as T)
              pluginHandled = true
              break
            }
          } catch (err) {
            console.error(`Plugin "${plugin.name}" process failed:`, err)
          }
        }
      }

      if (!pluginHandled) {
        const parsed = this.parse(className)
        if (!parsed) {
          continue
        }

        const [, variant, property, value] = parsed
        const processed = this.processUtilities({ variant, property, value, className })

        if (processed) {
          results.push(processed as T)
        }
      }
    }

    const transformPlugins = this.plugins
      .filter((p) => p.transform)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of transformPlugins) {
      if (plugin.transform) {
        try {
          const result = plugin.transform(results)
          if (result) return result as T[] | T
        } catch (err) {
          console.error(`Plugin "${plugin.name}" transform failed:`, err)
        }
      }
    }

    return results.length > 0 ? results : null
  }

  public getPluginsByPriority(): Plugin[] {
    return [...this.plugins].sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  public getPluginsByName(namePattern: string | RegExp): Plugin[] {
    const pattern = typeof namePattern === 'string' ? new RegExp(namePattern) : namePattern

    return this.plugins.filter((plugin) => plugin.name && pattern.test(plugin.name))
  }

  public removePlugins(namePattern: string | RegExp): this {
    const pattern = typeof namePattern === 'string' ? new RegExp(namePattern) : namePattern

    this.plugins = this.plugins.filter((plugin) => !plugin.name || !pattern.test(plugin.name))

    this._cachedRegexp = null
    this._initializeMatcher()
    return this
  }

  public clearCache(): this {
    this._cachedRegexp = null
    this._initializeMatcher()
    return this
  }

  public processWithPlugin<T>(className: string, pluginName: string): T | null {
    const plugin = this.plugins.find((p) => p.name === pluginName)
    if (!plugin?.process) return null

    try {
      const context: ProcessContext = {
        regexp: () => this.regexp(),
        parser: (cls: string) => this.parse(cls),
        processUtility: (
          ctx: Partial<{
            variant: string | null
            property: string
            value: string
            className: string
          }>
        ) => this.processUtilities(ctx),
        processValue: (value: string) => this.processValue(value),
        processVariant: (variant: string) => this.processVariant(variant),
        utilities: this.utilities,
        variants: this.variants
      }

      const result = plugin.process(className, context)
      return result as T | null
    } catch (err) {
      console.error(`Plugin "${pluginName}" process failed:`, err)
      return null
    }
  }
}

export * from './types'
export default TenoxUI
