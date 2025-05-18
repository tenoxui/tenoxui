import { createSizingType, processValue } from '../../utils/createValue'
import type { Property } from '@tenoxui/moxie'

export const sizing = (sizing: number = 0.25): Property => ({
  p: createSizingType('padding', sizing),
  pt: createSizingType('paddingTop', sizing),
  pl: createSizingType('paddingLeft', sizing),
  pb: createSizingType('paddingBottom', sizing),
  pr: createSizingType('paddingRight', sizing),
  py: createSizingType('paddingBlock', sizing),
  px: createSizingType('paddingInline', sizing),
  ps: createSizingType('paddingInlineStart', sizing),
  pe: createSizingType('paddingInlineEnd', sizing),
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
  'space-x': ({ value = '', unit = '', key = '', secondValue = '', raw }) => {
    if (key || secondValue) return null

    const finalValue = processValue(value, unit, sizing)

    return {
      className: `${(raw as string[])[6]} > :not(:last-child)`,
      cssRules: `--tw-space-x-reverse: 0;
margin-inline-start: calc(${finalValue} * var(--tw-space-x-reverse));
margin-inline-end: calc(${finalValue} * calc(1 - var(--tw-space-x-reverse)));`,
      value: null
    }
  },
  'space-y': ({ value = '', unit = '', key = '', secondValue = '', raw }) => {
    if (!value || key || secondValue) return null

    const finalValue = processValue(value, unit, sizing)

    return {
      className: `${(raw as string[])[6]} > :not(:last-child)`,
      cssRules: `--tw-space-y-reverse: 0;
margin-block-start: calc(${finalValue} * var(--tw-space-y-reverse));
margin-block-end: calc(${finalValue} * calc(1 - var(--tw-space-y-reverse)));`,
      value: null
    }
  }
})
