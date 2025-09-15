import type { ProcessResult, TransformResult, ClassNameObject } from '../types'
import {
  generateSelector,
  generateRuleBlock,
  processVariantSelector
} from '../utils/transformerUtils'

export function transform(data: ProcessResult[]): TransformResult {
  const results: TransformResult = {
    rules: [],
    invalid: { moxie: [], rest: [] }
  }

  const addInvalid = (item: ProcessResult) => results.invalid.moxie.push(item)

  const processItem = (item: ProcessResult): void => {
    try {
      // Early validation
      if (!item.rules || (!item.variant && item.raw?.[1])) {
        addInvalid(item)
        return
      }

      const variant = item.variant || ''
      const className = typeof item.className === 'string' ? item.className : item.raw?.[0] || ''

      const rulesBlock = generateRuleBlock(item.rules, item.isImportant || false)
      if (!rulesBlock) return

      if (variant) {
        const isObjectClassName = item.className && typeof item.className === 'object'
        const result = isObjectClassName
          ? processVariantSelector(
              variant,
              ((item.className as ClassNameObject)?.raw as string) || className,
              rulesBlock,
              item.className as ClassNameObject
            )
          : processVariantSelector(
              variant,
              generateSelector(item.className, className, true),
              rulesBlock
            )

        result ? results.rules.push(result) : addInvalid(item)
      } else {
        const selector = generateSelector(item.className, className, true)
        results.rules.push(`${selector} ${rulesBlock}`)
      }
    } catch (err) {
      console.error(`Error transforming ${item.className}:`, err)
      addInvalid(item)
    }
  }

  // Process items
  data.forEach((item) => {
    item.use === 'moxie' ? processItem(item) : results.invalid.rest.push(item)
  })

  return results
}
