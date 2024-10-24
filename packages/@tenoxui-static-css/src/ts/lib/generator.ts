import { escapeCSSSelector } from './converter'
import { Breakpoint } from '../types'

export class RulesGenerator {
  private readonly breakpoints: Breakpoint[]

  constructor(breakpoints) {
    this.breakpoints = breakpoints
  }

  isBreakpoint(prefix: string): boolean {
    return this.breakpoints.some((bp) => bp.name === prefix)
  }

  generateCSSRule(
    selector: string,
    property: string,
    value: string | null,
    prefix?: string
  ): string {
    const rule = value ? `${property}: ${value}` : property
    const escapedSelector = escapeCSSSelector(selector)

    if (!prefix) {
      return `.${escapedSelector} { ${rule}; }`
    }

    return this.isBreakpoint(prefix)
      ? `.${prefix}\\:${escapedSelector} { ${rule}; }`
      : `.${prefix}\\:${escapedSelector}:${prefix} { ${rule}; }`
  }
}
