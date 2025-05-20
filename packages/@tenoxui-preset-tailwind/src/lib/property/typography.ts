/** Notes
 *
 * 1. color
 *     Use text-<color>/<opacity> to set color property, there's not -
 *     only ready-to-use color such as red-500, lime-500, or -
 *     neutral-950. You can use _any_ color and they also can -
 *     be processed and mixed the opacity just like other color.
 *
 * 2. font-stretch
 *    font-stretch-* utility is merged directly with font-* -
 *    utility for shorter class names, using `scretch` key -
 *    is also available. Using font-stretch-* still available.
 */

import { toKebab } from '../../utils/toKebab'
import { createSizingType, createColorType, processValue } from '../../utils/createValue'
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
      text: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '', raw }) => {
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
              lineHeightAlias[secondValue] ||
              ((raw as string[]) &&
              (raw as string[])[4] &&
              ((raw as string[])[4].startsWith('[') || (raw as string[])[4].startsWith('('))
                ? secondValue
                : is.number.test(secondValue + secondUnit)
                  ? processValue(secondValue, secondUnit, sizing)
                  : lineHeight)
            }`
          }
          return `value:${toKebab('fontSize')}: ${
            is.number.test(value + unit) ? sizing * Number(value) + 'rem' : value + unit
          }${
            secondValue
              ? `; ${toKebab('lineHeight')}: ${
                  lineHeightAlias[secondValue] ||
                  ((raw as string[]) &&
                  (raw as string[])[4] &&
                  ((raw as string[])[4].startsWith('[') || (raw as string[])[4].startsWith('('))
                    ? secondValue
                    : is.number.test(secondValue + secondUnit)
                      ? processValue(secondValue, secondUnit, sizing)
                      : secondValue + secondUnit)
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
            (key && !['weight', 'family-name', 'family', 'stretch'].includes(key)) ||
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
      'font-stretch': 'fontStretch',
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
        if ((key && !['length', 'color'].includes(key)) || secondUnit) return null

        if (
          key === 'length' ||
          (!secondValue && (is.number.test(value) || ['from-font', 'auto'].includes(value)))
        ) {
          return `value:${toKebab('textDecorationThickness')}: ${
            is.number.test(value) ? `${value}${unit || 'px'}` : value
          }`
        }

        if (unit) return null

        if (['solid', 'double', 'wavy', 'dotted', 'dashed'].includes(value) && !secondValue) {
          return `value:${toKebab('textDecorationStyle')} ${value}`
        }

        return key === 'color' || (!is.color.test(value) && value !== 'current')
          ? null
          : createColorType('textDecorationColor', value, secondValue)
      },
      'underline-offset': {
        property: 'textUnderlineOffset',
        value: ({ value = '', unit = '', key = '', secondValue = '' }) => {
          if (key || secondValue) return null

          return is.number.test(value + unit) ? value + (unit || 'px') : value + unit
        }
      },
      leading: ({ key = '', value = '', unit = '', secondValue = '', raw }) => {
        if (key || secondValue) return null

        return `value:${toKebab('lineHeight')}: ${
          lineHeightAlias[value] ||
          ((raw as string[])[2].startsWith('[') || (raw as string[])[2].startsWith('(')
            ? value
            : is.number.test(value + unit)
              ? processValue(value, unit, sizing)
              : value + unit)
        }`
      },
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
        ['mozOsxFontSmoothing' as CSSProperty]: 'grayscale'
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
