import { generateColors } from '@nousantx/color-generator'
import type { Values } from 'tenoxui'

export const color = {
  neutral: '#737373',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  blue: '#3b82f6',
  purple: '#a855f7',
  teal: '#14b8a6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  lime: '#84cc16',
  amber: '#f59e0b',
  indigo: '#6366f1',
  rose: '#f43f5e',
  emerald: '#10b981',
  sky: '#0ea5e9'
}

export const colors: Values = generateColors({
  option: {
    format: 'object2',
    output: 'rgb-only'
  },
  color
}) as Values
