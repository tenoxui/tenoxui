import { BaseParser } from './base'
import { ClassNameExtractor } from './extractor'

interface ParserPattern {
  regex: RegExp
  extractMethod: (match: string) => string[]
}

interface MethodCallPattern {
  regex: RegExp
  method: string
}

export class JSLikeParser extends BaseParser {
  private readonly extractor: ClassNameExtractor
  private readonly patterns: ParserPattern[]
  private readonly methodCallPatterns: MethodCallPattern[]

  constructor() {
    super()
    this.extractor = new ClassNameExtractor()
    this.patterns = [
      {
        // Regular className pattern
        regex: /className\s*=\s*{?["'`]([^"'`]+)["'`]?}?/g,
        extractMethod: (match) => this.extractor.fromAssignment(match)
      },
      {
        // Template literal pattern
        regex: /className\s*=\s*{?`([^`]+)`}?/g,
        extractMethod: (match) => this.extractor.fromTemplateLiteral(match)
      },
      {
        // Conditional className pattern
        regex: /className\s*=\s*{([^}]+)}/g,
        extractMethod: (match) => this.extractor.fromConditional(match)
      },
      {
        // Assignment pattern
        regex: /\.className\s*=\s*([^;]+)/g,
        extractMethod: (match) => this.extractor.fromAssignment(match)
      }
    ]

    this.methodCallPatterns = [
      {
        regex: /classList\.add\(([^)]+)\)/g,
        method: 'add'
      },
      {
        regex: /classList\.toggle\(([^)]+)\)/g,
        method: 'toggle'
      },
      {
        regex: /setAttribute\(\s*["']class["']\s*,\s*([^)]+)\)/g,
        method: 'setAttribute'
      }
    ]
  }

  static readonly Patterns = {
    CLASSNAME: /className\s*=\s*{?["'`]([^"'`]+)["'`]?}?/g,
    TEMPLATE_LITERAL: /className\s*=\s*{?`([^`]+)`}?/g,
    CONDITIONAL: /className\s*=\s*{([^}]+)}/g,
    ASSIGNMENT: /\.className\s*=\s*([^;]+)/g,
    CLASS_LIST_ADD: /classList\.add\(([^)]+)\)/g,
    CLASS_LIST_TOGGLE: /classList\.toggle\(([^)]+)\)/g,
    SET_ATTRIBUTE: /setAttribute\(\s*["']class["']\s*,\s*([^)]+)\)/g
  }

  private extractMatches(content: string, regex: RegExp, callback: (match: string) => void): void {
    let match: RegExpExecArray | null
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) {
        callback(match[1])
      }
    }
  }

  private extractMethodCalls(content: string, classNames: Set<string>): void {
    this.methodCallPatterns.forEach(({ regex, method }) => {
      this.extractMatches(content, regex, (match) => {
        this.extractor.fromMethodCall(match).forEach((className) => classNames.add(className))
      })
    })
  }

  parse(content: string): string[] {
    const classNames = new Set<string>()

    const contentWithoutComments = content
    // .replace(/\/\/.*?$/gm, '')
    // .replace(/\/\*[\s\S]*?\*\//g, '')

    this.patterns.forEach((pattern) => {
      this.extractMatches(contentWithoutComments, pattern.regex, (match) => {
        pattern.extractMethod(match).forEach((className) => classNames.add(className))
      })
    })

    this.extractMethodCalls(contentWithoutComments, classNames)

    return Array.from(classNames)
  }
}
