import { Property } from './types'

export class Parser {
  private styleAttribute: Property
  constructor(styleAttribute: Property) {
    this.styleAttribute = styleAttribute
  }

  private getTypePrefixes(): string {
    // Fixed
    // Maybe there some type or shorthand with same prefix, like `w` with `w-mx`, or `p` with `p-x`.
    // it will lead to mismatching type.
    // example: `w-mx-1000px`, it will divided into `w` as type, `mx-1000` as value, and `px` as unit.
    // It needs to divide `w-mx` as one type and `w` is another type as well

    return Object.keys(this.styleAttribute)
      .sort((a, b) => b.length - a.length)
      .join('|')
  }

  private generateClassNameRegEx(): RegExp {
    const typePrefixes = this.getTypePrefixes()

    return new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[--[a-zA-Z0-9_-]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)`
    )
  }

  public parseClassName(
    className: string
  ): [string | undefined, string, string | undefined, string | undefined] | null {
    const classNameRegEx: RegExp = this.generateClassNameRegEx()

    const match = className.match(classNameRegEx)
    if (!match) return null

    const [, prefix, type, value, unit] = match

    return [prefix, type, value, unit]
  }
}
