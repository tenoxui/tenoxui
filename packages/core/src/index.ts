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

  private _parseCache: LRUCache<string, any>
  private _processValueCache: LRUCache<string, string | null>
  private _processVariantCache: LRUCache<string, string | null>
  private _processUtilityCache: LRUCache<string, any>
  private _processClassNameCache: LRUCache<string, any>

  private _pluginsByHook: Map<string, Plugin[]>

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
    this._processValueCache = new LRUCache(cacheSize)
    this._processVariantCache = new LRUCache(cacheSize)
    this._processUtilityCache = new LRUCache(cacheSize * 2)
    this._processClassNameCache = new LRUCache(cacheSize * 2)
    this._pluginsByHook = new Map()

    this._initializePlugins()
    this._initializeMatcher()
  }

  private sanitizePlugin(name: Exclude<keyof Plugin, 'name' | 'priority'>): Plugin[] {
    if (!this._pluginsByHook.has(name)) {
      const filtered = this.plugins
        .filter((p) => p[name])
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      this._pluginsByHook.set(name, filtered)
    }
    return this._pluginsByHook.get(name)!
  }

  public use(...plugin: (Plugin | PluginFactory | PluginLike)[]): this {
    const newPlugins = flattenPlugins(plugin)
    this.plugins.push(...newPlugins)
    this.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this._cachedRegexp = null
    this._pluginsByHook.clear()
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
          if (result) return result
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
    this._cachedRegexp = null
    this._pluginsByHook.clear()
    this.clearCache()
    this._initializeMatcher()
  }

  public clearCache(): void {
    this._parseCache.clear()
    this._processValueCache.clear()
    this._processVariantCache.clear()
    this._processUtilityCache.clear()
    this._processClassNameCache.clear()
  }

  public getCacheStats() {
    return {
      parse: this._parseCache.size,
      processValue: this._processValueCache.size,
      processVariant: this._processVariantCache.size,
      processUtility: this._processUtilityCache.size,
      processClassName: this._processClassNameCache.size
    }
  }

  public regexp() {
    if (this._cachedRegexp) return this._cachedRegexp

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

    this._cachedRegexp = { patterns, regexp }
    return this._cachedRegexp
  }

  public parse(className: string): (undefined | string)[] | any | null {
    if (!className || typeof className !== 'string') return null

    const cached = this._parseCache.get(className)
    if (cached) return cached

    let { patterns, regexp } = this.regexp()

    const result =
      this.processPlugin('parse', className, { patterns, regexp }) || className.match(regexp)
    this._parseCache.set(className, result)
    return result
  }

  public processAny(member: 'value' | 'variant', value: string): string | null {
    if (!['value', 'variant'].includes(member) || !value) return null

    const cacheStorage = member === 'value' ? this._processValueCache : this._processVariantCache

    const cached = cacheStorage.get(value)
    if (cached) return cached

    const sanitized =
      this.processPlugin(member, value) ||
      (member === 'variant' ? this.variants[value] || null : value)

    cacheStorage.set(value, sanitized)
    return sanitized
  }

  public processValue(value: string): string | null {
    return this.processAny('value', value)
  }

  public processVariant(variant: string): string | null {
    return this.processAny('variant', variant)
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
    const cacheKey = `${variant || ''}:${utility}:${value}:${className}`

    const cached = this._processUtilityCache.get(cacheKey)
    if (cached) return cached

    const context = {
      className,
      utility: this.utilities[utility],
      value: this.processValue(value),
      variant: variant ? this.processVariant(variant) : null,
      match: this.parse(className)
    }

    const result =
      this.processPlugin('utility', context) ||
      (context satisfies BaseProcessResult & DefaultProcessUtilityResult)

    this._processUtilityCache.set(cacheKey, result)
    return result
  }

  public processClassName<T>(className: string): T | null {
    if (!className || typeof className !== 'string') return null

    const cached = this._processClassNameCache.get(className)
    if (cached) return cached

    const pluginResult = this.processPlugin('process', className)

    if (pluginResult) {
      this._processClassNameCache.set(className, pluginResult)
      return pluginResult as T
    }

    const parsed = this.parse(className)
    if (!parsed) {
      this._processClassNameCache.set(className, null)
      return null
    }

    const [, variant, utility, value] = parsed
    const processed = this.processUtility({ variant, utility, value, className })

    this._processClassNameCache.set(className, processed)
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
