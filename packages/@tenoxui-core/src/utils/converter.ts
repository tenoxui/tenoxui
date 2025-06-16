import type { CSSProperty } from '@tenoxui/types'

export function toKebabCase(prop: CSSProperty): string {
  const str = prop as string
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
