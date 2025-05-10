/**
 * Not available (yet)
 * divide-* utility
 */

import { toKebab } from '../../utils/toKebab'
import { createSizingType, createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'
import { is } from 'cssrxp'

const roundedValues: Record<string, string> = {
  full: 'calc(infinity * 1px)',
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem'
}

export const border: {
  property: (sizing: number) => Property
  classes?: Classes
} = {
  property: (sizing: number = 0.25): Property => ({
    border: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length', 'color'].includes(key)) || secondUnit) return null
      const base = 'border'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'].includes(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Style`)}: ${value}`
      }
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (key === 'color' || is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-x': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderInline'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-y': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderBlock'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-s': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderInlineStart'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-e': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderInlineEnd'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-t': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderTop'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-l': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderLeft'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-b': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderBottom'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'border-r': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'borderRight'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    rounded: createSizingType('borderRadius', sizing, false, false, false, roundedValues),
    'rounded-ss': createSizingType(
      'borderStartStartRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-se': createSizingType(
      'borderStartEndRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-ee': createSizingType(
      'borderEndEndRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-es': createSizingType(
      'borderEndStartRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-s': createSizingType(
      ['borderStartStartRadius', 'borderEndStartRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-e': createSizingType(
      ['borderStartEndRadius', 'borderEndEndRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-t': createSizingType(
      ['borderTopLeftRadius', 'borderTopRightRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-l': createSizingType(
      ['borderTopLeftRadius', 'borderBottomLeftRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-b': createSizingType(
      ['borderBottomLeftRadius', 'borderBottomRightRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-r': createSizingType(
      ['borderTopRightRadius', 'borderBottomRightRadius'],
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-tl': createSizingType(
      'borderTopLeftRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-tr': createSizingType(
      'borderTopRightRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-bl': createSizingType(
      'borderBottomLeftRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    'rounded-br': createSizingType(
      'borderBottomRightRadius',
      sizing,
      false,
      false,
      false,
      roundedValues
    ),
    outline: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length'].includes(key)) || secondUnit) return null
      const base = 'outline'
      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`
      if (['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'].includes(value)) {
        return secondValue
          ? null
          : value === 'hidden'
            ? `value:outline: 2px solid transparent; ${toKebab('outlineOffset')}: 2px;`
            : `value:${toKebab(`${base}Style`)}: ${value}`
      }
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (is.color.test(value)) {
        return createColorType(`${base}Color`, value, secondValue)
      }
      return `value:${base}: ${value}`
    },
    'outline-offset': ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if (!value || key || secondValue) return null

      if (is.number.test(value)) {
        return `value:${toKebab(`outlineOffset`)}: ${value}${unit || 'px'}`
      }

      return `value:${toKebab(`outlineOffset`)}: ${value}${unit}`
    }
  })
}
