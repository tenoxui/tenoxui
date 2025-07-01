import { toKebab } from '../../utils/toKebab'
import { processValue } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import { is } from 'cssrxp'

const additionalTransformCSS =
  'transform: var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y);'
const additionalTranslateCSS = 'translate: var(--tw-translate-x) var(--tw-translate-x)'
const additionalScaleClass = 'scale: var(--tw-scale-x) var(--tw-scale-y)'
export const transform = (sizing: number = 0.25): Property => ({
  perspective: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null
    const values: Record<string, string> = {
      dramatic: '100px',
      near: '300px',
      normal: '500px',
      midrange: '800px',
      distant: '1200px'
    }

    return `value:perspective: ${values[value] || value}`
  },
  'perspective-origin': 'perspectiveOrigin',
  scale: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:scale: ${value + (unit || '%')}`
  },
  'scale-x': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-scale-x: ${value + (unit || '%')}; ${additionalScaleClass}`
  },
  'scale-y': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-scale-x: ${value + (unit || '%')}; ${additionalScaleClass}`
  },
  'scale-z': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:${additionalScaleClass} ${value + (unit || '%')}`
  },
  rotate: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:rotate: ${is.number.test(value) ? value + 'deg' : value}`
  },
  'rotate-x': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-rotate-x: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  'rotate-y': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-rotate-y: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  'rotate-z': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-rotate-z: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  skew: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-skew-x: ${is.number.test(value) ? value + 'deg' : value}; --tw-skew-y: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  'skew-x': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-skew-x: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  'skew-y': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    return `value:--tw-skew-y: ${
      is.number.test(value) ? value + 'deg' : value
    }; ${additionalTransformCSS}`
  },
  transform: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    if (['3d', 'flat'].includes(value + unit)) {
      return `value:${toKebab('transformStyle')}: ${(value + unit).replace('3d', 'preserve-3d')}`
    }

    let finalValue = value + unit
    if (value === 'cpu')
      finalValue =
        'var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y)'
    else if (value === 'gpu')
      finalValue =
        'translateZ(0) var(--tw-rotate-x) var(--tw-rotate-y) var(--tw-rotate-z) var(--tw-skew-x) var(--tw-skew-y)'

    return `value:transform: ${finalValue}`
  },
  origin: 'transformOrigin',

  translate: ({ key = '', value = '', unit = '', secondValue = '', raw }) => {
    if (
      !value ||
      key ||
      (secondValue && !is.number.test(value + unit) && !is.number.test(secondValue))
    ) {
      return null
    }

    let finalValue = processValue(value, unit, sizing)

    if (is.ratio.test(value + unit) || is.ratio.test(`${value + unit}/${secondValue}`))
      finalValue = ((Number(value) / Number(secondValue)) * 100).toFixed(2) + '%'

    return `value:translate: ${
      (raw as string[])[2].startsWith('[') ? finalValue : finalValue + ' ' + finalValue
    }`
  },
  'translate-x': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (
      !value ||
      key ||
      (secondValue && !is.number.test(value + unit) && !is.number.test(secondValue))
    ) {
      return null
    }

    let finalValue = processValue(value, unit, sizing)

    if (is.ratio.test(value + unit) || is.ratio.test(`${value + unit}/${secondValue}`))
      finalValue = ((Number(value) / Number(secondValue)) * 100).toFixed(2) + '%'

    return `value:--tw-translate-x: ${finalValue}; ${additionalTranslateCSS}`
  },
  'translate-y': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (
      !value ||
      key ||
      (secondValue && !is.number.test(value + unit) && !is.number.test(secondValue))
    ) {
      return null
    }

    let finalValue = processValue(value, unit, sizing)

    if (is.ratio.test(value + unit) || is.ratio.test(`${value + unit}/${secondValue}`))
      finalValue = ((Number(value) / Number(secondValue)) * 100).toFixed(2) + '%'

    return `value:--tw-translate-y: ${finalValue}; ${additionalTranslateCSS}`
  },
  'translate-z': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (
      !value ||
      key ||
      (secondValue && !is.number.test(value + unit) && !is.number.test(secondValue))
    ) {
      return null
    }

    let finalValue = processValue(value, unit, sizing)

    if (is.ratio.test(value + unit) || is.ratio.test(`${value + unit}/${secondValue}`))
      finalValue = ((Number(value) / Number(secondValue)) * 100).toFixed(2) + '%'

    return `value:${additionalTranslateCSS} ${finalValue}`
  }
})
