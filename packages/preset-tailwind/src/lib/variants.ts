import type { Property } from '@tenoxui/moxie'
import { values } from './values'

const continerBreakpoints = values['container-size'] as Record<string, string>
const supportCustom: Record<string, string> = {
  // Group 1
  hover: '&:hover',
  focus: '&:focus',
  'focus-within': '&:focus-within',
  'focus-visible': '&:focus-visible',
  active: '&:active',
  visited: '&:visited',
  target: '&:target',

  // Group 2
  inert: '&:is([inert], [inert] *)',
  first: '&:first-child',
  last: '&:last-child',
  only: '&:only-child',
  odd: '&:nth-child(odd)',
  even: '&:nth-child(even)',
  'first-of-type': '&:first-of-type',
  'last-of-type': '&:last-of-type',
  'only-of-type': '&:only-of-type',

  // Group 3
  empty: '&:empty',
  disabled: '&:disabled',
  enabled: '&:enabled',
  checked: '&:checked',
  indeterminate: '&:indeterminate',
  default: '&:default',
  optional: '&:optional',
  required: '&:required',
  valid: '&:valid',
  invalid: '&:invalid',
  'user-valid': '&:user-valid',
  'user-invalid': '&:user-invalid',
  'in-range': '&:in-range',
  'out-of-range': '&:out-of-range',
  'placeholder-shown': '&:placeholder-shown',
  'details-content': '&:details-content',
  autofill: '&:autofill',
  'read-only': '&:read-only',

  // Group 4
  rtl: '&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)',
  ltr: '&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)',
  open: '&:is([open], :popover-open, :open)'
}

export const customVariants: Property = {
  supports: ({ key, value, secondValue }) =>
    !value || secondValue ? null : `value:@supports (${key}: ${value})`,

  'not-supports': ({ key, value, secondValue }) =>
    !value || secondValue ? null : `value:@supports not (${key}: ${value})`,

  nth: ({ key, value, secondValue }) =>
    !value || key || secondValue ? null : `value:&:nth-child(${value})`,

  'nth-last': ({ key, value, secondValue }) =>
    !value || key || secondValue ? null : `value:&:nth-last-child(${value})`,

  'nth-of-type': ({ key, value, secondValue }) =>
    !value || key || secondValue ? null : `value:&:nth-of-type(${value})`,

  'nth-last-of-type': ({ key, value, secondValue }) =>
    !value || key || secondValue ? null : `value:&:nth-last-of-type(${value})`,

  min: ({ key, value, unit, secondValue }) =>
    !value || key || secondValue ? null : `value:@media (width >= ${value}${unit})`,

  max: ({ key, value, unit, secondValue }) =>
    !value || key || secondValue ? null : `value:@media (width < ${value}${unit})`,

  '@min': ({ key, value, unit, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:@container (width >= ${continerBreakpoints[value + unit] || value + unit})`,

  '@max': ({ key, value, unit, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:@container (width < ${continerBreakpoints[value + unit] || value + unit})`,

  has: ({ key, value, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:&:has(${
          Object.keys(supportCustom).includes(value)
            ? supportCustom[value].replace('&', '*')
            : `:is(${value})`
        })`,

  in: ({ key, value, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value::where(${
          Object.keys(supportCustom).includes(value)
            ? supportCustom[value].replace('&', '*')
            : `:is(${value})`
        }) &`,

  not: ({ key, value, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:&:not(${
          Object.keys(supportCustom).includes(value)
            ? supportCustom[value].replace('&', '*')
            : `:is(${value})`
        })`,

  group: ({ key, value, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:&:is(:where(.group)${
          Object.keys(supportCustom).includes(value)
            ? supportCustom[value].replace('&', '')
            : `:is(${value})`
        } *)`,

  peer: ({ key, value, secondValue }) =>
    !value || key || secondValue
      ? null
      : `value:&:is(:where(.peer)${
          Object.keys(supportCustom).includes(value)
            ? supportCustom[value].replace('&', '')
            : `:is(${value})`
        } ~ *)`
}

export const variants: Record<string, string> = {
  dark: 'value:@media (prefers-color-scheme: dark)',
  light: 'value:@media (prefers-color-scheme: light)',

  '*': 'value:& > *',
  '**': 'value:& *',

  // pseudo-element
  before: '&::before',
  after: '&::after',
  'first-letter': '&::first-letter',
  'first-line': '&::first-line',
  marker: '&::marker, & *::marker',
  selection: '&::selection',
  file: '&::file-selector-button',
  backdrop: '&::backdrop',
  placeholder: '&::placeholder',

  // media queries
  'motion-safe': '@media (prefers-reduced-motion: no-preference)',
  'motion-reduce': '@media (prefers-reduced-motion: reduce)',
  'contrast-more': '@media (prefers-contrast: more)',
  'contrast-less': '@media (prefers-contrast: less)',
  'forced-colors': '@media (forced-colors: active)',
  'inverted-colors': '@media (inverted-colors: inverted)',
  'pointer-fine': '@media (pointer: fine)',
  'pointer-coarse': '@media (pointer: coarse)',
  'pointer-none': '@media (pointer: none)',
  'any-pointer-fine': '@media (any-pointer: fine)',
  'any-pointer-coarse': '@media (any-pointer: coarse)',
  'any-pointer-none': '@media (any-pointer: none)',
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  noscript: '@media (scripting: none)',
  print: '@media print',

  // pseudo-classes
  ...supportCustom,
  // functional variants / complex variants
  ...customVariants
}
