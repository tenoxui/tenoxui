import { createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import { is } from 'cssrxp'

const filterDefaultStr =
  'filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);'
const backdropFilterDefaultStr =
  '-webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,); backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);'

export const filter = (sizing: number = 0.25): Property => ({
  filter: 'filter',
  'backdrop-filter': 'backdropFilter',
  blur: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    const values: Record<string, string> = {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px'
    }

    return !values[value + unit] && !is.number.test(value) && value !== 'none'
      ? null
      : `value:--tw-blur: ${
          value === 'none' ? ' ' : `blur(${values[value + unit] || value + (unit || 'px')})`
        }; ${filterDefaultStr}`
  },
  brightness: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-brightness: brightness(${
          is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,
  contrast: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-contrast: contrast(${
          is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,
  saturate: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-saturate: saturate(${
          is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,
  'hue-rotate': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== 'deg')
      ? null
      : `value:--tw-hue-rotate: hue-rotate(${
          is.number.test(value) ? value + 'deg' : value
        }); ${filterDefaultStr}`,
  grayscale: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-grayscale: grayscale(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,
  invert: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-invert: invert(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,
  sepia: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-sepia: sepia(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${filterDefaultStr}`,

  'drop-shadow': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
    if (!value || key || secondUnit) return null

    if (value === 'current' || is.color.test(value)) {
      return createColorType('--tw-drop-shadow-color', value, secondValue)
    }

    const values: Record<string, string> = {
      xs: '0 1px 1px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.05))',
      sm: '0 1px 2px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.15))',
      md: '0 3px 3px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.12))',
      lg: '0 4px 4px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.15))',
      xl: '0 9px 7px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.1))',
      '2xl': '0 25px 25px var(--tw-drop-shadow-color, rgb(0 0 0 / 0.15))',
      none: '0 0 #0000'
    }

    return secondValue || is.length.test(value + unit)
      ? null
      : `value:--tw-drop-shadow: drop-shadow(${
          values[value + unit] || value + unit
        }); ${filterDefaultStr}`
  },

  'backdrop-blur': ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    const values: Record<string, string> = {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px'
    }

    return !values[value + unit] && !is.number.test(value) && value !== 'none'
      ? null
      : `value:--tw-backdrop-blur: ${
          value === 'none' ? ' ' : `blur(${values[value + unit] || value + (unit || 'px')})`
        }; ${backdropFilterDefaultStr}`
  },
  'backdrop-brightness': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-brightness: brightness(${
          is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-contrast': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-contrast: contrast(${
          is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-saturate': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-saturate: saturate(${
          is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-opacity': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-opacity: opacity(${
          is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-hue-rotate': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || key || secondValue || (unit && unit !== 'deg')
      ? null
      : `value:--tw-backdrop-hue-rotate: hue-rotate(${
          is.number.test(value) ? value + 'deg' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-grayscale': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-grayscale: grayscale(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-invert': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-invert: invert(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`,
  'backdrop-sepia': ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (unit && unit !== '%')
      ? null
      : `value:--tw-backdrop-sepia: sepia(${
          !value ? '100%' : is.number.test(value) ? value + '%' : value
        }); ${backdropFilterDefaultStr}`
})
