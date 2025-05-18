import { toKebab } from '../../utils/toKebab'
import { createSizingType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'
import type { Classes } from '@tenoxui/types'
import { is } from 'cssrxp'

export const flexAndGrid = {
  property: (sizing: number = 0.25): Property => ({
    /* Flexbox Utilities */
    flex: ({ value = '', unit = '', secondValue = '', key = '', secondUnit = '' }) => {
      if (unit || secondUnit || key || (secondValue && !is.number.test(value + unit))) return null
      if (!value) return 'value:display: flex'
      if (['row', 'col', 'row-reverse', 'col-reverse'].includes(value))
        return `value:${toKebab('flexDirection')}: ${value.replace('col', 'column')}`
      if (['wrap', 'wrap-reverse', 'nowrap'].includes(value))
        return `value:${toKebab('flexDirection')}: ${value}`

      const flexValues: Record<string, string> = {
        auto: '1 1 auto',
        initial: '0 1 auto',
        none: 'none'
      }
      let finalValue = flexValues[value] || value
      if (is.number.test(value) && secondValue)
        finalValue = (Number(value) / Number(secondValue)) * 100 + '%'

      return `value:flex: ${finalValue}`
    },
    basis: {
      group: 'container-size',
      property: ({ key = '', value = '', unit = '', secondValue = '', secondUnit = '' }) => {
        if (key || secondUnit) return null

        let finalValue = is.length.test(value) ? value : value + unit

        if (is.number.test(value + unit) && !secondValue) {
          finalValue = Number(value) * sizing + 'rem'
        } else if (secondValue && is.number.test(value + unit) && is.number.test(secondValue)) {
          finalValue = (Number(value) / Number(secondValue)) * 100 + '%'
        }

        return `value:${toKebab('flexBasis')}: ${finalValue}`
      }
    },
    grow: ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('flexGrow')}: ${!value ? '1' : value}`,
    shrink: ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('flexShrink')}: ${!value ? '1' : value}`,

    order: ({ value = '', unit = '', secondValue = '', key = '' }) => {
      if (key || secondValue || unit) return null

      return `value:order: ${
        {
          none: '0',
          first: 'calc(-infinity)',
          last: 'calc(infinity)'
        }[value] || value
      }`
    },

    /* Grid Utilities */
    /* Grid Columns */
    'grid-cols': ({ value = '', unit = '', secondValue = '', key = '' }) => {
      if (key || secondValue) return null

      let finalValue = value + unit

      if (is.number.test(value + unit)) finalValue = `repeat(${value}, minmax(0, 1fr))`

      return `value:${toKebab('gridTemplateColumns')}: ${finalValue}`
    },
    'col-span': ({ value = '', unit = '', secondValue = '', key = '', raw = [] }) => {
      if (key || secondValue || (is.number.test(value + unit) && (value + unit).startsWith('-')))
        return null

      let finalValue

      if ((raw as (string | undefined)[])[2] === 'full') finalValue = '1 / -1'
      else finalValue = `span ${value + unit} / span ${value + unit}`

      return `value:${toKebab('gridColumn')}: ${finalValue}`
    },
    'col-start': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridColumnStart')}: ${value}`,
    'col-end': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridColumnEnd')}: ${value}`,
    col: ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridColumn')}: ${value}`,

    /* Grid Rows */
    'grid-rows': ({ value = '', unit = '', secondValue = '', key = '' }) => {
      if (key || secondValue) return null
      let finalValue = value + unit
      if (is.number.test(value + unit)) finalValue = `repeat(${value}, minmax(0, 1fr))`
      return `value:${toKebab('gridTemplateRows')}: ${finalValue}`
    },
    'row-span': ({ value = '', unit = '', secondValue = '', key = '', raw = [] }) => {
      if (key || secondValue || (is.number.test(value + unit) && (value + unit).startsWith('-')))
        return null
      let finalValue
      if ((raw as (string | undefined)[])[2] === 'full') finalValue = '1 / -1'
      else finalValue = `span ${value + unit} / span ${value + unit}`
      return `value:${toKebab('gridRow')}: ${finalValue}`
    },
    'row-start': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridRowStart')}: ${value}`,
    'row-end': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridRowEnd')}: ${value}`,
    row: ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key || secondValue || unit ? null : `value:${toKebab('gridRow')}: ${value}`,

    /* Other Grid */
    'grid-flow': ({ value = '', secondValue = '', key = '' }) => {
      return key || !['row', 'col', 'dense', 'row-dense', 'col-dense'].includes(value)
        ? null
        : `value:${toKebab('gridAutoFlow')}: ${value.replace('-', ' ')}`
    },

    'auto-cols': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key ? null : `value:${toKebab('gridAutoColumns')}: ${value + unit}`,
    'auto-rows': ({ value = '', unit = '', secondValue = '', key = '' }) =>
      key ? null : `value:${toKebab('gridAutoRows')}: ${value + unit}`,

    /* Gap */
    gap: createSizingType('gap', sizing),
    'gap-x': createSizingType('columnGap', sizing),
    'gap-y': createSizingType('rowGap', sizing)
  }),
  classes: {
    justifyContent: {
      'justify-start': 'flex-start',
      'justify-end': 'flex-end',
      'justify-end-safe': 'safe flex-end',
      'justify-center': 'center',
      'justify-center-safe': 'safe center',
      'justify-between': 'space-between',
      'justify-around': 'space-around',
      'justify-evenly': 'space-evenly',
      'justify-stretch': 'stretch',
      'justify-baseline': 'baseline',
      'justify-normal': 'normal'
    },
    justifyItems: {
      'justify-items-start': 'start',
      'justify-items-end': 'end',
      'justify-items-end-safe': 'safe end',
      'justify-items-center': 'center',
      'justify-items-center-safe': 'safe center',
      'justify-items-stretch': 'stretch',
      'justify-items-normal': 'normal'
    },
    justifySelf: {
      'justify-self-start': 'start',
      'justify-self-end': 'end',
      'justify-self-end-safe': 'safe end',
      'justify-self-center': 'center',
      'justify-self-center-safe': 'safe center',
      'justify-self-stretch': 'stretch',
      'justify-self-auto': 'auto'
    },
    alignContent: {
      'content-normal': 'normal',
      'content-start': 'flex-start',
      'content-end': 'flex-end',
      'content-center': 'center',
      'content-between': 'space-between',
      'content-around': 'space-around',
      'content-evenly': 'space-evenly',
      'content-stretch': 'stretch',
      'content-baseline': 'baseline'
    },
    alignItems: {
      'items-start': 'flex-start',
      'items-end': 'flex-end',
      'items-end-safe': 'safe flex-end',
      'items-center': 'center',
      'items-center-safe': 'safe center',
      'items-stretch': 'stretch',
      'items-baseline': 'baseline',
      'items-baseline-last': 'last baseline'
    },
    alignSelf: {
      'self-start': 'flex-start',
      'self-end': 'flex-end',
      'self-end-safe': 'safe flex-end',
      'self-center': 'center',
      'self-center-safe': 'safe center',
      'self-stretch': 'stretch',
      'self-baseline': 'baseline',
      'self-baseline-last': 'last baseline',
      'self-auto': 'auto'
    },
    placeContent: {
      'place-content-start': 'start',
      'place-content-end': 'end',
      'place-content-end-safe': 'safe end',
      'place-content-center': 'center',
      'place-content-center-safe': 'safe center',
      'place-content-between': 'space-between',
      'place-content-around': 'space-around',
      'place-content-evenly': 'space-evenly',
      'place-content-stretch': 'stretch',
      'place-content-baseline': 'baseline'
    },
    placeItems: {
      'place-items-start': 'start',
      'place-items-end': 'end',
      'place-items-end-safe': 'safe end',
      'place-items-center': 'center',
      'place-items-center-safe': 'safe center',
      'place-items-stretch': 'stretch',
      'place-items-baseline': 'baseline'
    },
    placeSelf: {
      'place-self-start': 'start',
      'place-self-end': 'end',
      'place-self-end-safe': 'safe end',
      'place-self-center': 'center',
      'place-self-center-safe': 'safe center',
      'place-self-stretch': 'stretch',
      'place-self-auto': 'auto'
    }
  } satisfies Classes
}
