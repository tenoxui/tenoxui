export function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

export function toKebabCase(str) {
  const prefixes = ['webkit', 'moz', 'ms', 'o']
  for (const prefix of prefixes) {
    if (str.toLowerCase().startsWith(prefix)) {
      return (
        `-${prefix}` +
        str.slice(prefix.length).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      )
    }
  }
  // Handle regular camelCase to kebab-case
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function escapeCSSSelector(str) {
  return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, '\\$1')
}
