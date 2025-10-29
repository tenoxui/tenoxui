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
  BaseProcessResult,
  ProcessUtilitiesContext,
  DefaultProcessUtilityResult
} from './types'
import {
  escapeRegex,
  createMatcher,
  flattenPlugins,
  createPluginError,
  DEFAULT_GLOBAL_PATTERN
} from './utils'

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

  // Plugin execution order:
  // 1. onInit (once)
  // 2. regexp (when matcher cache invalidated)
  // 3. parse (per className)
  // 4. processValue/processVariant (per component)
  // 5. utility/process (per className)
  // 6. transform (per batch)

  constructor(config: Config<TUtilities, TVariants, TProcessResult, TProcessUtilitiesResult> = {}) {
    const { variants, utilities, plugins = [] } = config
    this.utilities = (utilities || {}) as TUtilities
    this.variants = (variants || {}) as TVariants
    this.plugins = flattenPlugins(plugins as (Plugin | PluginFactory | PluginLike)[]).sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    )
    this.matcher = null
    this._initializePlugins()
    this._initializeMatcher()
  }

  private _initializePlugins() {
    const context = {
      utilities: this.utilities,
      variants: this.variants,
      process: {
        value: (value: string) => this.processValue(value),
        variant: (variant: string) => this.processVariant(variant),
        utility: (ctx: any) => this.processUtility(ctx)
      },
      parser: (className: string) => this.parse(className),
      regexp: () => this.regexp(),
      addUtility: (name: string, value: any) => this.addUtility(name, value),
      addVariant: (name: string, value: any) => this.addVariant(name, value),
      addUtilities: (utilities: Record<string, any>) => this.addUtilities(utilities),
      addVariants: (variants: Record<string, any>) => this.addVariants(variants),
      invalidateCache: () => this.invalidateCache()
    }

    for (const plugin of this.plugins) {
      if (plugin.init) {
        try {
          plugin.init(context)
        } catch (err) {
          createPluginError('init', plugin.name, err)
        }
      }
    }
  }

  private _initializeMatcher() {
    const regexpResult = this.regexp()
    this.matcher = regexpResult.matcher
  }

  public use(...plugin: (Plugin | PluginFactory | PluginLike)[]): this {
    const newPlugins = flattenPlugins(plugin)
    this.plugins.push(...newPlugins)
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this._cachedRegexp = null
    this._initializePlugins()
    this._initializeMatcher()
    return this
  }

  public addUtility(name: string, value: any): this {
    this.utilities = { ...this.utilities, [name]: value } as TUtilities
    this.invalidateCache()
    return this
  }

  public addVariant(name: string, value: any): this {
    this.variants = { ...this.variants, [name]: value } as TVariants
    this.invalidateCache()
    return this
  }

  public addUtilities(utilities: Record<string, any>): this {
    this.utilities = { ...this.utilities, ...utilities } as TUtilities
    this.invalidateCache()
    return this
  }

  public addVariants(variants: Record<string, any>): this {
    this.variants = { ...this.variants, ...variants } as TVariants
    this.invalidateCache()
    return this
  }

  public removeUtility(name: string): this {
    const { [name]: removed, ...rest } = this.utilities
    this.utilities = rest as TUtilities
    this.invalidateCache()
    return this
  }

  public removeVariant(name: string): this {
    const { [name]: removed, ...rest } = this.variants
    this.variants = rest as TVariants
    this.invalidateCache()
    return this
  }

  public invalidateCache(): void {
    this._cachedRegexp = null
    this._initializeMatcher()
  }

  public regexp() {
    if (this._cachedRegexp) {
      return this._cachedRegexp
    }

    let patterns: RegexPatterns = {
      variant: Object.keys(this.variants).map(escapeRegex).join('|') || DEFAULT_GLOBAL_PATTERN,
      utility: Object.keys(this.utilities).map(escapeRegex).join('|') || DEFAULT_GLOBAL_PATTERN,
      value: DEFAULT_GLOBAL_PATTERN
    }
    let matcher = createMatcher(patterns.variant, patterns.utility, patterns.value)

    const regexpPlugins = this.plugins
      .filter((p) => p.regexp)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of regexpPlugins) {
      if (plugin.regexp) {
        try {
          const context: RegexpContext = { patterns, matcher }

          const result = plugin.regexp(context)

          if (result) {
            if (result.patterns) {
              patterns = { ...patterns, ...result.patterns }
            }

            if (result.matcher) {
              matcher = result.matcher
            } else {
              matcher = createMatcher(patterns.variant, patterns.utility, patterns.value)
            }
          }
        } catch (err) {
          createPluginError('regexp', plugin.name, err)
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
          const context: ParseContext = { patterns, matcher }

          const result = plugin.parse(className, context)
          if (result) return result
        } catch (err) {
          createPluginError('parse', plugin.name, err)
        }
      }
    }

    return className.match(matcher)
  }

  private processValue(value: string): string | null {
    if (!value) return null

    const valuePlugins = this.plugins
      .filter((p) => p.value)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of valuePlugins) {
      if (plugin.value) {
        try {
          const result = plugin.value(value)
          if (result !== null && result !== undefined) return result
        } catch (err) {
          createPluginError('value', plugin.name, err)
        }
      }
    }

    return value
  }

  private processVariant(variant: string): string | null {
    if (!variant) return null

    const variantPlugins = this.plugins
      .filter((p) => p.variant)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of variantPlugins) {
      if (plugin.variant) {
        try {
          const result = plugin.variant(variant)
          if (result !== null && result !== undefined) return result
        } catch (err) {
          createPluginError('variant', plugin.name, err)
        }
      }
    }

    return this.variants[variant] || null
  }

  public processUtility<T = BaseProcessResult>({
    variant = null,
    utility = '',
    value = '',
    className = ''
  }: {
    variant?: string | null
    utility?: string
    value?: string
    className?: string
  } = {}): T | (BaseProcessResult & DefaultProcessUtilityResult) | unknown {
    const utilityPlugins = this.plugins
      .filter((p) => p.utility)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of utilityPlugins) {
      if (plugin.utility) {
        try {
          const context: ProcessUtilitiesContext = {
            className,
            utility: this.utilities[utility],
            value: this.processValue(value),
            variant: variant ? this.processVariant(variant) : null,
            raw: this.parse(className)
          }

          const result = plugin.utility(context)

          if (result !== null && result !== undefined) return result as T
        } catch (err) {
          createPluginError('utility', plugin.name, err)
        }
      }
    }

    const finalValue = this.processValue(value || '')
    const variantData = variant ? this.processVariant(variant) : null

    if (!this.utilities[utility]) return null

    return {
      className,
      utility: this.utilities[utility],
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
            const result = plugin.process(className)
            if (result !== null && result !== undefined) {
              results.push(result as T)
              pluginHandled = true
              break
            }
          } catch (err) {
            createPluginError('process', plugin.name, err)
          }
        }
      }

      if (!pluginHandled) {
        const parsed = this.parse(className)
        if (!parsed) {
          continue
        }

        const [, variant, utility, value] = parsed
        const processed = this.processUtility({ variant, utility, value, className })

        if (processed) {
          results.push(processed as T)
        }
      }
    }

    return results.length > 0 ? results : null
  }
}

export * from './types'
export * from './utils'
export default TenoxUI
