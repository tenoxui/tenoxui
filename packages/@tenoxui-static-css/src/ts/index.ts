import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { parse } from 'node-html-parser'
import { toKebabCase, escapeCSSSelector } from './utils/converter'
import { parseFile } from './lib/fileParser'
import {
  extractClassNames,
  extractClassNamesFromTemplateLiteral,
  extractClassNamesFromConditional,
  extractClassNamesFromMethodCall,
  extractClassNamesFromAssignment
} from './utils/extractor'
import { ParseClassName } from './lib/classNameParser'

export type CSSProperty = keyof CSSStyleDeclaration
export type CSSVariable = `--${string}`
export type CSSPropertyOrVariable = CSSProperty | CSSVariable
export type GetCSSProperty = CSSPropertyOrVariable | CSSPropertyOrVariable[]
export type Property = {
  [type: string]:
    | GetCSSProperty
    | {
        property?: GetCSSProperty
        value?: string
      }
}
export type Breakpoint = {
  name: string
  min?: number
  max?: number
}
export type DefinedValue = {
  [type: string]:
    | {
        [value: string]: string
      }
    | string
}
export type Classes = {
  [property in CSSPropertyOrVariable]?: {
    [className: string]: string
  }
}

interface Config {
  input: string[]
  output: string
  property: Property
  values?: DefinedValue
  classes?: Classes
}

export class GenerateCSS {
  private readonly generatedCSS
  private readonly responsiveCSS
  private readonly config: Config

  constructor(config: Config) {
    this.validateConfig(config)
    this.config = config
    this.generatedCSS = new Set()
    this.responsiveCSS = new Map()
  }

  validateConfig(config) {
    const requiredFields = ['input', 'output', 'property']
    requiredFields.forEach(field => {
      if (!config[field]) {
        console.error(`Missing required configuration field: ${field}`)
      }
    })

    config.values = config.values || {}
    config.classes = config.classes || {}
    config.breakpoints = config.breakpoints || []
  }

  isBreakpoint(prefix) {
    return this.config.breakpoints.some(bp => bp.name === prefix)
  }

  generateMediaQuery(breakpoint) {
    const bp = this.config.breakpoints.find(b => b.name === breakpoint)

    if (!bp) return ''

    let query = '@media screen and'

    if (bp.min !== undefined) query += ` (min-width: ${bp.min}px)`
    if (bp.min !== undefined && bp.max !== undefined) query += ' and'
    if (bp.max !== undefined) query += ` (max-width: ${bp.max}px)`

    return query
  }

  generateCSSRule(selector, property, value, prefix) {
    const rule = value ? `${property}: ${value}` : property

    const escapedSelector = escapeCSSSelector(selector)

    if (prefix) {
      if (this.isBreakpoint(prefix)) {
        // For breakpoint prefixes, don't add the prefix at the end
        return `.${prefix}\\:${escapedSelector} { ${rule}; }`
      } else {
        // For other prefixes (like hover, focus), keep the original behavior
        return `.${prefix}\\:${escapedSelector}:${prefix} { ${rule}; }`
      }
    } else {
      return `.${escapedSelector} { ${rule}; }`
    }
  }

  generateCSSRuleFromProperties(type, value, properties, finalValue, prefix) {
    if (Array.isArray(properties)) {
      const rules = properties.map(prop => `${toKebabCase(prop)}: ${finalValue}`).join('; ')

      return this.generateCSSRule(`${type}-${value}`, rules, null, prefix)
    }

    if (type.startsWith('[--') && type.endsWith(']')) {
      const variable = type.slice(1, -1).replace(/\\_/g, ' ')
      return this.generateCSSRule(`[${variable}]-${value}`, variable, finalValue, prefix)
    }
    if (typeof properties === 'string') {
      return this.generateCSSRule(`${type}-${value}`, toKebabCase(properties), finalValue, prefix)
    }
    return null
  }

  processCustomValue(type, prefix) {
    const properties = this.config.property[type]

    if (typeof properties === 'object' && properties !== null) {
      if (properties.property && properties.value) {
        const propValue = properties.value

        if (Array.isArray(properties.property)) {
          const rules = properties.property
            .map(prop => `${toKebabCase(prop)}: ${propValue}`)
            .join('; ')

          return this.generateCSSRule(`${type}`, rules, null, prefix)
        }
        return this.generateCSSRule(
          `${type}`,
          toKebabCase(properties.property),
          properties.value,
          prefix
        )
      }
      return this.generateCSSRule(`${type}`, properties, properties.value, prefix)
    }
  }

  processCustomClass(prefix, className) {
    const properties = Object.entries(this.config.classes)
      .filter(([, classObj]) => classObj.hasOwnProperty(className))
      .reduce((acc, [propKey, classObj]) => {
        acc[toKebabCase(propKey)] = classObj[className]
        return acc
      }, {})

    if (Object.keys(properties).length > 0) {
      const rules = Object.entries(properties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')
      return this.generateCSSRule(className, rules, null, prefix)
    }

    return null
  }

  processFinalValue(value, unit) {
    const customValue = this.config.values[value]
    if (customValue) return customValue
    if (value.startsWith('$')) {
      return `var(--${value.slice(1)})`
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      const solidValue = value.slice(1, -1).replace(/_/g, ' ')
      return solidValue.startsWith('--') ? `var(${solidValue})` : solidValue
    }
    return value + (unit || '')
  }

  addCSSRule(rule, prefix) {
    if (this.isBreakpoint(prefix)) {
      if (!this.responsiveCSS.has(prefix)) {
        this.responsiveCSS.set(prefix, new Set())
      }
      this.responsiveCSS.get(prefix).add(rule)
    } else {
      this.generatedCSS.add(rule)
    }
  }

  parseClass(className) {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined

    const customValueProperty = this.processCustomValue(getType, getPrefix)

    if (customValueProperty) {
      this.addCSSRule(customValueProperty, getPrefix)
      return customValueProperty
    }

    const customCSSClass = this.processCustomClass(getPrefix, getType)

    if (customCSSClass) {
      this.addCSSRule(customCSSClass, getPrefix)
      return customCSSClass
    }

    const matcherClass = new ParseClassName(this.config.property)

    const matcher = matcherClass.matchClass(className)
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

  create(classNames) {
    ;(Array.isArray(classNames) ? classNames : classNames.split(/\s+/)).forEach(className =>
      this.parseClass(className)
    )

    let cssContent = Array.from(this.generatedCSS).join('\n')

    this.responsiveCSS.forEach((rules, breakpoint) => {
      const mediaQuery = this.generateMediaQuery(breakpoint)
      cssContent += `\n${mediaQuery} {\n  ${Array.from(rules).join('\n  ')}\n}`
    })

    return cssContent
  }

  generateFromFiles() {
    const classNames = new Set()

    if (this.config.input) {
      this.config.input.forEach(pattern => {
        glob.sync(pattern).forEach(file => {
          parseFile(file).forEach(className => classNames.add(className))
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
  }
}

export { toKebabCase, escapeCSSSelector } from './utils/converter'
