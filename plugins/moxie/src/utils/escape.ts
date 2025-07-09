export function escapeSelector(str: string): string {
  return str
    .replace(/^(\d)/, '\\3$1 ') // escapeSelector any digits at the start of the selector
    .replace(/([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '\\$1')
}
export function unescapeSelector(str: string): string {
  return (
    str
      // First, unescapeSelector the special characters by removing the backslash
      .replace(/\\([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '$1')
      // Then handle the digit escaping at the start: \3X -> X (where X is a digit)
      .replace(/^\\3(\d) /, '$1')
  )
}
