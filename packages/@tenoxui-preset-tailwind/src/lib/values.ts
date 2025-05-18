import { colors } from './color'
import type { Values } from '@tenoxui/types'

export const values: Values = {
  ...colors,
  full: '100%',
  px: '1px',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
  fr: 'minmax(0, 1fr)',
  vh: '100vh',
  vw: '100vw',
  dvw: '100dvw',
  dvh: '100dvh',
  lvw: '100lvw',
  lvh: '100lvh',
  svw: '100svw',
  svh: '100svh',
  'top-left': 'top left',
  'top-right': 'top right',
  'bottom-left': 'bottom left',
  'bottom-right': 'bottom right',
  'light-dark': 'light dark',
  'only-light': 'only light',
  'only-dark': 'only dark',
  'container-size': {
    '3xs': '16rem' /* 256px */,
    '2xs': '18rem' /* 288px */,
    xs: '20rem' /* 320px */,
    sm: '24rem' /* 384px */,
    md: '28rem' /* 448px */,
    lg: '32rem' /* 512px */,
    xl: '36rem' /* 576px */,
    '2xl': '42rem' /* 672px */,
    '3xl': '48rem' /* 768px */,
    '4xl': '56rem' /* 896px */,
    '5xl': '64rem' /* 1024px */,
    '6xl': '72rem' /* 1152px */,
    '7xl': '80rem' /* 1280px */
  },
  /* font family value */
  'default-font-family': {
    sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'FMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
}
