import { layout } from './lib/property/layout'
import { flexAndGrid } from './lib/property/flexbox-and-grid'
import { sizing as sizingUtilities } from './lib/property/sizing'
import { typography } from './lib/property/typography'
import { background } from './lib/property/background'
import { border } from './lib/property/border'
import { effect } from './lib/property/effect'
import { filter } from './lib/property/filter'
import { table } from './lib/property/table'
import { transition } from './lib/property/transition'
import { transform } from './lib/property/transform'
import { interactivity } from './lib/property/interactivity'
import { svg } from './lib/property/svg'
import { accessibility } from './lib/property/accessibility'
import { values } from './lib/values'
import { variants } from './lib/variants'
import { typeOrder } from './lib/typeOrder'
import { createColorType, processValue } from './utils/createValue'
import { is } from 'cssrxp'
import type { CSSPropertyOrVariable } from '@tenoxui/types'
import type { Config, Property } from 'tenoxui'
import type { Classes } from '@tenoxui/types'

const property = (sizing: number = 0.25): Property => ({
  ...layout.property(sizing),
  ...flexAndGrid.property(sizing),
  ...sizingUtilities(sizing),
  ...typography.property(sizing),
  ...background.property(sizing),
  ...border.property(sizing),
  ...effect.property(sizing),
  ...filter(sizing),
  ...table.property(sizing),
  ...transition(sizing),
  ...transform(sizing),
  ...interactivity(sizing),
  ...svg,
  ...accessibility,
  _size: ({ key = '', value = '', unit = '', secondValue = '', raw }) =>
    !value || secondValue
      ? null
      : `value:${key || '--tw-size-f-type'}: ${
          (raw as string[])[2].startsWith('[') ? value : processValue(value, unit, sizing)
        }`,
  _color: ({ key = '', value = '', secondValue = '', secondUnit = '' }) =>
    !value || secondUnit || (!is.color.test(value) && value !== 'current')
      ? null
      : createColorType((key || '--tw-color-f-type') as CSSPropertyOrVariable, value, secondValue),
  _all: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    !value || secondValue ? null : `value:${key || '--tw-f-type'}: ${value + unit}`
})

const classes: Classes = {
  ...layout.classes,
  ...flexAndGrid.classes,
  ...typography.classes,
  ...effect.classes,
  ...table.classes
}

const breakpoints: { [bp: string]: string } = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem'
}

export const preset = ({ sizing = 0.25, order = true } = {}): Partial<Config> => ({
  variants,
  property: property(sizing),
  values,
  classes,
  breakpoints,
  reservedVariantChars: ['@', '*'],
  typeOrder: order ? typeOrder : []
})

export { preflight } from './styles/preflight'
export { properties as defaultProperties } from './styles/properties'
export { property, classes, breakpoints }
export { values } from './lib/values'
export { variants } from './lib/variants'
export { typeOrder } from './lib/typeOrder'
export default preset
