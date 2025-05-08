import { layout } from './lib/property/layout'
import { flexAndGrid } from './lib/property/flexbox-and-grid'
import { sizing as sizingUtilities } from './lib/property/sizing'
import { typography } from './lib/property/typography'
import { background } from './lib/property/background'
import { values } from './lib/values'
import type { Property } from '@tenoxui/moxie'
import type { Values, Classes } from '@tenoxui/types'

export const preset = ({ sizing = 0.25 } = {}): {
  property: Property
  values: Values
  classes: Classes
} => ({
  property: {
    ...layout.property(sizing),
    ...flexAndGrid.property(sizing),
    ...sizingUtilities(sizing),
    ...typography.property(sizing),
    ...background.property(sizing)
  },
  values,
  classes: {
    ...layout.classes,
    ...flexAndGrid.classes,
    ...typography.classes
  }
})

export default preset
