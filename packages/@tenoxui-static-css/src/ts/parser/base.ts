

export abstract class BaseParser {
  protected extractClassNames(content: string): Set<string> {
    const classNames = new Set<string>()
    
    // Common class extraction logic
    const classRegex = /class\s*=\s*["'`]([^"'`]+)["'`]/g
    let match
    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(className => classNames.add(className))
    }
    
    return classNames
  }

  abstract parse(content: string): string[]
}