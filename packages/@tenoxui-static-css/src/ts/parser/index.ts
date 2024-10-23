import fs from 'node:fs'
import path from 'node:path'
import { BaseParser } from './base'
import { HTMLParser } from './HTMLParser'
import { JSLikeParser } from './JSLikeParser'
import { VueParser } from './VueParser'
import { SvelteParser } from './SvelteParser'

export class FileParser {
  private readonly parsers: Map<string, BaseParser>

  constructor() {
    const jsLikeParser = new JSLikeParser()
    this.parsers = new Map([
      ['.html', new HTMLParser()],
      ['.jsx', jsLikeParser],
      ['.tsx', jsLikeParser],
      ['.js', jsLikeParser],
      ['.ts', jsLikeParser],
      ['.vue', new VueParser()],
      ['.svelte', new SvelteParser()]
    ])
  }

  parse(filePath: string): string[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const extension = path.extname(filePath)
      const parser = this.parsers.get(extension)

      if (parser) {
        return parser.parse(content)
      } else {
        console.warn(`Unsupported file type: ${extension}`)
        return []
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return []
    }
  }
}
