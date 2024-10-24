import fs from 'node:fs'
import { glob } from 'glob'
import { Config } from './types'
import { toKebabCase } from './lib/converter'
import { ParseClassName } from './lib/classNameParser'
import { ProcessClass } from './lib/processClass'
import { RulesGenerator } from './lib/generator'
import { FileParser } from './parser'

type CliConfig = Partial<Config> & {
  input: string[]
  output: string
}

export class GenerateCSS {
  private readonly generatedCSS: Set<string>
  private readonly responsiveCSS: Map<string, Set<string>>
  private readonly config: CliConfig
  private readonly classParser: ParseClassName
  private readonly classProcessor: ProcessClass
  private readonly generator: RulesGenerator

  constructor(config: CliConfig) {
    this.validateConfig(config)
    this.config = config
    this.generatedCSS = new Set()
    this.responsiveCSS = new Map()
    this.classParser = new ParseClassName(this.config.property)
    this.generator = new RulesGenerator(this.config.breakpoints)
    this.classProcessor = new ProcessClass(
      this.config.property,
      this.config.values,
      this.config.classes,
      this.generator
    )
  }

  // Configuration Methods
  private validateConfig(config: Config): void {
    const requiredFields = ['input', 'output']
    requiredFields.forEach(field => {
      if (!config[field]) {
        throw new Error(`Missing required configuration field: ${field}`)
      }
    })

    // Set defaults
    config.property = config.property || {}
    config.values = config.values || {}
    config.classes = config.classes || {}
    config.breakpoints = config.breakpoints || []
  }

  private generateMediaQuery(breakpoint: string): string {
    const bp = this.config.breakpoints.find(b => b.name === breakpoint)
    if (!bp) return ''

    const conditions: string[] = []
    if (bp.min !== undefined) conditions.push(`(min-width: ${bp.min}px)`)
    if (bp.max !== undefined) conditions.push(`(max-width: ${bp.max}px)`)

    return conditions.length ? `@media screen and ${conditions.join(' and ')}` : ''
  }

  private generateCSSRuleFromProperties(
    type: string,
    value: string,
    properties: string,
    finalValue: string,
    prefix?: string
  ): string | null {
    if (Array.isArray(properties)) {
      const rules = properties.map(prop => `${toKebabCase(String(prop))}: ${finalValue}`).join('; ')
      return this.generator.generateCSSRule(`${type}-${value}`, rules, null, prefix)
    }

    if (type.startsWith('[') && type.endsWith(']')) {
      const items = type
        .slice(1, -1)
        .split(',')
        .map(item => item.trim())

      const properties = items
        .map(item => {
          const prop = this.config.property[item]

          if (Array.isArray(prop)) {
            return prop.map(p => `${toKebabCase(String(p))}: ${finalValue}`).join('; ')
          }

          const property = prop || item
          return `${toKebabCase(String(property))}: ${finalValue}`
        })
        .join('; ')

      return this.generator.generateCSSRule(
        `[${type.slice(1, -1)}]-${value}`,
        properties,
        null,
        prefix
      )
    }

    return typeof properties === 'string'
      ? this.generator.generateCSSRule(
          `${type}-${value}`,
          toKebabCase(properties),
          finalValue,
          prefix
        )
      : null
  }

  private addCSSRule(rule: string, prefix?: string): void {
    if (prefix && this.generator.isBreakpoint(prefix)) {
      if (!this.responsiveCSS.has(prefix)) {
        this.responsiveCSS.set(prefix, new Set())
      }
      this.responsiveCSS.get(prefix)!.add(rule)
    } else {
      this.generatedCSS.add(rule)
    }
  }

  private parseClass(className: string): string | null {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined

    const customValueProperty = this.classProcessor.processCustomValue(getType, getPrefix)

    if (customValueProperty) {
      this.addCSSRule(customValueProperty, getPrefix)
      return customValueProperty
    }

    const customCSSClass = this.classProcessor.processCustomClass(getPrefix, getType)
    if (customCSSClass) {
      this.addCSSRule(customCSSClass, getPrefix)
      return customCSSClass
    }

    const matcher = this.classParser.matchClass(className)
    if (!matcher) return null

    const [parsedPrefix, parsedType, parsedValue, unit = ''] = matcher
    const properties = this.config.property[parsedType]

    const finalValue = this.classProcessor.processFinalValue(parsedType, parsedValue, unit)

    const cssRule = this.generateCSSRuleFromProperties(
      parsedType,
      parsedValue + unit,
      properties as string,
      finalValue,
      parsedPrefix
    )

    if (cssRule) {
      this.addCSSRule(cssRule, parsedPrefix)
    }

    return cssRule
  }

  // Public API Methods
  public create(classNames: string[] | string): string {
    const classes = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
    classes.forEach(className => this.parseClass(className))

    let cssContent = Array.from(this.generatedCSS).join('\n')

    this.responsiveCSS.forEach((rules, breakpoint) => {
      const mediaQuery = this.generateMediaQuery(breakpoint)
      cssContent += `\n${mediaQuery} {\n  ${Array.from(rules).join('\n  ')}\n}`
    })

    return cssContent
  }

  public generateFromFiles(): string {
    const classNames = new Set<string>()

    if (this.config.input) {
      this.config.input.forEach(pattern => {
        glob.sync(pattern).forEach(file => {
          new FileParser().parse(file).forEach(className => classNames.add(className))
        })
      })

      const cssContent = this.create(Array.from(classNames))

      try {
        fs.writeFileSync(this.config.output, cssContent)
        console.log(`CSS file generated at: ${this.config.output}`)
      } catch (error) {
        console.error(`Error writing CSS file ${this.config.output}:`, error)
      }

      return cssContent
    }

    return ''
  }
}

export * from './lib/converter'
