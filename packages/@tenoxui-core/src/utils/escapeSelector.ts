export function escapeCSSSelector(str: string): string {
  return str
    .replace(/^(\d)/, '\\3$1 ') // escape any digits at the start of the selector
    .replace(/([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '\\$1')
}

export function unescapeCSSSelector(str: string): string {
  return str.replace(/\\3(\d) /g, '$1').replace(/\\([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '$1')
}
