import type { CSSPropertyOrVariable } from '@tenoxui/types'

export function toKebab(str: CSSPropertyOrVariable): string {
  return nakKebab(str as string)
}

export function nakKebab(str: string): string {
  if (/^(webkit|moz|ms|o)[A-Z]/.test(str)) {
    const match = str.match(/^(webkit|moz|ms|o)/)
    if (match) {
      const prefix = match[0]
      return `-${prefix}${str
        .slice(prefix.length)
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
    }
  }

  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}
