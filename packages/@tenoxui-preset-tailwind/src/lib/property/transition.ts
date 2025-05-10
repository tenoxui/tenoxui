/**
 * Note :
 * While you still can use animation-*, there are no animation by default without -
 * additional default style from tailwind.
 */

import { toKebab } from '../../utils/toKebab'
import type { Property } from '@tenoxui/moxie'
import { is } from 'cssrxp'

export const transition = (sizing: number = 0.25): Property => ({
  transition: ({ key = '', value = '', unit = '', secondValue = '' }) => {
    if (key || secondValue) return null
    const prop = toKebab('transitionProperty')
    const additional =
      'transition-duration: 150ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)'

    if (!value)
      return `value:${prop}: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter; ${additional}`
    if (value === 'all') return `value:${prop}: all; ${additional}`
    if (value === 'colors')
      return `value:${prop}: color, background-color, border-color, text-decoration-color, fill, stroke; ${additional}`
    if (value === 'shadow') return `value:${prop}: box-shadow; ${additional}`
    if (value === 'transform')
      return `value:${prop}: transform, translate, scale, rotate; ${additional}`
    if (value === 'none') return `value:${prop}: none`

    if (['normal', 'discrete'].includes(value))
      return `value:${toKebab('transitionBehavior')}: ${
        value === 'discrete' ? 'allow-discrete' : value
      }`

    return `value:${prop}: ${value}; ${additional}`
  },
  ease: ({ key = '', value = '', secondValue }) => {
    if (!value || key || secondValue) return null
    const values: Record<string, string> = {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
    }

    return `value:${toKebab('transitionTimingFunction')}: ${values[value as string] || value}`
  },
  duration: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (is.length.test(value) && value !== 'initial')
      ? null
      : `value:${toKebab('transitionDuration')}: ${value + (unit || 'ms')}`,
  delay: ({ key = '', value = '', unit = '', secondValue = '' }) =>
    key || secondValue || (is.length.test(value) && value !== 'initial')
      ? null
      : `value:${toKebab('transitionDelay')}: ${value + (unit || 'ms')}`,

  animation: ({ key = '', value = '', secondValue = '' }) => {
    if (!value || key || secondValue) return null

    const values: Record<string, string> = {
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite'
    }

    return `value:animation: ${values[value] || value}`
  }
})
