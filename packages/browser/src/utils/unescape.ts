export function unescapeCSSSelector(str: string): string {
  return str.replace(/\\3(\d) /g, '$1').replace(/\\([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '$1')
}
