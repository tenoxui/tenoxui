import { toKebab } from '../../utils/toKebab'
import { createSizingType, createColorType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes, CSSProperty } from '@tenoxui/types'
import { createSameValue, transformClasses } from '@nousantx/someutils'
import { is } from 'cssrxp'

export const typography: {
  property: (sizing: number) => Property
  classes: Classes
} = {
  property: (sizing: number = 0.25): Property => {
    const lineHeightAlias: Record<string, string> = {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }

    return {
      text: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
        if (!value || (key && !['length', 'color'].includes(key))) return null
        type SizesType = Record<string, string[]>

        const sizes: SizesType = {
          xs: ['0.75rem', 'calc(1 / 0.75)'],
          sm: ['0.875rem', 'calc(1.25 / 0.875)'],
          base: ['1rem', 'calc(1.5 / 1)'],
          lg: ['1.125rem', 'calc(1.75 / 1.125)'],
          xl: ['1.25rem', 'calc(1.75 / 1.25)'],
          '2xl': ['1.5rem', 'calc(2 / 1.5)'],
          '3xl': ['1.875rem', 'calc(2.25 / 1.875)'],
          '4xl': ['2.25rem', 'calc(2.5 / 2.25)'],
          '5xl': ['3rem', '1'],
          '6xl': ['3.75rem', '1'],
          '7xl': ['4.5rem', '1'],
          '8xl': ['6rem', '1'],
          '9xl': ['8rem', '1']
        }

        if (
          key === 'color' ||
          is.color.test(value) ||
          (['inherit', 'current', 'black', 'white', 'transparent'].includes(value) &&
            key !== 'length')
        ) {
          return secondUnit ? null : createColorType('color', value, secondValue)
        }
        if (['center', 'justify', 'left', 'right', 'start', 'end'].includes(value)) {
          return secondValue ? null : `value:${toKebab('textAlign')}: ${value}`
        }
        if (['wrap', 'nowrap', 'balance', 'pretty'].includes(value)) {
          return secondValue ? null : `value:${toKebab('textWrap')}: ${value}`
        }
        if (['ellipsis', 'clip'].includes(value)) {
          return secondValue ? null : `value:${toKebab('textOverflow')}: ${value}`
        }
        if (
          key === 'length' ||
          is.length.test(value + unit) ||
          is.number.test(value + unit) ||
          value + unit in sizes
        ) {
          if (value + unit in sizes) {
            const sizeKey = (value + unit) as keyof SizesType

            const [fontSize, lineHeight] = sizes[sizeKey]
            return `value:${toKebab('fontSize')}: ${fontSize}; ${toKebab('lineHeight')}: ${
              is.number.test(secondValue + secondUnit)
                ? sizing * Number(secondValue) + 'rem'
                : lineHeightAlias[secondValue] || secondValue + secondUnit || lineHeight
            }`
          }
          return `value:${toKebab('fontSize')}: ${
            is.number.test(value + unit) ? sizing * Number(value) + 'rem' : value + unit
          }${
            secondValue
              ? `; ${toKebab('lineHeight')}: ${
                  is.number.test(secondValue + secondUnit)
                    ? sizing * Number(secondValue) + 'rem'
                    : lineHeightAlias[secondValue] || secondValue + secondUnit
                }`
              : ''
          }`
        }

        return secondValue ? null : `value:color: ${value}`
      },
      font: {
        group: 'default-font-family',
        property: ({ value = '', unit = '', secondValue = '', key = '' }) => {
          if (
            !value ||
            (key && !['weight', 'family-name', 'stretch'].includes(key)) ||
            secondValue ||
            (unit && unit !== '%')
          )
            return null
          const weightAlias: Record<string, string> = {
            thin: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900'
          }
          if (
            (!unit && (key === 'weight' || (weightAlias[value] && key !== 'stretch'))) ||
            value.endsWith('00')
          ) {
            return `value:${toKebab('fontWeight')}: ${weightAlias[value] || value}`
          }
          if (
            key === 'stretch' ||
            [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              // 'normal', use with direct key instead
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded'
            ].includes(value) ||
            unit
          ) {
            return `value:${toKebab('fontStretch')}: ${value + unit}`
          }

          return unit ? null : `value:${toKebab('fontFamily')}: ${value}`
        }
      },
      tracking: ({ key = '', value = '', unit = '', secondValue = '' }) => {
        if (!value || key || secondValue) return null
        const values: Record<string, string> = {
          tighter: '-0.05em',
          tight: '-0.025em',
          normal: '0em',
          wide: '0.025em',
          wider: '0.05em',
          widest: '0.1em'
        }

        return `value:${toKebab('letterSpacing')}: ${values[value] || value + unit}`
      },
      'line-clamp': ({ key = '', value = '', unit = '', secondValue = '' }) => {
        if (!value || key || unit || secondValue) return null

        if (value === 'none')
          return 'value:overflow: visible; display: block; -webkit-box-orient: horizontal; -webkit-line-clamp: unset;'

        return !is.number.test(value)
          ? null
          : `value:overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${value};`
      },

      list: 'listStyleType',
      'list-image': 'listStyleImage',
      decoration: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
        if (key || secondUnit) return null

        if (!secondValue && (is.number.test(value) || ['from-font', 'auto'].includes(value))) {
          return `value:${toKebab('textDecorationThickness')}: ${
            is.number.test(value) ? `${value}${unit || 'px'}` : value
          }`
        }

        if (unit) return null

        if (['solid', 'double', 'wavy', 'dotted', 'dashed'].includes(value) && !secondValue) {
          return `value:${toKebab('textDecorationStyle')} ${value}`
        }

        return !is.color.test(value) && value !== 'current'
          ? null
          : createColorType('textDecorationColor', value, secondValue)
      },
      'underline-offset': 'textUnderlineOffset',
      leading: createSizingType('lineHeight', sizing, false, false, false, lineHeightAlias),
      indent: createSizingType('textIndent', sizing),
      align: ({ key = '', value = '', unit = '', secondValue = '' }) => {
        if (
          key ||
          secondValue ||
          (!is.number.test(value) &&
            ![
              'baseline',
              'top',
              'middle',
              'bottom',
              'sub',
              'super',
              'text-top',
              'text-bottom'
            ].includes(value))
        ) {
          return null
        }

        return `value:${toKebab('verticalAlign')}: ${
          is.number.test(value) ? value + (unit || 'px') : value
        }`
      },
      whitespace: {
        property: 'whiteSpace',
        value: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      },
      wrap: {
        property: 'overflowWrap',
        value: ['break-word', 'anywhere', 'normal']
      },
      hyphens: {
        property: 'hyphens',
        value: ['none', 'manual', 'auto']
      },
      content: 'content'
    }
  },
  classes: {
    ...transformClasses({
      truncate: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      antialiased: {
        ['webkitFontSmoothing' as CSSProperty]: 'antialiased',
        ['mozOsxFontSmoothing' as CSSProperty]: 'antialiased'
      },
      'subpixel-antialiased': {
        ['webkitFontSmoothing' as CSSProperty]: 'auto',
        ['mozOsxFontSmoothing' as CSSProperty]: 'auto'
      }
    }),
    fontStyle: {
      italic: 'italic',
      'not-italic': 'normal'
    },
    fontVariantNumeric: {
      ...createSameValue([
        'ordinal',
        'slashed-zero',
        'lining-nums',
        'oldstyle-nums',
        'proportional-nums',
        'tabular-nums',
        'diagonal-fractions',
        'stacked-fractions'
      ]),
      'normal-nums': 'normal'
    },
    listStylePosition: {
      'list-inside': 'inside',
      'list-outside': 'outside'
    },
    textDecorationLine: {
      underline: 'underline',
      overline: 'overline',
      'line-through': 'line-through',
      'no-underline': 'none'
    },
    textTransform: {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      'normal-case': 'none'
    },
    wordBreak: {
      'break-normal': 'normal',
      'break-all': 'break-all',
      'break-keep': 'keep-all'
    }
  }
}
