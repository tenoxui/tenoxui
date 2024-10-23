import fs from 'node:fs'
import { glob } from 'glob'
import { Property, Config } from './types'
import { toKebabCase, escapeCSSSelector } from './lib/converter'
import { ParseClassName } from './lib/classNameParser'
import { FileParser } from './parser'

export class GenerateCSS {
  private readonly generatedCSS: Set<string>
  private readonly responsiveCSS: Map<string, Set<string>>
  private readonly config: Config
  private readonly classParser: ParseClassName

  constructor(config: Config) {
    this.validateConfig(config)
    this.config = config
    this.generatedCSS = new Set()
    this.responsiveCSS = new Map()
    this.classParser = new ParseClassName(this.config.property)
  }

  // Configuration Methods
  private validateConfig(config: Config): void {
    const requiredFields = ['input', 'output', 'property']
    requiredFields.forEach((field) => {
      if (!config[field]) {
        throw new Error(`Missing required configuration field: ${field}`)
      }
    })

    // Set defaults
    config.values = config.values || {}
    config.classes = config.classes || {}
    config.breakpoints = config.breakpoints || []
  }

  // Breakpoint Handling
  private isBreakpoint(prefix: string): boolean {
    return this.config.breakpoints.some((bp) => bp.name === prefix)
  }

  private generateMediaQuery(breakpoint: string): string {
    const bp = this.config.breakpoints.find((b) => b.name === breakpoint)
    if (!bp) return ''

    const conditions: string[] = []
    if (bp.min !== undefined) conditions.push(`(min-width: ${bp.min}px)`)
    if (bp.max !== undefined) conditions.push(`(max-width: ${bp.max}px)`)

    return conditions.length ? `@media screen and ${conditions.join(' and ')}` : ''
  }

  // CSS Rule Generation
  private generateCSSRule(
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

  private generateCSSRuleFromProperties(
    type: string,
    value: string,
    properties: Property,
    finalValue: string,
    prefix?: string
  ): string | null {
    if (Array.isArray(properties)) {
      // Map each property to the final value
      const rules = properties
        .map((prop) => `${toKebabCase(String(prop))}: ${finalValue}`)
        .join('; ')
      return this.generateCSSRule(`${type}-${value}`, rules, null, prefix)
    }

    if (type.startsWith('[') && type.endsWith(']')) {
      const items = type
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())

      const cssRules: string[] = []

      items.forEach((item) => {
        const attrProps = this.config.property[item]

        // If it's a CSS variable, generate the rule for it
        if (item.startsWith('--')) {
          cssRules.push(this.generateCSSRule(`[${item}]-${value}`, item, finalValue, prefix))
        } else if (attrProps) {
          // Handle attribute properties if defined in the config
          if (typeof attrProps === 'object' && 'property' in attrProps) {
            const propertyVal = attrProps.property
            if (Array.isArray(propertyVal)) {
              const propertyString = propertyVal.map((p) => toKebabCase(String(p))).join('; ')
              cssRules.push(
                this.generateCSSRule(
                  `[${item}]-${value}`,
                  propertyString,
                  attrProps.value || finalValue,
                  prefix
                )
              )
            } else if (propertyVal) {
              cssRules.push(
                this.generateCSSRule(
                  `[${item}]-${value}`,
                  toKebabCase(String(propertyVal)),
                  attrProps.value || finalValue,
                  prefix
                )
              )
            }
          } else {
            // Add individual property mappings for items in the list (like "color", "background")
            cssRules.push(
              this.generateCSSRule(
                `[${item}]-${value}`,
                toKebabCase(String(attrProps)),
                finalValue,
                prefix
              )
            )
          }
        }
      })

      // Add the rule for both color and background
      const properties = items.map((item) => `${toKebabCase(item)}: ${finalValue}`).join('; ')
      cssRules.push(
        this.generateCSSRule(`[${type.slice(1, -1)}]-${value}`, properties, null, prefix)
      )

      return cssRules.join('\n')
    }

    return typeof properties === 'string'
      ? this.generateCSSRule(`${type}-${value}`, toKebabCase(properties), finalValue, prefix)
      : null
  }

  private processFinalValue(value: string, unit?: string): string {
    if (this.config.values[value]) {
      return this.config.values[value]
    } else {
      if (value.startsWith('$')) {
        return `var(--${value.slice(1)})`
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        const solidValue = value.slice(1, -1).replace(/_/g, ' ')
        return solidValue.startsWith('--') ? `var(${solidValue})` : solidValue
      }

      return value + (unit || '')
    }
  }

  private processCustomValue(type: string, prefix?: string): string | null {
    const properties = this.config.property[type]

    if (properties && typeof properties === 'object' && 'property' in properties) {
      const propertyVal = properties.property
      const propValue = properties.value

      if (Array.isArray(propertyVal)) {
        const rules = propertyVal
          .map((prop) => `${toKebabCase(String(prop))}: ${propValue}`)
          .join('; ')
        return this.generateCSSRule(`${type}`, rules, null, prefix)
      }

      return propertyVal
        ? this.generateCSSRule(
            `${type}`,
            toKebabCase(String(propertyVal)),
            properties.value,
            prefix
          )
        : null
    }

    return null
  }

  private processCustomClass(prefix: string | undefined, className: string): string | null {
    const properties = Object.entries(this.config.classes)
      .filter(([, classObj]) => classObj.hasOwnProperty(className))
      .reduce(
        (acc, [propKey, classObj]) => {
          acc[toKebabCase(propKey)] = classObj[className]
          return acc
        },
        {} as Record<string, string>
      )

    if (Object.keys(properties).length > 0) {
      const rules = Object.entries(properties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')

      return this.generateCSSRule(className, rules, null, prefix)
    }

    return null
  }

  // CSS Rule Management
  private addCSSRule(rule: string, prefix?: string): void {
    if (prefix && this.isBreakpoint(prefix)) {
      if (!this.responsiveCSS.has(prefix)) {
        this.responsiveCSS.set(prefix, new Set())
      }
      this.responsiveCSS.get(prefix)!.add(rule)
    } else {
      this.generatedCSS.add(rule)
    }
  }

  // Class Parsing and Processing
  private parseClass(className: string): string | null {
    // Split prefix and type
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined

    // Try processing as custom value
    const customValueProperty = this.processCustomValue(getType, getPrefix)
    if (customValueProperty) {
      this.addCSSRule(customValueProperty, getPrefix)
      return customValueProperty
    }

    // Try processing as custom class
    const customCSSClass = this.processCustomClass(getPrefix, getType)
    if (customCSSClass) {
      this.addCSSRule(customCSSClass, getPrefix)
      return customCSSClass
    }

    // Parse using ClassNameParser

    const matcher = this.classParser.matchClass(className)
    if (!matcher) return null

    const [parsedPrefix, parsedType, parsedValue, unit = ''] = matcher
    const properties = this.config.property[parsedType]
    const finalValue = this.processFinalValue(parsedValue, unit)

    const cssRule = this.generateCSSRuleFromProperties(
      parsedType,
      parsedValue + unit,
      properties,
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
    classes.forEach((className) => this.parseClass(className))

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
      this.config.input.forEach((pattern) => {
        glob.sync(pattern).forEach((file) => {
          new FileParser().parse(file).forEach((className) => classNames.add(className))
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
