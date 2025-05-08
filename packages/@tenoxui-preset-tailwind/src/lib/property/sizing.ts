/**
 * Unavailable utilities
 *
 * space-x-*
 * space-y-*
 */

import { createSizingType } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'

export const sizing = (sizing: number = 0.25): Property => ({
  p: createSizingType('padding', sizing),
  pt: createSizingType('paddingTop', sizing),
  pl: createSizingType('paddingLeft', sizing),
  pb: createSizingType('paddingBottom', sizing),
  pr: createSizingType('paddingRight', sizing),
  py: createSizingType('paddingBlock', sizing),
  px: createSizingType('paddingInline', sizing),
  m: createSizingType('margin', sizing),
  mt: createSizingType('marginTop', sizing),
  ml: createSizingType('marginLeft', sizing),
  mb: createSizingType('marginBottom', sizing),
  mr: createSizingType('marginRight', sizing),
  my: createSizingType('marginBlock', sizing),
  mx: createSizingType('marginInline', sizing),
  ms: createSizingType('marginInlineStart', sizing),
  me: createSizingType('marginInlineEnd', sizing),
  w: {
    property: createSizingType('width', sizing, false, true, true, { screen: '100vw' }),
    group: 'container-size'
  },
  'min-w': {
    property: createSizingType('minWidth', sizing, false, true, true, { screen: '100vw' }),
    group: 'container-size'
  },
  'max-w': {
    property: createSizingType('maxWidth', sizing, false, true, true, { screen: '100vw' }),
    group: 'container-size'
  },
  h: createSizingType('height', sizing, false, true, true, { screen: '100vh' }),
  'min-h': createSizingType('minHeight', sizing, false, true, true, { screen: '100vh' }),
  'max-h': createSizingType('maxHeight', sizing, false, true, true, { screen: '100vh' }),
  size: {
    property: createSizingType(['width', 'height'], sizing, false, true, true),
    group: 'container-size'
  },
  leading: createSizingType('lineHeight', sizing, false, false, false, {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  }),
  indent: createSizingType('textIndent', sizing)
})
