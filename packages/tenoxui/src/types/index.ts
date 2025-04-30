import { Config as CoreConfig } from '@tenoxui/core'
import type { Property, Values, Classes } from '@tenoxui/core'

export interface MoxieConfig {
  property?: Property
  values?: Values
  classes?: Classes
}

export interface Config extends CoreConfig {
  moxie: typeof Moxie
  moxieOptions: MoxieConfig
  safelist: string[]
}
