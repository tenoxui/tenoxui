import type {
  Property,
  Values,
  Aliases,
  Classes,
  Breakpoint,
  CSSPropertyOrVariable
} from '@tenoxui/types'
import type {
  Config,
  TenoxUIConfig,
  ProcessedStyle,
  MediaQueryRule,
  ApplyStyleObject
} from './types'

export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoint[]
  private reserveClass: string[]
  private styleMap: Map<string, Set<string>>
  private apply: ApplyStyleObject
  private config: TenoxUIConfig

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    reserveClass = [],
    apply = {}
  }: Config = {}) {
    this.property = property
    this.values = values
    this.classes = classes
    this.aliases = aliases
    this.breakpoints = breakpoints
    this.reserveClass = reserveClass
    this.styleMap = new Map()
    this.apply = apply
    this.config = { property, values, classes, breakpoints, aliases }

    if (this.reserveClass.length > 0) {
      this.processReservedClasses()
    }
  }

  private toKebabCase(str: string): string {
    if (/^(webkit|moz|ms|o)[A-Z]/.test(str)) {
      const match = str.match(/^(webkit|moz|ms|o)/)
      if (match) {
        const prefix = match[0]
        return `-${prefix}${str
          .slice(prefix.length)
          .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
      }
    }

    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }

  private escapeCSSSelector(str: string): string {
    return str.replace(/([ #{}.;?%&,@+*~'"!^$[\]()=>|/])/g, '\\$1')
  }

  private getAllClassNames(classRegistry: Classes | undefined): string[] {
    if (!classRegistry) return []
    const classNames = new Set<string>()

    Object.entries(classRegistry).forEach(([property, classObj]) => {
      if (classObj && typeof classObj === 'object') {
        Object.keys(classObj).forEach((className) => {
          classNames.add(className)
        })
      }
    })

    return Array.from(classNames)
  }

  private getTypePrefixes(): string {
    const styleAttribute = this.property
    const classRegistry = this.classes
    const propertyTypes = Object.keys(styleAttribute)

    if (!classRegistry) {
      return propertyTypes.sort((a, b) => b.length - a.length).join('|')
    }

    const classConfigs = this.getAllClassNames(classRegistry)
    const classPatterns = [...classConfigs]

    return [...propertyTypes, ...classPatterns].sort((a, b) => b.length - a.length).join('|')
  }

  private generateClassNameRegEx(): RegExp {
    const typePrefixes = this.getTypePrefixes()

    return new RegExp(
      // you dont have to understand this, me neither
      `(?:([a-zA-Z0-9-]+|\\[[^\\]]+\\]|\\([^)]+\\)|\\{[^}]+\\}):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )
  }

  public parseClassName(className: string) {
    for (const [_property, classObj] of Object.entries(this.classes)) {
      if (classObj && typeof classObj === 'object' && className in classObj) {
        return [undefined, className, '', '', undefined, undefined]
      }
    }

    const classNameRegEx = this.generateClassNameRegEx()
    const match = className.match(classNameRegEx)
    if (!match) return null

    const [, prefix, type, value, unit, secValue, secUnit] = match

    return [
      prefix, //? as its name. e.g. hover, md, focus
      type, //? compute css properties or variables that will styled. e.g. [color]-, [--red,background]-, bg-,
      value || '', //? parsed css value from the class name. e.g. red, space-between, 64, 100
      unit || '', //? is optional if the value is numbers. e.g. px, rem, %
      // same as value and unit, parsed after the '/' character
      secValue,
      secUnit
    ]
  }

  private generateMediaQuery(
    breakpoint: Breakpoint,
    className: string,
    rules: string
  ): MediaQueryRule {
    const { name, min, max } = breakpoint
    let mediaQuery = 'screen and '

    if (min !== undefined && max !== undefined) {
      mediaQuery += `(min-width: ${min}px) and (max-width: ${max}px)`
    } else if (min !== undefined) {
      mediaQuery += `(min-width: ${min}px)`
    } else if (max !== undefined) {
      mediaQuery += `(max-width: ${max}px)`
    }

    return {
      mediaKey: `@media ${mediaQuery}`,
      ruleSet: `.${name}\\:${className} { ${rules} }`
    }
  }

  // unique value parser
  private processValue(type: string, value?: string, unit?: string): string {
    if (!value) return ''

    // replace values wrapped in {} with values from this.values
    const replaceWithValueRegistry = (text: string): string => {
      return text.replace(/\{([^}]+)\}/g, (match, key) => {
        const val = this.values[key]
        return typeof val === 'string' ? val : match
      })
    }

    if (this.values[type] || this.values[value]) {
      if (typeof this.values[type] === 'object' && this.values[type] !== null) {
        return this.values[type][value] as string
      }
      return this.values[value] as string
    } else if (value.startsWith('$')) {
      return `var(--${value.slice(1)})` //? [color]-$my-color => color: var(--my-color)
    } else if (value.startsWith('[') && value.endsWith(']')) {
      const cleanValue = value.slice(1, -1).replace(/_/g, ' ') //? replace '_' (underscore with ' ' (space)

      // access value from value registry
      if (cleanValue.includes('{')) {
        //? see example above
        return replaceWithValueRegistry(cleanValue) //? [color]-[rgb({red})] => color: rgb(255 0 0)
      }
      return cleanValue.startsWith('--')
        ? `var(${cleanValue})` //? [color]-[--my-color] => color: var(--my-color)
        : cleanValue //? [color]-[rgb(255_0_0)] => color: rgb(255 0 0)
    }

    // or default value
    return value + (unit || '') //? [padding]-4px => padding: 4px
  }

  public processShorthand(
    type: string = '',
    value: string | undefined = '',
    unit: string | undefined = '',
    prefix: string | undefined,
    secondValue: string | undefined,
    secondUnit: string | undefined
  ): ProcessedStyle | null {
    const properties = this.property[type]
    const finalValue = this.processValue(type, value, unit)

    if (type.startsWith('[') && type.endsWith(']')) {
      const items = type
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())

      const cssRules = items
        .map((item) => {
          const prop = this.property[item] || item
          const finalProperty =
            typeof prop === 'string' && prop.startsWith('--')
              ? String(prop)
              : this.toKebabCase(String(prop))
          return `${finalProperty}: ${finalValue}`
        })
        .join('; ')

      return {
        className: `${`[${type.slice(1, -1)}]-${value}${unit}`}`,
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

  private parseValuePattern(
    pattern: string,
    inputValue: string,
    inputUnit: string,
    inputSecValue: string,
    inputSecUnit: string
  ): string {
    if (!pattern.includes('{0}') && !pattern.includes('{1') && !pattern.includes('||'))
      return pattern

    const [value, defaultValue] = pattern.split('||').map((s) => s.trim())
    const finalValue = this.processValue('', inputValue, inputUnit)
    const finalSecValue = this.processValue('', inputSecValue, inputSecUnit)

    // handle both {0} and {1}
    if ((pattern.includes('{0}') && pattern.includes('{1')) || pattern.includes('{1')) {
      let computedValue = value
      if (inputValue) {
        computedValue = computedValue.replace('{0}', finalValue)
      }
      if (pattern.includes('{1')) {
        // find {1 ... } pattern and extract default value if present
        const match = computedValue.match(/{1([^}]*)}/)
        if (pattern.includes('{1}')) {
          if (inputSecValue) {
            computedValue = computedValue.replace('{1}', finalSecValue)
          } else {
            computedValue = defaultValue
          }
        } else if (match) {
          const fullMatch = match[0]
          const innerContent = match[1].trim()

          let replacementValue = finalSecValue
          if (!replacementValue && innerContent.includes('|')) {
            // use default value after | if second value isn provided
            replacementValue = innerContent.split('|')[1].trim()
          } else if (!replacementValue) {
            replacementValue = ''
          }
          computedValue = computedValue.replace(fullMatch, replacementValue)
        }
      }
      return inputValue ? computedValue : defaultValue || value
    }
    // Handle only {0} replacement
    else {
      return inputValue ? value.replace('{0}', finalValue) : defaultValue || value
    }
  }

  private getParentClass(className: string): CSSPropertyOrVariable[] {
    return Object.keys(this.classes).filter((cssProperty) =>
      Object.prototype.hasOwnProperty.call(
        this.classes[cssProperty as CSSPropertyOrVariable],
        className
      )
    ) as CSSPropertyOrVariable[]
  }

  public processCustomClass(
    className: string | undefined,
    value: string | undefined = '',
    unit: string | undefined = '',
    prefix: string | undefined = '',
    secValue: string | undefined = '',
    secUnit: string | undefined = ''
  ): ProcessedStyle | null {
    if (!className) return null

    const properties = this.getParentClass(className)

    if (properties.length > 0) {
      const rules = properties
        .map((prop) => {
          const classObj = this.classes[prop]
          if (!classObj) return ''

          const processedValue = this.parseValuePattern(
            classObj[className] || '',
            value,
            unit,
            secValue,
            secUnit
          )

          return `${this.toKebabCase(String(prop))}: ${processedValue}`
        })
        .filter(Boolean)
        .join('; ')

      const isValueType = className.slice(-(value + unit).length)

      const finalClassName = `${className}${value ? `-${value}${unit}` : ''}${
        secValue ? `/${secValue}${secUnit}` : ''
      }`

      return {
        className: this.escapeCSSSelector(value === isValueType ? className : finalClassName),
        cssRules: rules,
        value: null,
        prefix
      }
    }

    return null
  }

  public processAlias(className: string, prefix: string = ''): ProcessedStyle | null {
    const alias = this.aliases[className]

    if (!alias) return null

    const aliasClasses = alias.split(' ')
    const combinedRules: string[] = []

    aliasClasses.forEach((aliasClass) => {
      const [rprefix, rtype] = aliasClass.split(':')
      const getType = rtype || rprefix
      const getPrefix = rtype ? rprefix : undefined
      const parts = this.parseClassName(aliasClass)
      const parsed = parts ? parts : [getPrefix, getType, '', '']
      if (!parsed) return

      const [prefix, type, value, unit, secValue, secUnit] = parsed
      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

      const shouldClasses = this.processCustomClass(type, value, unit, prefix, secValue, secUnit)
      if (shouldClasses) {
        const { cssRules } = shouldClasses
        combinedRules.push(cssRules as string)

        return
      }

      if (result) {
        const value = result.value !== null ? `: ${result.value}` : ''
        if (Array.isArray(result.cssRules)) {
          result.cssRules.forEach((rule) => {
            combinedRules.push(`${this.toKebabCase(rule)}${value}`)
          })
        } else {
          combinedRules.push(`${result.cssRules}${value}`)
        }
      }
    })

    return {
      className,
      cssRules: combinedRules.join('; '),
      value: null,
      prefix
    }
  }

  public processClassNames(classNames: string[]) {
    classNames.forEach((className) => {
      if (!className) return this
      // process prefix and actual class name
      const [rprefix, rtype] = className.split(':')
      const getType = rtype || rprefix
      const getPrefix = rtype ? rprefix : undefined
      const breakpoint = this.breakpoints.find((bp) => bp.name === getPrefix)

      // process class name aliases
      const aliasResult = this.processAlias(getType, getPrefix)
      if (aliasResult) {
        const { className: aliasClassName, cssRules } = aliasResult
        if (breakpoint) {
          const { mediaKey, ruleSet } = this.generateMediaQuery(
            breakpoint,
            aliasClassName,
            cssRules as string
          )

          this.addStyle(mediaKey, ruleSet, null, null)
        } else {
          this.addStyle(aliasClassName, cssRules, null, getPrefix)
        }

        return this
      }

      const parts = this.parseClassName(className)
      const parsed = parts ? parts : [getPrefix, getType, '', '']
      if (!parsed) return this

      const [prefix, type, value, unit, secValue, secUnit] = parsed

      const classFromClasses =
        this.getParentClass(`${type}-${value}`).length > 0 ? `${type}-${value}` : type

      const shouldClasses = this.processCustomClass(
        classFromClasses,
        value,
        unit,
        prefix,
        secValue,
        secUnit
      )

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
        return this
      }

      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

      if (result) {
        const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result
        const processedClass = this.escapeCSSSelector(className)
        if (breakpoint) {
          const rules = Array.isArray(cssRules)
            ? cssRules.map((rule) => `${this.toKebabCase(rule)}: ${ruleValue}`).join('; ')
            : `${cssRules}${ruleValue !== null ? `: ${ruleValue}` : ''}`
          const { mediaKey, ruleSet } = this.generateMediaQuery(breakpoint, processedClass, rules)

          this.addStyle(mediaKey, ruleSet, null, null)
        } else {
          this.addStyle(processedClass, cssRules, ruleValue, rulePrefix)
        }
      }
    })

    return this
  }

  private processReservedClasses() {
    this.reserveClass.forEach((className) => {
      const classArray = Array.isArray(className)
        ? className
        : className.split(/\s+/).filter(Boolean)
      this.processClassNames(classArray)
    })
  }

  public generateRulesFromClass(classNames: string) {
    const processedStyles = new Set<string | string[]>()
    classNames.split(/\s+/).forEach((className) => {
      if (!className) return

      const aliasResult = this.processAlias(className)
      if (aliasResult) {
        const { cssRules } = aliasResult
        processedStyles.add(cssRules)
        return
      }
      const shouldClasses = this.processCustomClass(className)
      if (shouldClasses) {
        const { cssRules } = shouldClasses
        processedStyles.add(cssRules)
        return
      }
      const parsed = this.parseClassName(className)
      if (!parsed) return

      const [, type, value, unit, secValue, secUnit] = parsed
      const result = this.processShorthand(type, value!, unit, undefined, secValue, secUnit)
      if (result) {
        const { cssRules, value: ruleValue } = result
        const finalValue = ruleValue !== null ? `: ${ruleValue}` : ''
        if (Array.isArray(cssRules)) {
          cssRules.forEach((rule) => {
            processedStyles.add(`${this.toKebabCase(rule)}${finalValue}`)
          })
        } else {
          processedStyles.add(`${cssRules}${finalValue}`)
        }
      }
    })

    return processedStyles
  }

  private processApplyObject(obj: ApplyStyleObject, indentLevel: number = 0): string {
    let css = ''
    const indent = ' '.repeat(indentLevel)
    const ruleIndent = ' '.repeat(indentLevel + 2)

    if (obj.SINGLE_RULE) {
      css += obj.SINGLE_RULE.join('\n') + '\n'
      delete obj.SINGLE_RULE
    }

    for (const key in obj) {
      const value = obj[key]
      css += key ? `${indent}${key} {\n` : ''

      if (typeof value === 'string') {
        const rules = [...this.generateRulesFromClass(value)]
        // css += `${ruleIndent}${rules.join(`;\n${ruleIndent}`)};`
        css += `${key ? ruleIndent : indent}${rules.join(`; `)}`
        if (rules.length) css += '\n'
      } else if (typeof value === 'object') {
        css += this.processApplyObject(value, indentLevel + 2)
      }

      css += key ? `${indent}}\n` : ''
    }

    return css
  }

  public addStyle(
    className: string,
    cssRules: string | string[],
    value?: string | null,
    prefix?: string | null,
    isCustomSelector: boolean | null = true
  ) {
    const pseudoClasses = [
      'hover',
      'focus',
      'active',
      'visited',
      'focus-within',
      'focus-visible',
      'checked',
      'disabled',
      'enabled',
      'target',
      'required',
      'valid',
      'invalid'
    ]

    const isPseudoClass = pseudoClasses.includes(prefix || '')
    const colon = isPseudoClass ? ':' : '::'
    const key = `${isCustomSelector ? '' : '.'}${
      prefix ? `${prefix}\\:${className}${colon}${prefix}` : className
    }`

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

    return this
  }

  public getConfig() {
    return this.config
  }

  public getStyle() {
    return this.styleMap
  }

  public getCSSRules(): string {
    this.processReservedClasses()
    let stylesheet = ''
    this.styleMap.forEach((rules, selector) => {
      stylesheet += `${selector} { ${Array.from(rules)} }\n`
    })
    return stylesheet
  }

  public generateStylesheet() {
    this.processReservedClasses()
    const fixedCss =
      Object.keys(this.apply).length > 0 ? this.processApplyObject(this.apply) + '\n' : ''
    const mediaQueries = new Map()
    let stylesheet = ''

    this.styleMap.forEach((rules, selector) => {
      if (selector.startsWith('@media')) {
        const mediaQuery = selector
        if (!mediaQueries.has(mediaQuery)) mediaQueries.set(mediaQuery, new Set())

        rules.forEach((rule) => mediaQueries.get(mediaQuery).add(rule))
      } else if (selector.endsWith(';')) {
        stylesheet += `${selector}\n`
      } else {
        const styles = Array.from(rules).join(' ')
        const [type] = selector.split(':')
        const isMatchApply = this.apply[selector] || this.apply[type] ? '' : '.'

        stylesheet += `${isMatchApply}${selector} { ${styles} }\n`
      }
    })

    mediaQueries.forEach((rules, query) => {
      stylesheet += `${query} {\n`
      rules.forEach((rule: string) => {
        stylesheet += `  ${rule}\n`
      })
      stylesheet += '}\n'
    })

    return fixedCss + stylesheet
  }
}

export { Config, TenoxUIConfig }
export default { TenoxUI }
