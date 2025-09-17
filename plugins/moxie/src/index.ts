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
import { escapeRegex } from './utils/escape'

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
  let cachedMatcher: RegExp | null = null
  let processedValuePatterns = [...valuePatterns]
  let processedVariantPatterns = [...variantPatterns]

  let cachedUtilitiesHash: string | null = null
  let cachedVariantsHash: string | null = null

  return {
    name: 'tenoxui-moxie',
    priority,
    process(className: string, context?: ProcessContext) {
      const { variants = {}, utilities = {} } = context as ProcessContext

      const currentUtilitiesHash = JSON.stringify(utilities?.[utilitiesName])
      const currentVariantsHash = JSON.stringify(variants)

      const shouldCreateNew =
        !cachedProcessor ||
        cachedUtilitiesHash !== currentUtilitiesHash ||
        cachedVariantsHash !== currentVariantsHash

      if (shouldCreateNew) {
        processedValuePatterns = [...valuePatterns]
        processedVariantPatterns = [...variantPatterns]

        const mutableUtilities = { ...(utilities?.[utilitiesName] as Object as Utilities) }
        const mutableVariants = { ...variants }

        const addValuePatterns = (values: (string | RegExp)[] = []) => {
          processedValuePatterns.push(...values)
        }

        const addVariantPatterns = (patterns: (string | RegExp)[] = []) => {
          processedVariantPatterns.push(...patterns)
        }

        const addTypeSafelist = (types: string[] = []) => {
          typeSafelist.push(...types)
        }

        const addUtilities = (newUtilities: Utilities = {}) => {
          Object.assign(mutableUtilities, newUtilities)
        }

        const addVariants = (newVariants: Variants = {}) => {
          Object.assign(mutableVariants, newVariants)
        }

        mainPluginSystem.exec('onInit', {
          addValuePatterns,
          addVariantPatterns,
          addTypeSafelist,
          addUtilities,
          addVariants,
          valuePatterns: processedValuePatterns,
          variantPatterns: processedVariantPatterns,
          typeSafelist,
          utilities: mutableUtilities,
          variants: mutableVariants,
          prefixChars,
          matcherOptions
        })

        const sanitizePattern = (patterns: (string | RegExp)[]): string[] =>
          patterns.map((pattern) => (pattern instanceof RegExp ? pattern.source : pattern))

        const pattern = createRegexp(
          {
            utilities: [...Object.keys(mutableUtilities), ...sanitizePattern(typeSafelist)],
            variants: [
              ...Object.keys(mutableVariants).map(escapeRegex),
              ...sanitizePattern(processedVariantPatterns)
            ],
            inputPrefixChars: prefixChars,
            valuePatterns: processedValuePatterns
          },
          matcherOptions
        )

        cachedMatcher = new RegExp('^!?' + pattern.matcher.source.slice(1, -1) + '!?$')

        if (onMatcherCreated) {
          onMatcherCreated({
            patterns: pattern.patterns,
            matcher: cachedMatcher
          })
        }

        cachedProcessor = new Processor({
          parser: pattern,
          variants: mutableVariants,
          utilities: mutableUtilities as any
        })

        cachedUtilitiesHash = currentUtilitiesHash
        cachedVariantsHash = currentVariantsHash
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
