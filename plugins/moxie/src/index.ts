import { TenoxUI } from '@tenoxui/core'
import { SyncPluginSystem as PluginSystem } from '@nousantx/plugify'
import type { Plugin, ProcessContext } from '@tenoxui/core'
import type {
  Config,
  Variants,
  Utilities,
  CreatorConfig,
  InvalidResult,
  ProcessResult,
  PluginTypes
} from './types'
import { transform } from './lib/transformer'
import { createRegexp } from './lib/regexp'
import { Processor } from './lib/processor'

export function Moxie(config: Config = {}): Plugin<ProcessResult | InvalidResult> {
  const {
    plugins = [],
    priority = 0,
    prefixChars = [],
    typeSafelist = [],
    utilitiesName = 'moxie',
    valuePatterns = [],
    matcherOptions = {},
    variantPatterns = [],
    onMatcherCreated = null
  } = config

  const mainPluginSystem = new PluginSystem<PluginTypes>(plugins)

  let cachedProcessor: Processor | null = null
  let cachedContext: ProcessContext | undefined | null = null
  let cachedMatcher: RegExp | null = null
  let processedValuePatterns = [...valuePatterns]
  let processedVariantPatterns = [...variantPatterns]

  return {
    name: 'tenoxui-moxie',
    priority,
    process(className: string, context?: ProcessContext) {
      const { variants = {}, utilities = {} } = context as ProcessContext

      const shouldCreateNew =
        !cachedProcessor ||
        !cachedContext ||
        cachedContext !== context ||
        JSON.stringify(cachedContext.utilities?.[utilitiesName]) !==
          JSON.stringify(utilities?.[utilitiesName]) ||
        JSON.stringify(cachedContext.variants) !== JSON.stringify(variants)

      if (shouldCreateNew) {
        processedValuePatterns = [...valuePatterns]
        processedVariantPatterns = [...variantPatterns]
        const addValuePatterns = (values: (string | RegExp)[] = []) => {
          processedValuePatterns.push(...values)
        }

        const addVariantPatterns = (patterns: (string | RegExp)[] = []) => {
          processedVariantPatterns.push(...patterns)
        }

        const addTypeSafelist = (types: string[] = []) => {
          typeSafelist.push(...types)
        }

        mainPluginSystem.exec('regexp', {
          addValuePatterns,
          addVariantPatterns,
          addTypeSafelist,
          valuePatterns: processedValuePatterns,
          variantPatterns: processedVariantPatterns,
          typeSafelist,
          utilities: utilities?.[utilitiesName],
          variants,
          prefixChars,
          matcherOptions
        })

        const sanitizePattern = (patterns: (string | RegExp)[]): string[] =>
          patterns.map((pattern) => (pattern instanceof RegExp ? pattern.source : pattern))

        const pattern = createRegexp(
          {
            utilities: [
              ...Object.keys(utilities?.[utilitiesName]),
              ...sanitizePattern(typeSafelist)
            ],
            variants: [...Object.keys(variants), ...sanitizePattern(processedVariantPatterns)],
            inputPrefixChars: prefixChars,
            valuePatterns: processedValuePatterns
          },
          matcherOptions
        )

        cachedMatcher = new RegExp('^!?' + pattern.matcher.source.slice(1, -1) + '!?$')

        if (onMatcherCreated) {
          onMatcherCreated({
            matcher: pattern,
            regexp: cachedMatcher
          })
        }

        cachedProcessor = new Processor({
          parser: pattern,
          variants,
          utilities: utilities?.[utilitiesName] as any
        })

        cachedContext = context
      }

      if (className.match(cachedMatcher!)) {
        return cachedProcessor!.processWithPlugins(className, mainPluginSystem)
      }
    }
  }
}

export function createTenoxUI(config: CreatorConfig = {}) {
  const {
    plugins = [],
    priority = 0,
    variants = {},
    utilities = {},
    prefixChars = [],
    typeSafelist = [],
    valuePatterns = [],
    matcherOptions = {},
    variantPatterns = [],
    quickTransform = false,
    onMatcherCreated = null
  } = config

  const utilitiesName = '__MOXIE_UTILITIES__'

  return new TenoxUI<Utilities, Variants, ProcessResult>({
    utilities: { [utilitiesName]: utilities },
    variants,
    plugins: [
      Moxie({
        plugins,
        priority,
        prefixChars,
        typeSafelist,
        utilitiesName,
        valuePatterns,
        matcherOptions,
        variantPatterns,
        onMatcherCreated
      }),
      (quickTransform && {
        name: 'transformer',
        transform: (data: ProcessResult[]) => transform(data).rules.join('\n')
      }) as Plugin<ProcessResult | InvalidResult>
    ]
  })
}

export * from './types'
export * from './utils'
export * from './lib/regexp'
export { transform } from './lib/transformer'
export { Processor } from './lib/processor'
export { Renderer } from './lib/renderer'
export default Moxie
