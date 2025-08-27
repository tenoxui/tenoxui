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
    onMatcherCreated = null
  } = config
  return {
    name: 'tenoxui-moxie',
    priority,
    process(className: string, context?: ProcessContext) {
      const { variants = {}, utilities = {} } = context as ProcessContext
      const pattern = createRegexp({
        utilities: Object.keys(utilities?.[utilitiesName] as any),
        inputPrefixChars: prefixChars,
        safelist: typeSafelist,
        valuePatterns
      })
      const matcher = new RegExp('^!?' + pattern.matcher.source.slice(1, -1) + '!?$')
      if (onMatcherCreated) {
        onMatcherCreated(matcher)
      }
      if (className.match(matcher)) {
        const processor = new Processor({
          parser: pattern,
          variants,
          plugins,
          utilities: utilities?.[utilitiesName] as any
        })
        return processor.process(className)
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
