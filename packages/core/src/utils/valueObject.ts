import { GetCSSProperty } from '../lib/types'

export const isObjectWithValue = (
  typeAttribute: any
): typeAttribute is { property: GetCSSProperty; value: string } => {
  return (
    typeof typeAttribute === 'object' &&
    typeAttribute !== null &&
    'value' in typeAttribute &&
    'property' in typeAttribute
  )
}
