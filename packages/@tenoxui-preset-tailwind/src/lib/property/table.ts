import { toKebab } from '../../utils/toKebab'
import { createSizingType, processValue } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'

export const table: {
  property: (sizing: number) => Property
  classes?: Classes
} = {
  property: (sizing: number = 0.25): Property => ({
    'border-spacing': createSizingType('borderSpacing', sizing),
    'border-spacing-x': ({ key = '', value = '', unit = '', secondValue = '' }) => {
      if (!value || key || secondValue) return null
      return `value:--tw-border-spacing-x: ${processValue(value, unit, sizing)}; ${toKebab(
        'borderSpacing'
      )}: var(--tw-border-spacing-x) var(--tw-border-spacing-y);`
    },
    'border-spacing-y': ({ key = '', value = '', unit = '', secondValue = '' }) => {
      if (!value || key || secondValue) return null
      return `value:--tw-border-spacing-y: ${processValue(value, unit, sizing)}; ${toKebab(
        'borderSpacing'
      )}: var(--tw-border-spacing-x) var(--tw-border-spacing-y);`
    }
  }),
  classes: {
    borderCollapse: {
      'border-collapse': 'collapse',
      'border-separate': 'separate'
    },
    tableLayout: {
      'table-auto': 'auto',
      'table-fixed': 'fixed'
    },
    captionSide: {
      'caption-top': 'top',
      'caption-bottom': 'bottom'
    }
  }
}
