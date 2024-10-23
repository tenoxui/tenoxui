import { BaseParser } from './base'
import { JSLikeParser } from './JSLikeParser'

export class VueParser extends BaseParser {
  private jsParser: JSLikeParser

  constructor() {
    super()
    this.jsParser = new JSLikeParser()
  }

  parse(content: string): string[] {
    const classNames = new Set<string>()

    // Template section
    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/)
    if (templateMatch) {
      const templateContent = templateMatch[1]
      this.extractClassNames(templateContent).forEach((className) => classNames.add(className))
    }

    // Script section
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      this.jsParser.parse(scriptContent).forEach((className) => classNames.add(className))
    }

    return Array.from(classNames)
  }
}
