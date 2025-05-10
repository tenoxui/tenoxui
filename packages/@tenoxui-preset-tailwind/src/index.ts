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
import { variants, customVariants } from './lib/variants'
import type { Property } from '@tenoxui/moxie'
import type { Values, Classes } from '@tenoxui/types'

export const preset = ({ sizing = 0.25 } = {}): {
  property: Property
  values: Values
  classes: Classes
} => ({
  variants,
  customVariants,
  property: {
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
    ...accessibility
  },
  values,
  classes: {
    ...layout.classes,
    ...flexAndGrid.classes,
    ...typography.classes,
    ...effect.classes,
    ...table.classes
  },
  breakpoints: {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
    '2xl': '96rem'
  }
})

export default preset
