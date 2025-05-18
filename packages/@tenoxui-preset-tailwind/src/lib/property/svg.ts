import { toKebab } from '../../utils/toKebab'
import { createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import { is } from 'cssrxp'

export const svg: Property = {
  fill: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit || (!is.color.test(value) && value !== 'current')
      ? null
      : createColorType('fill', value, secondValue),
  stroke: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit
      ? null
      : is.color.test(value) || value === 'current'
        ? createColorType('stroke', value, secondValue)
        : `value:${toKebab('strokeWidth')}: ${value + unit}`
}
