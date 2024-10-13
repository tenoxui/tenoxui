export function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
  //? The pseudo handler not working properly whenever the property defined with `camelCase`, e.g. 'backgroundColor' need to be 'background-color'.
}
