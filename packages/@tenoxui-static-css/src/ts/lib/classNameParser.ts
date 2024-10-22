export class ParseClassName {
  private readonly property: string

  constructor(property) {
    this.property = property
  }

  private getTypePrefixes() {
    // Fixed
    // Maybe there some type or shorthand with same prefix, like `w` with `w-mx`, or `p` with `p-x`.
    // it will lead to mismatching type.
    // example: `w-mx-1000px`, it will divided into `w` as type, `mx-1000` as value, and `px` as unit.
    // It needs to divide `w-mx` as one type and `w` is another type as well

    return Object.keys(this.property)
      .sort((a, b) => b.length - a.length)
      .join('|')
  }

  private generateClassNameRegEx() {
    const typePrefixes = this.getTypePrefixes()

    return new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[--[a-zA-Z0-9_-]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)`
    )
  }

  public matchClass(className) {
    const classNameRegEx = this.generateClassNameRegEx()

    const match = className.match(classNameRegEx)

    if (!match) return null

    // e.g. _ `hover:p-20px` _ it will divided as :
    // prefix: hover
    // type: p (will matches with the key's name of Property)
    // value: 20
    // unit: px

    const [, prefix, type, value, unit] = match

    return [prefix, type, value, unit]
  }
}
