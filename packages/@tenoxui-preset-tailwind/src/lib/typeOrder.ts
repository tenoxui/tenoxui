/* typeOrder
 *
 * This is the implementation of tailwindcss property-order -
 * in TenoxUI. Instead of specifying the exact css properties -
 * or variables, we specify the exact `type` to specify the -
 * order of the final output CSS.
 *
 * Reference:
 * https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/property-order.ts
 */

import { layout } from './property/layout'
import { flexAndGrid } from './property/flexbox-and-grid'
import { typography } from './property/typography'
import { filter } from './property/filter'

export const typeOrder: string[] = [
  'pointer-events',
  'visible',
  'invisible',
  ...Object.keys(layout.classes.position),
  'inset',
  'top',
  'right',
  'bottom',
  'left',

  'isolate',
  'isolation-auto',
  'z',
  'order',

  'col',
  'col-start',
  'col-end',
  'col-span',
  'row',
  'row-start',
  'row-end',
  'row-span',

  'float',
  'clear',

  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',

  'field-sizing',
  'aspect',
  'h',
  'max-h',
  'min-h',
  'w',
  'max-w',
  'min-w',

  'flex',

  'table-auto',
  'table-fixed',
  'caption-top',
  'caption-bottom',
  'border-collapse',
  'border-separate',

  'border-spacing',
  'border-spacing-x',
  'border-spacing-y',

  'origin',
  'translate',
  'translate-x',
  'translate-y',
  'translate-z',
  'scale',
  'scale-x',
  'scale-y',
  'scale-z',
  'rotate',
  'rotate-x',
  'rotate-y',
  'rotate-z',
  'transform',

  'animation',

  'cursor',

  'touch-action',
  'resize',
  'snap',
  'scroll-m',
  'scroll-my',
  'scroll-mx',
  'scroll-ms',
  'scroll-me',
  'scroll-mt',
  'scroll-mr',
  'scroll-mb',
  'scroll-ml',

  'scroll-p',
  'scroll-py',
  'scroll-px',
  'scroll-ps',
  'scroll-pe',
  'scroll-pt',
  'scroll-pr',
  'scroll-pb',
  'scroll-pl',

  'list-inside',
  'list-outside',
  'list',
  'list-image',

  'appearance',
  'columns',
  'break-after',
  'break-before',
  'break-inside',

  'auto-cols',
  'auto-flow',
  'auto-rows',
  'grid-cols',
  'grid-rows',

  ...Object.keys(flexAndGrid.classes.placeContent),
  ...Object.keys(flexAndGrid.classes.placeItems),
  ...Object.keys(flexAndGrid.classes.alignContent),
  ...Object.keys(flexAndGrid.classes.alignItems),
  ...Object.keys(flexAndGrid.classes.justifyContent),
  ...Object.keys(flexAndGrid.classes.justifyItems),

  'gap',
  'gap-x',
  'gap-y',

  'divide-x',
  'divide-y',
  'divide',

  ...Object.keys(flexAndGrid.classes.placeSelf),
  ...Object.keys(flexAndGrid.classes.alignSelf),
  ...Object.keys(flexAndGrid.classes.justifySelf),

  'scroll',

  'rounded',
  'rounded-s',
  'rounded-e',
  'rounded-ss',
  'rounded-se',
  'rounded-ee',
  'rounded-es',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',

  'border',
  'border-x',
  'border-y',
  'border-s',
  'border-e',
  'border-t',
  'border-r',
  'border-b',
  'border-l',

  'bg',
  'bg-linear',
  'bg-conic',
  'bg-radial',
  'from',
  'via',
  'to',

  'box-decoration',

  'bg-size',
  'bg-clip',
  'bg-position',
  'bg-origin',

  'mask',
  'mask-size',
  'mask-type',
  'mask-position',
  'mask-origin',
  'mask-clip',

  'fill',
  'stroke',

  'object',

  'p',
  'px',
  'py',
  'ps',
  'pe',
  'pt',
  'pr',
  'pb',
  'pl',

  'text',
  'align',
  'font',
  'leading',
  'tracking',
  'wrap',
  'break-normal',
  'break-all',
  'break-keep',
  'hyphens',
  'whitespace',

  'uppercase',
  'lowercase',
  'capitalize',
  'normal-case',
  'underline',
  'overline',
  'line-through',
  'no-underline',
  'italic',
  'not-italic',
  ...Object.keys(typography.classes.fontVariantNumeric as Record<string, string>),
  'decoration',
  'underline-offset',
  'truncate',
  'antialiased',
  'subpixel-antialiased',

  'caret',
  'accent',
  'scheme',

  'opacity',

  'bg-blend',
  'mix-blend',

  'shadow',
  'inset-shadow',
  'ring',
  'inset-ring',
  'ring-offset',

  'outline',
  'outline-offset',

  ...Object.keys(filter(0)),

  'transition',
  'delay',
  'duration',
  'ease',

  'will-change',
  'content',

  'forced-color-adjust'
]
