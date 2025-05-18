/**
 * Not available (yet)
 * bg-radial utility
 * bg-conic utility
 */

import { toKebab } from '../../utils/toKebab'
import { createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'
import { is } from 'cssrxp'

export const background: {
  property: (sizing: number) => Property
  classes?: Classes
} = {
  property: (sizing: number = 0.25): Property => ({
    'bg-clip': ({ value = '', key = '', secondValue = '' }) => {
      return key ||
        secondValue ||
        !value ||
        !['text', 'border', 'padding', 'content'].includes(value)
        ? null
        : `value:${toKebab('backgroundClip')}: ${value !== 'text' ? `${value}-box` : value}`
    },
    'bg-origin': ({ value = '', key = '', secondValue = '' }) => {
      return key || secondValue || !value || !['border', 'padding', 'content'].includes(value)
        ? null
        : `value:${toKebab('backgroundClip')}: ${value}-box`
    },
    'bg-position': 'backgroundPosition',
    'bg-size': 'backgroundSize',
    bg: ({ key = '', value = '', unit = '', secondUnit = '', secondValue = '', raw }) => {
      if (!value || (key && !['image'].includes(key))) return null

      if (key === 'image' || value.startsWith('url('))
        return secondValue ? null : `value:${toKebab('backgroundImage')}: ${value}`

      if (value === 'radial' || value === 'conic') {
        if (
          key ||
          (secondValue &&
            ![
              'srgb',
              'hsl',
              'oklab',
              'oklch',
              'longer',
              'shorter',
              'increasing',
              'decreasing'
            ].includes(secondValue))
        )
          return null

        return `value:--tw-gradient-position: in ${
          secondValue
            ? ['srgb', 'hsl', 'oklab', 'oklch'].includes(secondValue)
              ? secondValue
              : `oklch ${secondValue} hue`
            : 'oklab'
        }; ${toKebab('backgroundImage')}: ${value}-gradient(var(--tw-gradient-stops))`
      }

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
        return secondValue ? null : `value:${toKebab('backgroundPosition')}: ${value}`

      if (
        ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'repeat-space', 'repeat-round'].includes(
          value
        )
      )
        return secondValue
          ? null
          : `value:${toKebab('backgroundRepeat')}: ${
              value === 'repeat-space' || value === 'repeat-round'
                ? value.replace('repeat-', '')
                : value
            }`

      if (['fixed', 'scroll', 'local'].includes(value))
        return secondValue ? null : `value:${toKebab('backgroundAttachment')}: ${value}`

      if (['cover', 'auto', 'contain'].includes(value))
        return secondValue ? null : `value:${toKebab('backgroundSize')}: ${value}`

      if (
        key === 'color' ||
        is.color.test(value) ||
        (['inherit', 'current', 'black', 'white', 'transparent'].includes(value) &&
          key !== 'length')
      ) {
        return secondUnit ? null : createColorType('backgroundColor', value, secondValue)
      }

      return value === 'clip' || secondValue ? null : `value:background: ${value}`
    },

    'bg-linear': ({ key = '', value = '', unit = '', secondValue = '' }) => {
      const directions: Record<string, string> = {
        'to-t': 'to top',
        'to-l': 'to left',
        'to-b': 'to bottom',
        'to-r': 'to right',
        'to-tl': 'to top left',
        'to-tr': 'to top right',
        'to-bl': 'to bottom left',
        'to-br': 'to bottom right'
      }

      if (
        !value ||
        key ||
        (secondValue &&
          ![
            'srgb',
            'hsl',
            'oklab',
            'oklch',
            'longer',
            'shorter',
            'increasing',
            'decreasing'
          ].includes(secondValue)) ||
        (!is.number.test(value) && !is.angle.test(value + unit) && !directions[value + unit])
      )
        return null

      return `value:--tw-gradient-position: ${
        directions[value + unit] || value + (unit || 'deg')
      }; @supports (background-image: linear-gradient(in lab, red, red)) { --tw-gradient-position: ${
        directions[value] || value + (unit || 'deg')
      } in ${
        secondValue
          ? ['srgb', 'hsl', 'oklab', 'oklch'].includes(secondValue)
            ? secondValue
            : `oklch ${secondValue} hue`
          : 'oklab'
      }; } ${toKebab('backgroundImage')}: linear-gradient(var(--tw-gradient-stops))`
    },
    'bg-radial': ({ key = '', value = '', unit = '', secondValue = '' }) => {
      if (key || secondValue) return null

      return `value:--tw-gradient-position: ${value + unit}; ${toKebab(
        'backgroundImage'
      )}: radial-gradient(var(--tw-gradient-stops, ${value + unit}))`
    },
    'bg-conic': ({ key = '', value = '', unit = '', secondValue = '' }) => {
      if (
        !value ||
        key ||
        (secondValue &&
          ![
            'srgb',
            'hsl',
            'oklab',
            'oklch',
            'longer',
            'shorter',
            'increasing',
            'decreasing'
          ].includes(secondValue)) ||
        (!is.number.test(value) && !is.angle.test(value + unit))
      )
        return null

      return `value:--tw-gradient-position: from ${value + (unit || 'deg')} in ${
        secondValue
          ? ['srgb', 'hsl', 'oklab', 'oklch'].includes(secondValue)
            ? secondValue
            : `oklch ${secondValue} hue`
          : 'oklab'
      }; ${toKebab('backgroundImage')}: conic-gradient(var(--tw-gradient-stops))`
    },
    from: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || (unit && unit !== '%') || secondUnit) return null

      if (is.number.test(value))
        return `value:--tw-gradient-from-position: ${value + (unit || '%')}`

      if (is.color.test(value) || value === 'current')
        return secondUnit
          ? null
          : `${createColorType(
              '--tw-gradient-from',
              value,
              secondValue
            )} --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));`

      return null
    },
    via: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || (unit && unit !== '%') || secondUnit) return null

      if (is.number.test(value)) return `value:--tw-gradient-via-position: ${value + (unit || '%')}`

      if (is.color.test(value) || value === 'current')
        return secondUnit
          ? null
          : `${createColorType(
              '--tw-gradient-via',
              value,
              secondValue
            )} --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-via-stops);`

      return null
    },
    to: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || (unit && unit !== '%') || secondUnit) return null

      if (is.number.test(value)) return `value:--tw-gradient-to-position: ${value + (unit || '%')}`

      if (is.color.test(value) || value === 'current')
        return secondUnit
          ? null
          : `${createColorType(
              '--tw-gradient-to',
              value,
              secondValue
            )} --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));`

      return null
    }
  })
}
