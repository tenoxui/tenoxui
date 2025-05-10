import { toKebab } from '../../utils/toKebab'
import { createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import { is } from 'cssrxp'

export const svg: Property = {
  fill: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit || !is.color.test(value)
      ? null
      : createColorType('fill', value, secondUnit),
  stroke: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit
      ? null
      : is.color.test(value)
        ? createColorType('stroke', value, secondUnit)
        : `value:${toKebab('strokeWidth')}: ${value + unit}`
}
