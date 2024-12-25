import type {
  Property,
  Values,
  Aliases,
  Classes,
  Breakpoint,
  // GetCSSProperty,
  CSSPropertyOrVariable
} from '@tenoxui/types'

export interface TenoxUIParams {
  property: Property
  values: Values
  classes: Classes
  aliases: Aliases
  breakpoints: Breakpoint[]
  reserveClass: string[]
}

type ProcessedStyle = {
  className: string
  cssRules: string | string[]
  value: string | null
  prefix?: string
}

type MediaQueryRule = {
  mediaKey: string
  ruleSet: string
}

export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoint[]
  private reserveClass: string[]
  private styleMap: Map<string, Set<string>>

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    reserveClass = []
  }: Partial<TenoxUIParams> = {}) {
    this.property = property
    this.values = values
    this.classes = classes
    this.aliases = aliases
    this.breakpoints = breakpoints
    this.reserveClass = reserveClass
    this.styleMap = new Map()

    if (this.reserveClass.length > 0) {
      this.processReservedClasses()
    }
  }

  processReservedClasses() {
    this.reserveClass.forEach(className => {
      this.processClassNames(className)
    })
  }

  toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase())
  }

  toKebabCase(str: string): string {
    const prefixes = ['webkit', 'moz', 'ms', 'o']
    for (const prefix of prefixes) {
      if (str.toLowerCase().startsWith(prefix)) {
        return (
          `-${prefix}` +
          str.slice(prefix.length).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
        )
      }
    }

    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  }

  escapeCSSSelector(str: string): string {
    return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, '\\$1')
  }

  private generateClassNameRegEx(): RegExp {
    const typePrefixes = Object.keys(this.property)
      .sort((a, b) => b.length - a.length)
      .join('|')

    return new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )
  }

  private parseClassName(
    className: string
  ):
    | [
        prefix: string | undefined,
        type: string,
        value: string | undefined,
        unit: string | undefined,
        secValue: string | undefined,
        secUnit: string | undefined
      ]
    | null {
    const classNameRegEx = this.generateClassNameRegEx()
    const match = className.match(classNameRegEx)
    if (!match) return null

    const [, prefix, type, value, unit, secValue, secUnit] = match
    return [prefix, type, value, unit, secValue, secUnit]
  }

  private processValue(type: string, value?: string, unit?: string): string {
    if (!value) return ''

    const valueRegistry = this.values[value]

    const replaceWithValueRegistry = (text: string): string => {
      return text.replace(/\{([^}]+)\}/g, (match, key) => {
        const val = this.values[key]
        return typeof val === 'string' ? val : match
      })
    }

    if (valueRegistry) {
      return typeof valueRegistry === 'string' ? valueRegistry : valueRegistry[type] || ''
    } else if (value.startsWith('$')) {
      return `var(--${value.slice(1)})`
    } else if (value.startsWith('[') && value.endsWith(']')) {
      const cleanValue = value.slice(1, -1).replace(/_/g, ' ')

      if (cleanValue.includes('{')) {
        return replaceWithValueRegistry(cleanValue)
      }
      return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
    }

    return value + (unit || '')
  }

  private processShorthand(
    type: string,
    value: string,
    unit: string = '',
    prefix?: string,
    secondValue?: string,
    secondUnit?: string
  ): ProcessedStyle | null {
    const properties = this.property[type]
    const finalValue = this.processValue(type, value, unit)

    if (type.startsWith('[') && type.endsWith(']')) {
      const items = type
        .slice(1, -1)
        .split(',')
        .map(item => item.trim())

      const cssRules = items
        .map(item => {
          const prop = this.property[item] || item
          const finalProperty =
            typeof prop === 'string' && prop.startsWith('--')
              ? String(prop)
              : this.toKebabCase(String(prop))
          return `${finalProperty}: ${finalValue}`
        })
        .join('; ')

      return {
        className: `${this.escapeCSSSelector(`[${type.slice(1, -1)}]-${value}${unit}`)}`,
        cssRules,
        value: null,
        prefix
      }
    }

    if (properties) {
      if (typeof properties === 'object' && 'property' in properties && 'value' in properties) {
        const property = properties.property
        const template = properties.value
        const processedValue = template
          ? template.replace(/\{0}/g, finalValue).replace(/\{1}/g, secondValue || '')
          : finalValue

        return {
          className: `${type}-${value}${unit}`,
          cssRules: Array.isArray(property)
            ? (property as string[])
            : (this.toKebabCase(String(property)) as string),
          value: processedValue,
          prefix
        }
      }
      // if (Array.isArray(properties)) console.log(properties)

      return {
        className: `${type}-${value}${unit}`,
        cssRules: Array.isArray(properties)
          ? (properties as string[])
          : (this.toKebabCase(String(properties)) as string),
        value: finalValue,
        prefix
      }
    }

    return null
  }

  private getParentClass(className: string): CSSPropertyOrVariable[] {
    return Object.keys(this.classes).filter(cssProperty =>
      Object.prototype.hasOwnProperty.call(
        this.classes[cssProperty as CSSPropertyOrVariable],
        className
      )
    ) as CSSPropertyOrVariable[]
  }

  private processCustomClass(prefix: string | undefined, className: string): ProcessedStyle | null {
    const properties = this.getParentClass(className)
    if (properties.length > 0) {
      const rules = properties
        .map(prop => {
          const classObj = this.classes[prop]
          return classObj ? `${this.toKebabCase(String(prop))}: ${classObj[className]}` : ''
        })
        .filter(Boolean)
        .join('; ')

      return {
        className: this.escapeCSSSelector(className),
        cssRules: rules,
        value: null,
        prefix
      }
    }

    return null
  }

  private addStyle(
    className: string,
    cssRules: string | string[],
    value?: string | null,
    prefix?: string | null
  ): void {
    const key = prefix ? `${prefix}\\:${className}:${prefix}` : className
    if (!this.styleMap.has(key)) {
      this.styleMap.set(key, new Set())
    }

    const styleSet = this.styleMap.get(key)!

    if (Array.isArray(cssRules)) {
      const combinedRule = cssRules
        .map((prop: string) =>
          value ? `${this.toKebabCase(prop)}: ${value}` : this.toKebabCase(prop)
        )
        .join('; ')
      styleSet.add(combinedRule)
    } else {
      styleSet.add(value ? `${cssRules}: ${value}` : cssRules)
    }
  }

  private processAlias(className: string): ProcessedStyle | null {
    const alias = this.aliases[className]
    if (!alias) return null

    const aliasClasses = alias.split(' ')
    const combinedRules: string[] = []

    aliasClasses.forEach(aliasClass => {
      const parsed = this.parseClassName(aliasClass)
      if (!parsed) return

      const [prefix, type, value, unit, secValue, secUnit] = parsed
      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

      if (result) {
        if (Array.isArray(result.cssRules)) {
          result.cssRules.forEach(rule => {
            combinedRules.push(`${this.toKebabCase(rule)}: ${result.value}`)
          })
        } else {
          combinedRules.push(`${result.cssRules}: ${result.value}`)
        }
      }
    })

    return {
      className,
      cssRules: combinedRules.join('; '),
      value: null,
      prefix: undefined
    }
  }

  private generateMediaQuery(
    breakpoint: Breakpoint,
    className: string,
    rules: string
  ): MediaQueryRule {
    const { name } = breakpoint
    return {
      mediaKey: `@media-${name}`,
      ruleSet: `.${name}\\:${className} { ${rules} }`
    }
  }

  public processClassNames(classNames: string): void {
    classNames.split(/\s+/).forEach(className => {
      if (!className) return

      const aliasResult = this.processAlias(className)
      if (aliasResult) {
        const { className: aliasClassName, cssRules } = aliasResult
        this.addStyle(aliasClassName, cssRules, null, undefined)
        return
      }

      const [rprefix, rtype] = className.split(':')
      const getType = rtype || rprefix
      const getPrefix = rtype ? rprefix : undefined

      const breakpoint = this.breakpoints.find(bp => bp.name === getPrefix)

      const shouldClasses = this.processCustomClass(getPrefix, getType)

      if (shouldClasses) {
        const { className, cssRules, prefix } = shouldClasses

        if (breakpoint) {
          const { mediaKey, ruleSet } = this.generateMediaQuery(
            breakpoint,
            className,
            cssRules as string
          )
          this.addStyle(mediaKey, ruleSet, null, null)
        } else {
          this.addStyle(className, cssRules, null, prefix)
        }
        return
      }

      const parsed = this.parseClassName(className)
      if (!parsed) return

      const [prefix, type, value, unit, secValue, secUnit] = parsed
      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

      if (result) {
        const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result

        if (breakpoint) {
          const rules = Array.isArray(cssRules)
            ? cssRules.map(rule => `${this.toKebabCase(rule)}: ${ruleValue}`).join('; ')
            : `${cssRules}: ${ruleValue}`

          const { mediaKey, ruleSet } = this.generateMediaQuery(breakpoint, className, rules)
          this.addStyle(mediaKey, ruleSet, null, null)
        } else {
          this.addStyle(className, cssRules, ruleValue, rulePrefix)
        }
      }
    })
  }

  generateStylesheet() {
    this.processReservedClasses()
    let stylesheet = ''
    const mediaQueries = new Map()

    this.styleMap.forEach((rules, className) => {
      if (className.startsWith('@media-')) {
        const breakpointName = className.split('-')[1]
        const breakpoint = this.breakpoints.find(bp => bp.name === breakpointName)

        if (breakpoint) {
          let mediaQuery = ''
          if (breakpoint.min !== undefined && breakpoint.max !== undefined) {
            mediaQuery = `(min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px)`
          } else if (breakpoint.min !== undefined) {
            mediaQuery = `(min-width: ${breakpoint.min}px)`
          } else if (breakpoint.max !== undefined) {
            mediaQuery = `(max-width: ${breakpoint.max}px)`
          }

          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, new Set())
          }
          rules.forEach(rule => {
            mediaQueries.get(mediaQuery).add(rule)
          })
        }
      } else {
        const styles = Array.from(rules).join('; ')
        stylesheet += `.${className} { ${styles}; }\n`
      }
    })

    mediaQueries.forEach((rules, query) => {
      stylesheet += `@media ${query} {\n`
      rules.forEach((rule: string) => {
        stylesheet += `  ${rule}\n`
      })
      stylesheet += '}\n'
    })

    return stylesheet
  }
}
