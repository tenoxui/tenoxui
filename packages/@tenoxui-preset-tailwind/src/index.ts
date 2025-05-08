import { layout } from './lib/property/layout'
import { flexAndGrid } from './lib/property/flexbox-and-grid'
import { sizing as sizingUtilities } from './lib/property/sizing'
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
    ...sizingUtilities(sizing)
  },
  values,
  classes: {
    ...layout.classes,
    ...flexAndGrid.classes
  }
})

export default preset
