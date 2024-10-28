import { Property } from './types'

function getTypePrefixes(styleAttribute: Property): string {
  return Object.keys(styleAttribute)
    .sort((a, b) => b.length - a.length)
    .join('|')
}

function generateClassNameRegEx(styleAttribute: Property): RegExp {
  const typePrefixes = getTypePrefixes(styleAttribute)

  return new RegExp(
    `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
  )
}

export function parseClassName(
  className: string,
  styleAttribute: Property
):
  | [
      string | undefined,
      string,
      string | undefined,
      string | undefined,
      string | undefined,
      string | undefined
    ]
  | null {
  const classNameRegEx: RegExp = generateClassNameRegEx(styleAttribute)

  const match = className.match(classNameRegEx)

  if (!match) return null

  // added new variables, secValue and secUnit for custom value property (e.g. p-2rem/10px)

  const [, prefix, type, value, unit, secValue, secUnit] = match
  return [prefix, type, value, unit, secValue, secUnit]
}
