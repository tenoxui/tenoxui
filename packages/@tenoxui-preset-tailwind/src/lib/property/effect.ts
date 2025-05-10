/**
 * Not available (yet)
 * mask-image utility
 */

import { toKebab } from '../../utils/toKebab'
import { createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'
import { is } from 'cssrxp'

export const effect: {
  property: (sizing: number) => Property
  classes?: Classes
} = {
  property: (sizing: number = 0.25): Property => ({
    shadow: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-shadow-color', value, secondValue)
      }

      const values: Record<string, string> = {
        '2xs': '0 1px var(--tw-shadow-color, rgb(0 0 0 / 0.05))',
        xs: '0 1px 2px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05))',
        sm: '0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1))',
        md: '0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1))',
        lg: '0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1))',
        xl: '0 20px 25px -5px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--tw-shadow-color, rgb(0 0 0 / 0.1))',
        '2xl': '0 25px 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25))',
        none: '0 0 #0000'
      }

      return secondValue || is.length.test(value + unit)
        ? null
        : `value:--tw-shadow: ${
            values[value + unit] || value + unit
          };box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);`
    },
    'inset-shadow': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-inset-shadow-color', value, secondValue)
      }

      const values: Record<string, string> = {
        '2xs': 'inset 0 1px var(--tw-inset-ring-shadow, rgb(0 0 0 / 0.05))',
        xs: 'inset 0 1px 1px var(--tw-inset-ring-shadow, rgb(0 0 0 / 0.05))',
        sm: 'inset 0 2px 4px var(--tw-inset-ring-shadow, rgb(0 0 0 / 0.05))',
        none: '0 0 #0000'
      }

      return secondValue || is.length.test(value + unit)
        ? null
        : `value:--tw-inset-shadow: ${
            values[value + unit] || value + unit
          };box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);`
    },
    ring: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (key || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-ring-color', value, secondValue)
      }

      return secondValue
        ? null
        : `value:--tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(${
            !value ? '1px' : value + (unit || 'px')
          } + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor); box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);`
    },
    'inset-ring': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (key || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-inset-ring-color', value, secondValue)
      }

      return secondValue
        ? null
        : `value:--tw-inset-ring-shadow: 0 0 0 ${
            !value ? '1px' : value + (unit || 'px')
          } var(--tw-inset-ring-color, currentcolor); box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);`
    },
    'ring-offset': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-ring-offset-color', value, secondValue)
      }

      return secondValue
        ? null
        : `value:--tw-ring-offset-width: ${
            value + (unit || 'px')
          }; --tw-ring-offset-shadow: var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);`
    },

    'text-shadow': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || (key && key !== 'color') || secondUnit) return null

      if (value === 'current' || is.color.test(value)) {
        return createColorType('--tw-text-shadow-color', value, secondValue)
      }

      const values: Record<string, string> = {
        '2xs': '0px 1px 0px var(--tw-text-shadow-color, rgb(0 0 0 / 0.15))',
        xs: '0px 1px 1px var(--tw-text-shadow-color, rgb(0 0 0 / 0.2))',
        sm: '0px 1px 0px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075)), 0px 1px 1px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075)), 0px 2px 2px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075))',
        md: '0px 1px 1px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1)), 0px 1px 2px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1)), 0px 2px 4px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1))',
        lg: '0px 1px 2px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1)), 0px 3px 2px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1)), 0px 4px 8px var(--tw-text-shadow-color, rgb(0 0 0 / 0.1))',
        none: 'none'
      }

      return secondValue ? null : `value:text-shadow: ${values[value + unit] || value};`
    },

    opacity: ({ key = '', value = '', unit = '', secondValue = '' }) =>
      !value || key || secondValue ? null : `value:opacity: ${value + unit || '%'}`,
    'mix-blend': {
      property: 'mixBlendMode',
      value: [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
        'plus-darker',
        'plus-lighter'
      ]
    },
    'bg-blend': {
      property: 'mixBlendMode',
      value: [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity'
      ]
    },
    'mask-clip': ({ key = '', value = '', secondValue = '' }) =>
      key ||
      secondValue ||
      !['border', 'padding', 'content', 'fill', 'stroke', 'view'].includes(value)
        ? null
        : `value:${toKebab('maskClip')} ${value}-box`,
    'mask-origin': ({ key = '', value = '', secondValue = '' }) =>
      key ||
      secondValue ||
      !['border', 'padding', 'content', 'fill', 'stroke', 'view'].includes(value)
        ? null
        : `value:${toKebab('maskOrigin')} ${value}-box`,
    mask: ({ key = '', value = '', secondValue = '', raw }) => {
      if (key || secondValue) return null

      if (['add', 'substract', 'intersect', 'exclude'].includes(value))
        return `value:${toKebab('maskComposite')}: ${value}`

      if (
        [
          'top',
          'left',
          'bottom',
          'right',
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right'
        ].includes((raw as string[])[2])
      )
        return `value:${toKebab('maskPosition')}: ${value}`

      if (
        ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'repeat-space', 'repeat-round'].includes(
          value
        )
      )
        return `value:${toKebab('maskRepeat')}: ${
          value === 'repeat-space' || value === 'repeat-round'
            ? value.replace('repeat-', '')
            : value
        }`

      if (['cover', 'auto', 'contain'].includes(value))
        return `value:${toKebab('maskSize')}: ${value}`

      /* mask-image logic later 🗿 */

      return null
    },
    'mask-position': 'maskPosition',
    'mask-size': 'maskSize',
    'mask-type': {
      property: 'maskType',
      value: ['alpha', 'luminance']
    }
  }),
  classes: {
    maskClip: {
      'mask-no-clip': 'no-clip'
    }
  }
}
