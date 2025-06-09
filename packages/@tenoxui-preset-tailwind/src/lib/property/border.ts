import { toKebab } from '../../utils/toKebab'
import { createSizingType, createColorType } from '../../utils/createValue'
import type { Property, PropertyParamValue } from '@tenoxui/moxie'
import type { Classes, CSSPropertyOrVariable } from '@tenoxui/types'
import { is } from 'cssrxp'
import { escapeCSSSelector } from '@tenoxui/moxie'

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

function createBorder(base: string = 'border'): PropertyParamValue {
  return ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
    if ((key && !['length', 'color'].includes(key)) || secondUnit) return null

    if (is.length.test(value))
      return `value:${toKebab(`${base}Width` as CSSPropertyOrVariable)}: ${value}`
    if (key === 'length' || is.number.test(value)) {
      return secondValue
        ? null
        : `value:${toKebab(`${base}Width` as CSSPropertyOrVariable)}: ${value}${unit || 'px'}`
    }
    if (key === 'color' || is.color.test(value) || value === 'current') {
      return createColorType(`${base}Color` as CSSPropertyOrVariable, value, secondValue)
    }
    return `value:${toKebab(base as CSSPropertyOrVariable)}: ${value}`
  }
}

export const border: {
  property: (sizing: number) => Property
  classes?: Classes
} = {
  property: (sizing: number = 0.25): Property => ({
    'border-x': createBorder('borderInline'),
    'border-y': createBorder('borderBlock'),
    'border-s': createBorder('borderInlineStart'),
    'border-e': createBorder('borderInlineEnd'),
    'border-t': createBorder('borderTop'),
    'border-r': createBorder('borderRight'),
    'border-b': createBorder('borderBottom'),
    'border-l': createBorder('borderLeft'),
    border: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      if ((key && !['length', 'color'].includes(key)) || secondUnit) return null

      const base = 'border'

      if (!value) return `value:${toKebab(`${base}Width`)}: 1px`

      if (['x', 'y', 's', 'e', 't', 'r', 'b', 'l'].includes(value) && !secondValue) {
        const keys: Record<string, string> = {
          x: 'borderInline',
          y: 'borderBlock',
          s: 'borderInlineStart',
          e: 'borderInlineEnd',
          t: 'borderTop',
          r: 'borderRight',
          b: 'borderBottom',
          l: 'borderLeft'
        }

        return `value:${toKebab(`${keys[value]}Width` as CSSPropertyOrVariable)}: 1px`
      }
      if (['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'].includes(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Style`)}: ${value}`
      }
      if (key === 'length' || is.number.test(value)) {
        return secondValue ? null : `value:${toKebab(`${base}Width`)}: ${value}${unit || 'px'}`
      }
      if (key === 'color' || is.color.test(value) || value === 'current') {
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
      if (is.color.test(value) || value === 'current') {
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
    },
    'divide-x': ({ value, unit, key, secondValue, raw }) => {
      if (key || (secondValue && secondValue !== 'reverse')) return null
      const className = `${escapeCSSSelector((raw as string[])[6])} > :not(:last-child)`
      const finalValue = !value ? '1px' : is.length.test(value) ? value : value + (unit || 'px')

      return {
        className,
        cssRules: `${toKebab('borderInlineStartWidth')}: ${secondValue ? finalValue : '0px'};
${toKebab('borderInlineEndWidth')}: ${!secondValue ? finalValue : '0px'};`,
        value: null
      }
    },
    'divide-y': ({ value, unit, key, secondValue, raw }) => {
      if (key || (secondValue && secondValue !== 'reverse')) return null
      const className = `${escapeCSSSelector((raw as string[])[6])} > :not(:last-child)`
      const finalValue = !value ? '1px' : is.length.test(value) ? value : value + (unit || 'px')

      return {
        className,
        cssRules: `${toKebab('borderTopWidth')}: ${secondValue ? finalValue : '0px'};
${toKebab('borderBottomWidth')}: ${!secondValue ? finalValue : '0px'};`,
        value: null
      }
    },
    /**
     * Using divide-* utility to set border-style and border-color properties for dividers
     */
    divide: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '', raw }) => {
      if (!value || key || secondUnit) return null

      return {
        className: `${escapeCSSSelector((raw as string[])[6])} > :not(:last-child)`,
        cssRules: ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'].includes(value)
          ? secondValue
            ? null
            : `${toKebab('borderStyle')}: ${value}`
          : is.color.test(value) || value === 'current'
            ? createColorType('borderColor', value, secondValue).slice(6)
            : null,
        value: null
      }
    }
  })
}
