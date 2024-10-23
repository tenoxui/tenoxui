
import { BaseParser } from './base'

export class HTMLParser extends BaseParser {
  parse(content: string): string[] {
    // const root = parse(content)
    return Array.from(this.extractClassNames(content))
  }
}
