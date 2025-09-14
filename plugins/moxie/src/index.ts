import type { Plugin, ProcessContext } from '@tenoxui/core'
import type { Config, ProcessResult, InvalidResult } from './types'
import { createRegexp } from './lib/regexp'
import { Processor } from './lib/processor'

export function Moxie(config: Config = {}): Plugin<ProcessResult | InvalidResult> {
  const {
    priority = 0,
    prefixChars = [],
    utilitiesName = 'moxie',
    typeSafelist = [],
    plugins = [],
    valuePatterns = [],
    variantPatterns = [],
    onMatcherCreated = null,
    matcherOptions = {}
  } = config

  let cachedProcessor: Processor | null = null
  let cachedContext: ProcessContext | undefined | null = null
  let cachedMatcher: RegExp | null = null

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
        const sanitizePattetn = (patterns: (string | RegExp)[]): string[] =>
          patterns.map((pattern) => (pattern instanceof RegExp ? pattern.source : pattern))
        const pattern = createRegexp(
          {
            utilities: [
              ...Object.keys(utilities?.[utilitiesName] as any),
              ...sanitizePattetn(typeSafelist)
            ],
            variants: [...Object.keys(variants as any), ...sanitizePattetn(variantPatterns)],
            inputPrefixChars: prefixChars,
            valuePatterns
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
          plugins,
          utilities: utilities?.[utilitiesName] as any
        })

        cachedContext = context
      }

      if (className.match(cachedMatcher!)) {
        return cachedProcessor!.process(className)
      }
    }
  }
}

export * from './types'
export * from './utils'
export * from './lib/regexp'
export { transform } from './lib/transformer'
export { Processor } from './lib/processor'
export default Moxie
