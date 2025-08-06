import type { ProcessResult, TransformResult } from '../types'
import { generateSelector, generateRuleBlock, processVariantSelector } from '../utils'

export function transform(data: ProcessResult[]): TransformResult {
  const results: TransformResult = {
    rules: [],
    invalid: {
      moxie: [],
      rest: []
    }
  }

  const processItem = (item: ProcessResult): void => {
    try {
      // if ...
      // rules isn't defined,
      // className has prefix but the variant is null,
      // return null
      if ((!item.variant && item.raw?.[1]) || !item.rules) {
        results.invalid.moxie.push(item)
        return
      }

      const variant = item.variant || ''
      const className = typeof item.className === 'string' ? item.className : item.raw?.[0] || ''
      const isImportant = item.isImportant || false

      const rulesBlock = generateRuleBlock(item.rules, isImportant)

      const selector = generateSelector(item.className, className, true)

      if (variant) {
        results.rules.push(processVariantSelector(variant, selector, rulesBlock))
      } else {
        results.rules.push(selector + ' ' + rulesBlock)
      }
    } catch (err) {
      console.error(`Error transforming ${item.className}:`, err)
      results.invalid.moxie.push(item)
    }
  }

  data.forEach((item) => {
    // only process moxie-like rules
    if (item.use === 'moxie') {
      processItem(item)
    } else {
      results.invalid.rest.push(item)
    }
  })

  return results
}
