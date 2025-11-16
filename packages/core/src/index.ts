import type {
  Config,
  Plugin,
  Variants,
  Utilities,
  PluginLike,
  ParseContext,
  PluginFactory,
  RegexPatterns,
  BaseProcessResult,
  CSSPropertyOrVariable,
  DefaultProcessUtilityResult
} from './types'
import {
  LRUCache,
  escapeRegex,
  createMatcher,
  isValidResult,
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
  public matcher: ParseContext | null

  private _matcherCache: ParseContext | null = null
  private _parseCache: LRUCache<string, any>
  private _valueCache: LRUCache<string, string | null>
  private _variantCache: LRUCache<string, string | null>
  private _utilityCache: LRUCache<string, any>
  private _cnCache: LRUCache<string, any>

  private _hooks: Map<string, Plugin[]>

  constructor({
    variants,
    utilities,
    plugins = [],
    cacheSize = 1000
  }: Config<TUtilities, TVariants, TProcessResult, TProcessUtilitiesResult> = {}) {
    this.utilities = (utilities || {}) as TUtilities
    this.variants = (variants || {}) as TVariants
    this.plugins = flattenPlugins(plugins as (Plugin | PluginFactory | PluginLike)[]).sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    )
    this.matcher = null

    this._parseCache = new LRUCache(cacheSize)
    this._valueCache = new LRUCache(cacheSize)
    this._variantCache = new LRUCache(cacheSize)
    this._utilityCache = new LRUCache(cacheSize * 2)
    this._cnCache = new LRUCache(cacheSize * 2)
    this._hooks = new Map()

    this._initializePlugins()
    this._initializeMatcher()
  }

  private sanitizePlugin(name: Exclude<keyof Plugin, 'name' | 'priority'>): Plugin[] {
    if (!this._hooks.has(name)) {
      const filtered = this.plugins
        .filter((p) => p[name])
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      this._hooks.set(name, filtered)
    }
    return this._hooks.get(name)!
  }

  public use(...plugin: (Plugin | PluginFactory | PluginLike)[]): this {
    const newPlugins = flattenPlugins(plugin)
    this.plugins.push(...newPlugins)
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this._matcherCache = null
    this._hooks.clear()
    this.clearCache()
    this._initializePlugins()
    this._initializeMatcher()
    return this
  }

  private processPlugin(hook: Exclude<keyof Plugin, 'name' | 'priority'>, ...context: any[]): any {
    for (const plugin of this.sanitizePlugin(hook)) {
      if (plugin[hook]) {
        try {
          const hookFn = plugin[hook] as (...args: any[]) => any
          const result = hookFn(...context)
          if (typeof result !== 'undefined') return result
        } catch (err) {
          createPluginError(hook, plugin.name, err)
        }
      }
    }
  }

  private _initializePlugins() {
    this.processPlugin('init', {
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
    })
  }

  private _initializeMatcher() {
    this.matcher = this.regexp()
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
    this._matcherCache = null
    this._hooks.clear()
    this.clearCache()
    this._initializeMatcher()
  }

  public clearCache(): void {
    this._parseCache.clear()
    this._valueCache.clear()
    this._variantCache.clear()
    this._utilityCache.clear()
    this._cnCache.clear()
  }

  public getCacheStats() {
    return {
      parse: this._parseCache.size,
      processValue: this._valueCache.size,
      processVariant: this._variantCache.size,
      processUtility: this._utilityCache.size,
      processClassName: this._cnCache.size
    }
  }

  public regexp() {
    if (this._matcherCache) return this._matcherCache

    const sanitize = (obj: Record<string, any> = {}) => Object.keys(obj).map(escapeRegex).join('|')

    let patterns: RegexPatterns = {
      variant: sanitize(this.variants) || DEFAULT_GLOBAL_PATTERN,
      utility: sanitize(this.utilities) || DEFAULT_GLOBAL_PATTERN,
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

    this._matcherCache = { patterns, regexp }
    return this._matcherCache
  }

  public parse(className: string): (undefined | string)[] | any | null {
    if (!className || typeof className !== 'string') return null

    const cached = this._parseCache.get(className)
    if (cached) return cached

    let { patterns, regexp } = this.regexp()

    const pluginResult = this.processPlugin('parse', className, { patterns, regexp })
    const result = isValidResult(pluginResult) ? pluginResult : className.match(regexp)
    this._parseCache.set(className, result)
    return result
  }

  public processAny(member: 'value' | 'variant', value: string): string | null {
    if (!['value', 'variant'].includes(member) || !value) return null

    const cacheStorage = member === 'value' ? this._valueCache : this._variantCache

    const cached = cacheStorage.get(value)
    if (cached) return cached

    const pluginResult = this.processPlugin(member, value)
    const variantOrValue = member === 'variant' ? this.variants[value] || null : value

    const result = isValidResult(pluginResult) ? pluginResult : variantOrValue
    cacheStorage.set(value, result)
    return result
  }

  public processValue = (value: string): string | null => this.processAny('value', value)

  public processVariant = (variant: string): string | null => this.processAny('variant', variant)

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
    const cacheKey = `${variant || ''}:${utility}:${value}:${className}`

    const cached = this._utilityCache.get(cacheKey)
    if (cached) return cached

    const mainContext = {
      className,
      utility: this.utilities[utility],
      value: this.processValue(value),
      variant: variant ? this.processVariant(variant) : null,
      match: this.parse(className)
    }

    const context = this.processPlugin('beforeUtility', mainContext) || mainContext

    const pluginResult = this.processPlugin('utility', context)

    const beforeResult = isValidResult(pluginResult) ? pluginResult : context

    const afterUtilityResult = this.processPlugin('afterUtility', beforeResult)

    const result = (
      isValidResult(afterUtilityResult) ? afterUtilityResult : beforeResult
    ) satisfies BaseProcessResult & DefaultProcessUtilityResult

    this._utilityCache.set(cacheKey, result)
    return result
  }

  public processClassName<T>(className: string): T | null {
    if (!className || typeof className !== 'string') return null

    const cached = this._cnCache.get(className)
    if (cached) return cached

    const pluginResult = this.processPlugin('process', className)

    if (isValidResult(pluginResult)) {
      this._cnCache.set(className, pluginResult)
      return pluginResult as T
    }

    const parsed = this.parse(className)
    if (!parsed) {
      this._cnCache.set(className, null)
      return null
    }

    const [, variant, utility, value] = parsed
    const processed = this.processUtility({ variant, utility, value, className })

    this._cnCache.set(className, processed)
    return processed ? (processed as T) : null
  }

  public process<T = unknown>(classNames: string | string[]): T[] | T | null {
    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
    if (classList.length === 0) return []

    const results: T[] = []
    for (let i = 0; i < classList.length; i++) {
      const result = this.processClassName<T>(classList[i])
      if (result) results.push(result)
    }

    return (this.processPlugin('done', results) || results) as T
  }
}

export * from './types'
export default TenoxUI
