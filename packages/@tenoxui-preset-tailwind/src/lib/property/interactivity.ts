import { toKebab } from '../../utils/toKebab'
import { createColorType, createSizingType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { CSSProperty } from '@tenoxui/types'
import { is } from 'cssrxp'

export const interactivity = (sizing: number = 0.25): Property => ({
  accent: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit || !is.color.test(value)
      ? null
      : createColorType('accentColor', value, secondUnit),
  appearance: {
    property: 'appearance',
    value: ['none', 'auto']
  },
  caret: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) =>
    !value || key || secondUnit || !is.color.test(value)
      ? null
      : createColorType('caretColor', value, secondUnit),
  scheme: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '', raw }) => {
    if (
      !value ||
      key ||
      secondUnit ||
      !['light', 'dark', 'light-dark', 'normal', 'only-light', 'only-dark'].includes(
        (raw as string[])[2]
      )
    )
      return null

    return `value:${toKebab('colorScheme')}: ${value}`
  },
  cursor: 'cursor',
  'field-sizing': {
    property: 'fieldSizing' as CSSProperty,
    value: ['content', 'fixed']
  },
  'pointer-events': {
    property: 'pointerEvents',
    value: ['auto', 'none']
  },
  resize: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '', raw }) => {
    if (key || secondUnit) {
      return null
    }

    if (!value) return `value:resize: both`
    if (value === 'y') return `value:resize: vertical`
    if (value === 'x') return `value:resize: horizontal`
    if (value === 'none') return `value:resize: none`
    return null
  },
  scroll: {
    property: 'scrollBehavior',
    value: ['auto', 'smooth']
  },
  'scroll-m': createSizingType('scrollMargin', sizing),
  'scroll-mx': createSizingType('scrollMarginInline', sizing),
  'scroll-my': createSizingType('scrollMarginBlock', sizing),
  'scroll-ms': createSizingType('scrollMarginInlineStart', sizing),
  'scroll-me': createSizingType('scrollMarginInlineEnd', sizing),
  'scroll-mt': createSizingType('scrollMarginTop', sizing),
  'scroll-ml': createSizingType('scrollMarginLeft', sizing),
  'scroll-mb': createSizingType('scrollMarginBottom', sizing),
  'scroll-mr': createSizingType('scrollMarginRight', sizing),
  'scroll-p': createSizingType('scrollPadding', sizing),
  'scroll-px': createSizingType('scrollPaddingInline', sizing),
  'scroll-py': createSizingType('scrollPaddingBlock', sizing),
  'scroll-ps': createSizingType('scrollPaddingInlineStart', sizing),
  'scroll-pe': createSizingType('scrollPaddingInlineEnd', sizing),
  'scroll-pt': createSizingType('scrollPaddingTop', sizing),
  'scroll-pl': createSizingType('scrollPaddingLeft', sizing),
  'scroll-pb': createSizingType('scrollPaddingBottom', sizing),
  'scroll-pr': createSizingType('scrollPaddingRight', sizing),

  snap: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '', raw }) => {
    if (!value || key || secondUnit) {
      return null
    }

    if (['start', 'end', 'center', 'align-none'].includes(value))
      return `value:${toKebab('scrollSnapAlign')}: ${value.replace('align-none', 'none')}`
    if (['normal', 'always'].includes(value)) return `value:${toKebab('scrollSnapStop')}: ${value}`
    if (['none', 'y', 'x', 'both'].includes(value))
      return `value:${toKebab('scrollSnapType')}: ${
        value !== 'none' ? `${value} var(--tw-scroll-snap-strictness)` : value
      }`
    if (['mandatory', 'proximity'].includes(value))
      return `value:--tw-scroll-snap-strictness: ${value}`

    return null
  },
  touch: {
    property: 'touchAction',
    value: [
      'auto',
      'none',
      'pan-x',
      'pan-left',
      'pan-right',
      'pan-y',
      'pan-up',
      'pan-down',
      'pinch-zoom',
      'manipulation'
    ]
  },
  select: {
    property: 'userSelect',
    value: ['all', 'none', 'auto', 'text']
  },
  'will-change': 'willChange',
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
})
