export interface ExtractorOptions {
  trimWhitespace?: boolean
  ignoreEmpty?: boolean
  removeQuotes?: boolean
}

export class ClassNameExtractor {
  private readonly options: ExtractorOptions

  constructor(options: ExtractorOptions = {}) {
    this.options = {
      trimWhitespace: true,
      ignoreEmpty: true,
      removeQuotes: true,
      ...options
    }
  }

  private cleanClassName(className: string): string {
    let cleaned = className
    if (this.options.trimWhitespace) {
      cleaned = cleaned.trim()
    }
    if (this.options.removeQuotes) {
      cleaned = this.removeQuotes(cleaned)
    }
    return cleaned
  }

  private removeQuotes(str: string): string {
    return str.replace(/^['"`]|['"`]$/g, '')
  }

  private splitClassNames(content: string): string[] {
    return content
      .split(/\s+/)
      .filter((className) => !this.options.ignoreEmpty || className.length > 0)
  }

  private addToSet(classNames: Set<string>, content: string | null | undefined): void {
    if (!content) return

    const cleaned = this.cleanClassName(content)
    if (!cleaned) return

    this.splitClassNames(cleaned).forEach((className) => classNames.add(className))
  }

  fromDOM(root: Element): string[] {
    const classNames = new Set<string>()

    root.querySelectorAll('*').forEach((element) => {
      const classAttr = element.getAttribute('class')
      this.addToSet(classNames, classAttr)
    })

    return Array.from(classNames)
  }

  fromMethodCall(content: string): string[] {
    const classNames = new Set<string>()

    const parts = content.split(',')
    parts.forEach((part) => {
      const cleaned = part.trim()
      if (cleaned.startsWith("'") || cleaned.startsWith('"')) {
        this.addToSet(classNames, cleaned)
      }
    })

    return Array.from(classNames)
  }

  fromAssignment(content: string): string[] {
    const classNames = new Set<string>()
    const quotedContent = this.extractQuotedContent(content)

    if (quotedContent) {
      this.addToSet(classNames, quotedContent)
    }

    return Array.from(classNames)
  }

  fromTemplateLiteral(content: string): string[] {
    const classNames = new Set<string>()

    // Split by template expressions ${...}
    const parts = content.split(/\${[^}]+}/)
    parts.forEach((part) => {
      this.addToSet(classNames, part)
    })

    return Array.from(classNames)
  }

  fromConditional(content: string): string[] {
    const classNames = new Set<string>()

    // Split by ternary operators
    const parts = content.split(/[?:]/)
    parts.forEach((part) => {
      const quotedContent = this.extractQuotedContent(part)
      if (quotedContent) {
        this.addToSet(classNames, quotedContent)
      }
    })

    return Array.from(classNames)
  }

  private extractQuotedContent(content: string): string | null {
    const match = content.match(/["'`]([^"'`]+)["'`]/)
    return match ? match[1] : null
  }
}
