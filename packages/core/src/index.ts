import type {
  Config,
  Plugin,
  Variants,
  Utilities,
  PluginLike,
  InitContext,
  ParseContext,
  PluginFactory,
  RegexPatterns,
  BaseProcessResult,
  CSSPropertyOrVariable,
  ProcessUtilityContext,
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
  TUtilities extends { [type: string]: any } = Utilities<CSSPropertyOrVariable>,
  TVariants extends { [variant: string]: any } = Variants,
  TProcessResult extends BaseProcessResult<any> = BaseProcessResult<string>,
  TProcessUtilitiesResult extends BaseProcessResult<any> = BaseProcessResult<string>
> {
  private utilities: TUtilities
  private variants: TVariants
  private plugins: Plugin[]
  private _cachedRegexp: ParseContext | null = null
  public matcher: ParseContext | null

  // Plugin execution order:
  // 1. init (once)
  // 2. regexp (when matcher cache invalidated)
  // 3. parse (per className)
  // 4. processValue/processVariant (per component)
  // 5. utility/process (per className)

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
    const context: InitContext<TUtilities, TVariants> = {
      getUtilities: () => this.utilities,
      getVariants: () => this.variants,
      process: {
        value: (value: string) => this.processValue(value),
        variant: (variant: string) => this.processVariant(variant),
        utility: (ctx: any) => this.processUtility(ctx),
        className: (cn: string) => this.processClassName(cn),
        classNames: (cns: string | string[]) => this.process(cns)
      },
      parser: (className: string) => this.parse(className),
      regexp: () => this.regexp(),
      addUtility<K extends keyof TUtilities>(name: K, value: TUtilities[K]) {
        this.addUtility(name, value)
      },
      addVariant<K extends keyof TVariants>(name: K, value: TVariants[K]) {
        this.addVariant(name, value)
      },
      addUtilities(utilities: Partial<TUtilities>) {
        this.addUtilities(utilities)
      },
      addVariants(variants: Partial<TVariants>) {
        this.addVariants(variants)
      },
      invalidateCache: () => this.invalidateCache()
    }

    for (const plugin of this.sanitizePlugin('init')) {
      if (plugin.init) {
        try {
          plugin.init(context as any)
        } catch (err) {
          createPluginError('init', plugin.name, err)
        }
      }
    }
  }

  private _initializeMatcher() {
    this.matcher = this.regexp()
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

  public addUtility<K extends keyof TUtilities>(name: K, value: TUtilities[K]): this {
    this.utilities = { ...this.utilities, [name]: value }
    this.invalidateCache()
    return this
  }

  public addVariant<K extends keyof TVariants>(name: K, value: TVariants[K]): this {
    this.variants = { ...this.variants, [name]: value }
    this.invalidateCache()
    return this
  }

  public addUtilities(utilities: Partial<TUtilities>): this {
    this.utilities = { ...this.utilities, ...utilities }
    this.invalidateCache()
    return this
  }

  public addVariants(variants: Partial<TVariants>): this {
    this.variants = { ...this.variants, ...variants }
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
    let regexp = createMatcher(patterns.variant, patterns.utility, patterns.value)

    for (const plugin of this.sanitizePlugin('regexp')) {
      if (plugin.regexp) {
        try {
          const context: ParseContext = { patterns, regexp }

          const result = plugin.regexp(context)

          if (result) {
            if (result.patterns) {
              patterns = { ...patterns, ...result.patterns }
            }

            if (result.regexp) {
              const regexResult = result.regexp
              regexp = typeof regexResult === 'string' ? new RegExp(regexResult) : regexResult
            } else {
              regexp = createMatcher(patterns.variant, patterns.utility, patterns.value)
            }
          }
        } catch (err) {
          createPluginError('regexp', plugin.name, err)
        }
      }
    }

    this._cachedRegexp = { patterns, regexp }
    return this._cachedRegexp
  }

  private sanitizePlugin(name: Exclude<keyof Plugin, 'name' | 'priority'>) {
    return this.plugins.filter((p) => p[name]).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  public parse(className: string): (undefined | string)[] | any | null {
    let { patterns, regexp } = this.regexp()

    for (const plugin of this.sanitizePlugin('parse')) {
      if (plugin.parse) {
        try {
          const context: ParseContext = { patterns, regexp }

          const result = plugin.parse(className, context)
          if (result) return result
        } catch (err) {
          createPluginError('parse', plugin.name, err)
        }
      }
    }

    return className.match(regexp)
  }

  public processValue(value: string): string | null {
    if (!value) return null

    for (const plugin of this.sanitizePlugin('value')) {
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

  public processVariant(variant: string): string | null {
    if (!variant) return null

    for (const plugin of this.sanitizePlugin('variant')) {
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
    for (const plugin of this.sanitizePlugin('utility')) {
      if (plugin.utility) {
        try {
          const context: ProcessUtilityContext = {
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

  public processClassName<T>(className: string): T | null {
    if (typeof className !== 'string' || !className.trim()) return null

    for (const plugin of this.sanitizePlugin('process')) {
      if (plugin.process) {
        try {
          const result = plugin.process(className)
          if (result !== null && result !== undefined) {
            return result as T
          }
        } catch (err) {
          createPluginError('process', plugin.name, err)
        }
      }
    }

    const parsed = this.parse(className)
    if (!parsed) return null

    const [, variant, utility, value] = parsed
    const processed = this.processUtility({ variant, utility, value, className })

    return processed ? (processed as T) : null
  }

  public process<T = unknown>(classNames: string | string[]): T[] | T | null {
    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
    if (classList.length === 0) return null

    const results = classList
      .map((className) => this.processClassName<T>(className))
      .filter(Boolean) as T[]

    return results.length > 0 ? results : null
  }
}

export * from './types'
export * from './utils'
export default TenoxUI
