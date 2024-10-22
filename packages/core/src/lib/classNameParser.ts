import { Property } from './types'

export class Parser {
  private styleAttribute: Property
  constructor(styleAttribute: Property) {
    this.styleAttribute = styleAttribute
  }

  private getTypePrefixes(): string {
    return Object.keys(this.styleAttribute)
      .sort((a, b) => b.length - a.length)
      .join('|')
  }

  private generateClassNameRegEx(): RegExp {
    const typePrefixes = this.getTypePrefixes()

    return new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )
  }

  public parseClassName(
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

    // e.g. `hover:p-20px/30%` will be divided as:
    // prefix: hover
    // type: p (will match with the key's name of Property)
    // value: 20
    // unit: px
    // secValue: 30
    // secUnit: %

    const [, prefix, type, value, unit, secValue, secUnit] = match
    // console.log(secValue, secUnit)
    return [prefix, type, value, unit, secValue, secUnit]
  }
}
