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
  typeOrder: string[]
  selectorPrefix: string
  prefixLoaderOptions: MoxieConfig
  reservedVariantChars: string[]
}

export type ShorthandItem = {
  className: string
  cssRules: string | string[] | null
  value: string | null
  isImportant: boolean
  variants: null | { name: string; data: string | null }
  raw: null | (string | undefined)[]
}

export type AliasItem = {
  className: string
  rules: { cssRules: string | string[] | null; value: string | null; isImportant: boolean }[]
  isImportant: boolean
  prefix: null | { name: string; data: string | null }
  variants:
    | null
    | {
        className: string
        rules: {
          cssRules: string | string[] | null
          value: string | null
          isImportant: boolean
        }[]
        variant: string
      }[]
  raw: null | (string | undefined)[]
}
