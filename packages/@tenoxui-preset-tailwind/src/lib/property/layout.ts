import { toKebab } from '../../utils/toKebab'
import { createSizingType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'
import { createSameValue } from '@nousantx/someutils'
import { is } from 'cssrxp'

export const layout = {
  property: (sizing: number = 0.25): Property => ({
    aspect: ({ value = '', unit = '', secondValue = '', secondUnit = '' }) => {
      const presets: { [a: string]: string } = { square: '1 / 1', video: '16 / 9' }
      if (
        (!is.number.test(value) && !(presets[value] || value === 'auto')) ||
        unit ||
        secondUnit ||
        (is.number.test(value) && !secondValue)
      ) {
        return null
      }
      const finalValue = presets[value] || (value === 'auto' ? 'auto' : `${value} / ${secondValue}`)

      return `value:${toKebab('aspectRatio')}: ${finalValue}`
    },
    columns: {
      group: 'container-size',
      property: 'columns'
    },
    'break-after': {
      property: 'breakAfter',
      value: ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']
    },
    'break-before': {
      property: 'breakBefore',
      value: ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']
    },
    'break-inside': {
      property: 'breakInside',
      value: ['auto', 'avoid', 'avoid-page', 'avoid-column']
    },
    'box-decoration': {
      property: 'boxDecorationBreak',
      value: ['clone', 'slice']
    },
    'sr-only': ({ value }) =>
      value
        ? null
        : `value:position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;`,
    'not-sr-only': ({ value }) =>
      value
        ? null
        : `value:position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal;`,
    float: ({ key = '', value = '', secondValue = '' }) =>
      !['right', 'left', 'none', 'start', 'end'].includes(value) || key || secondValue
        ? null
        : `value:float: ${['start', 'end'].includes(value) ? `inline-${value}` : value}`,
    clear: ({ key = '', value = '', secondValue = '' }) =>
      !['right', 'left', 'none', 'start', 'end', 'both'].includes(value) || key || secondValue
        ? null
        : `value:clear: ${['start', 'end'].includes(value) ? `inline-${value}` : value}`,
    object: {
      property: ({ value = '', key = '', secondValue = '', raw }) => {
        const fitValue = ['none', 'contain', 'fill', 'cover', 'scale-down']
        const pnValue = [
          'top',
          'left',
          'bottom',
          'right',
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'center'
        ]
        if (
          ![...fitValue, ...pnValue].includes((raw as (string | undefined)[])[2] as string) ||
          (key && !['position', 'fit'].includes(key)) ||
          secondValue
        )
          return null

        return key
          ? key === 'position'
            ? 'objectPosition'
            : 'objectFit'
          : fitValue.includes(value)
            ? 'objectFit'
            : 'objectPosition'
      }
    },
    overflow: {
      property: 'overflow',
      value: ['hidden', 'scroll', 'clip', 'visible', 'auto']
    },
    'overflow-x': {
      property: 'overflowX',
      value: ['hidden', 'scroll', 'clip', 'visible', 'auto']
    },
    'overflow-y': {
      property: 'overflowY',
      value: ['hidden', 'scroll', 'clip', 'visible', 'auto']
    },
    overscroll: {
      property: 'overscrollBehavior',
      value: ['auto', 'contain', 'none']
    },
    'overscroll-x': {
      property: 'overscrollBehaviorX',
      value: ['auto', 'contain', 'none']
    },
    'overscroll-y': {
      property: 'overscrollBehaviorY',
      value: ['auto', 'contain', 'none']
    },
    top: createSizingType('top', sizing),
    left: createSizingType('left', sizing),
    bottom: createSizingType('bottom', sizing),
    right: createSizingType('right', sizing),
    inset: createSizingType('inset', sizing),
    'inset-x': createSizingType('insetInline', sizing),
    'inset-y': createSizingType('insetBlock', sizing),
    start: createSizingType('insetInlineStart', sizing),
    end: createSizingType('insetInlineEnd', sizing),
    z: ({ value = '', unit = '', key = '', secondValue = '' }) =>
      !value || ((unit || key || secondValue || is.length.test(value + unit)) && value !== 'auto')
        ? null
        : `value:${toKebab('zIndex')}: ${value}`
  }),
  classes: {
    boxSizing: {
      'box-border': 'border-box',
      'box-content': 'content-box'
    },
    display: {
      ...createSameValue([
        'inline',
        'block',
        'inline-block',
        'flow-root',
        'inline-flex',
        'grid',
        'inline-grid',
        'contents',
        'table',
        'table-caption',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-footer-group',
        'table-row-group',
        'table-row',
        'list-item'
      ]),
      hidden: 'none'
    },
    isolation: {
      isolate: 'isolate',
      'isolation-auto': 'auto'
    },
    position: createSameValue(['static', 'fixed', 'absolute', 'relative', 'sticky']),
    visibility: {
      visible: 'visible',
      invisible: 'hidden',
      collapse: 'collapse'
    }
  } satisfies Classes
}
