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
import { escapeRegex, createMatcher, flattenPlugins, DEFAULT_GLOBAL_PATTERN } from './utils'

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
  // 5. processUtilities/process (per className)
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
      processValue: (value: string) => this.processValue(value),
      processVariant: (variant: string) => this.processVariant(variant),
      processUtilities: (ctx: any) => this.processUtilities(ctx),
      parser: (className: string) => this.parse(className),
      regexp: () => this.regexp(),
      addUtility: (name: string, value: any) => this.addUtility(name, value),
      addVariant: (name: string, value: any) => this.addVariant(name, value),
      addUtilities: (utilities: Record<string, any>) => this.addUtilities(utilities),
      addVariants: (variants: Record<string, any>) => this.addVariants(variants),
      invalidateCache: () => this.invalidateCache()
    }

    for (const plugin of this.plugins) {
      if (plugin.onInit) {
        try {
          plugin.onInit(context)
        } catch (err) {
          console.error(`Plugin "${plugin.name}" onInit failed:`, err)
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
      property: Object.keys(this.utilities).map(escapeRegex).join('|') || DEFAULT_GLOBAL_PATTERN,
      value: DEFAULT_GLOBAL_PATTERN
    }
    let matcher = createMatcher(patterns.variant, patterns.property, patterns.value)

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
              matcher = createMatcher(patterns.variant, patterns.property, patterns.value)
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
          const context: ParseContext = { patterns, matcher }

          const result = plugin.parse(className, context)
          if (result) return result
        } catch (err) {
          console.error(`Plugin "${plugin.name}" parse failed:`, err)
        }
      }
    }

    return className.match(matcher)
  }

  private processValue(value: string): string | null {
    if (!value) return null

    const valuePlugins = this.plugins
      .filter((p) => p.processValue)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    for (const plugin of valuePlugins) {
      if (plugin.processValue) {
        try {
          const result = plugin.processValue(value)
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
          const result = plugin.processVariant(variant)
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
            raw: this.parse(className)
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
            const result = plugin.process(className)
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

    return results.length > 0 ? results : null
  }
}

export * from './types'
export * from './utils'
export default TenoxUI
