import { generateRuleBlock, processVariantSelector } from '../utils/transformerUtils'
import { transform } from './transformer'
import type { ProcessResult } from '../types'

interface Aliases {
  [aliasName: string]: string | string[]
}

interface ApplyRules {
  [selector: string]: string | string[]
}

interface ObjectRulesInput {
  [selector: string]: string | string[]
}

interface SanitizedResult {
  classNames: string[]
  aliases: string[]
}

interface RendererConfig {
  main?: any
  aliases?: Aliases
  apply?: ApplyRules
}

type RenderInput = string | string[] | ObjectRulesInput

export class Renderer {
  private main: any
  private aliases: Aliases
  private apply: ApplyRules

  constructor({ main = null, aliases = {}, apply = {} }: RendererConfig = {}) {
    this.main = main
    this.aliases = aliases
    this.apply = apply
  }

  public processClassesToRules(selector: string, classNames: string | string[]): string[] {
    if (!this.main) {
      console.warn('Main processor not provided')
      return []
    }

    const results: string[] = []
    const baseRulesMap = new Map<string, string[]>()

    try {
      const dataRules = this.main.process(classNames) as ProcessResult[]

      dataRules.forEach((rule) => {
        if (rule.use === 'moxie' && rule.rules) {
          const rules = generateRuleBlock(rule.rules, rule.isImportant || false, true)

          if (rule.variant) {
            const variantRule = processVariantSelector(rule.variant, selector, `{ ${rules} }`)
            if (variantRule) results.push(variantRule)
          } else {
            if (!baseRulesMap.has(selector)) {
              baseRulesMap.set(selector, [])
            }
            if (rules) baseRulesMap.get(selector)!.push(rules)
          }
        }
      })

      baseRulesMap.forEach((rulesList, selectorKey) => {
        if (rulesList.length > 0) {
          const combinedRules = rulesList.join('; ')
          results.unshift(`${selectorKey} { ${combinedRules} }`)
        }
      })
    } catch (error) {
      console.error(`Error processing classes for selector '${selector}':`, error)
    }

    return results
  }

  public processObjectRules(data: ObjectRulesInput): string[] {
    const allResults: string[] = []

    Object.entries(data).forEach(([selector, classNames]) => {
      if (classNames) {
        const results = this.processClassesToRules(selector, classNames)
        allResults.push(...results)
      }
    })

    return allResults
  }

  public processAlias(aliasName: string): string[] {
    const aliasClasses = this.aliases[aliasName]

    if (!aliasClasses) {
      console.warn(`Alias '${aliasName}' not found`)
      return []
    }

    const classSelector = `.${aliasName}`
    return this.processClassesToRules(classSelector, aliasClasses)
  }

  private sanitize(classNames: string | string[]): SanitizedResult | null {
    let cns: string[]

    if (typeof classNames === 'string') {
      cns = classNames
        .split(/\s+/)
        .map((cn) => cn.trim())
        .filter(Boolean)
    } else if (Array.isArray(classNames)) {
      cns = classNames.filter(Boolean)
    } else {
      return null
    }

    if (cns.length === 0) return null

    const results: SanitizedResult = {
      classNames: [],
      aliases: []
    }

    cns.forEach((cn) => {
      if (this.aliases[cn]) {
        results.aliases.push(cn)
      } else {
        results.classNames.push(cn)
      }
    })

    return results
  }

  public addAlias(name: string, classes: string | string[]): this {
    this.aliases[name] = classes
    return this
  }

  public removeAlias(name: string): this {
    if (this.aliases[name]) {
      delete this.aliases[name]
    }
    return this
  }

  private processStringOrArray(input: string | string[]): string[] {
    const results: string[] = []

    const sanitized = this.sanitize(input)
    if (!sanitized) return results

    const { classNames, aliases } = sanitized

    // alias class names should rendered first
    if (aliases.length > 0) {
      aliases.forEach((aliasName) => {
        const aliasRules = this.processAlias(aliasName)
        if (aliasRules.length > 0) {
          results.push(...aliasRules)
        }
      })
    }

    if (classNames.length > 0 && this.main) {
      try {
        const transformResult = transform(this.main.process(classNames))
        if (transformResult.rules && transformResult.rules.length > 0) {
          results.push(...transformResult.rules)
        }
      } catch (error) {
        console.error('Error processing class names:', error)
      }
    }

    return results
  }

  public render(...args: RenderInput[]): string {
    const results: string[] = []

    args.forEach((arg) => {
      try {
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          const objectRules = this.processObjectRules(arg)
          if (objectRules.length > 0) {
            results.push(...objectRules)
          }
        } else if (typeof arg === 'string' || Array.isArray(arg)) {
          const stringArrayRules = this.processStringOrArray(arg)
          if (stringArrayRules.length > 0) {
            results.push(...stringArrayRules)
          }
        }
      } catch (error) {
        console.error('Error processing render argument:', error, arg)
      }
    })

    const applyRules =
      Object.keys(this.apply).length > 0
        ? this.processObjectRules(this.apply).join('\n') + '\n'
        : ''
    const mainRules = results.length > 0 ? results.join('\n') : ''

    return applyRules + mainRules
  }

  public clear(): void {
    this.aliases = {}
    this.apply = {}
  }
}
