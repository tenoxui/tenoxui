import { Property } from '../types'

export class ParseClassName {
  private readonly property: Property

  constructor(property: Property) {
    this.property = property
  }

  private getTypePrefixes(): string {
    return Object.keys(this.property)
      .sort((a, b) => b.length - a.length)
      .join('|')
  }

  private generateClassNameRegEx(): RegExp {
    const typePrefixes = this.getTypePrefixes()

    return new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )
  }

  public matchClass(
    className: string
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
    const classNameRegEx: RegExp = this.generateClassNameRegEx()

    const match = className.match(classNameRegEx)

    if (!match) return null

    // added new variables, secValue and secUnit for custom value property (e.g. p-2rem/10px)

    const [, prefix, type, value, unit, secValue, secUnit] = match
    return [prefix, type, value, unit, secValue, secUnit]
  }
}
