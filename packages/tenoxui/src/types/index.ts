import { Moxie, Config as CoreConfig } from '@tenoxui/core'
import type { Property } from '@tenoxui/core'
import type { Values, Classes } from '@tenoxui/types'

export interface MoxieConfig {
  property?: Property
  values?: Values
  classes?: Classes
}

export interface Config extends CoreConfig {
  moxie: typeof Moxie
  moxieOptions: MoxieConfig
  safelist: string[]
  tabSize: number
  simple: boolean
  classNameOrder: string[]
}
