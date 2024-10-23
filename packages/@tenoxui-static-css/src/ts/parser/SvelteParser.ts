// src/parsers/SvelteParser.ts
import { BaseParser } from './base'
import { JSLikeParser } from './JSLikeParser'

export class SvelteParser extends BaseParser {
  private jsParser: JSLikeParser

  constructor() {
    super()
    this.jsParser = new JSLikeParser()
  }


private extractSvelteClassDirectives(content: string): string[] {
    const classNames = new Set<string>()

    // class:name={condition}
    const classDirectiveRegex = /class:(\S+)\s*=\s*{[^}]+}/g
    let match

    while ((match = classDirectiveRegex.exec(content)) !== null) {
      classNames.add(match[1])
    }

    // class:name
    const shorthandDirectiveRegex = /class:(\S+)(?=[\s/>])/g
    while ((match = shorthandDirectiveRegex.exec(content)) !== null) {
      classNames.add(match[1])
    }

    return Array.from(classNames)
  }

  private extractScriptContent(content: string): string | null {
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    return scriptMatch ? scriptMatch[1] : null
  }

  parse(content: string): string[] {
    const classNames = new Set<string>()

    // Regular class attributes (inherited from BaseParser)
    this.extractClassNames(content).forEach(className => classNames.add(className))

    // Svelte class directives
    this.extractSvelteClassDirectives(content).forEach(className => classNames.add(className))

    // Script section parsing
    const scriptContent = this.extractScriptContent(content)
    if (scriptContent) {
      this.jsParser.parse(scriptContent).forEach(className => classNames.add(className))
    }

    return Array.from(classNames)
  }

  
}
