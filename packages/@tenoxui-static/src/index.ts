import type {
  Property,
  Values,
  Aliases,
  Classes,
  Breakpoint,
  CSSPropertyOrVariable
} from '@tenoxui/types'

type StyleValue = string | NestedStyles
type NestedStyles = {
  [selector: string]: StyleValue
}

interface TenoxUIConfig {
  property: Property
  values: Values
  classes: Classes
  breakpoints: Breakpoint[]
  aliases: Aliases
}

export interface Config {
  property?: Property
  values?: Values
  classes?: Classes
  aliases?: Aliases
  breakpoints?: Breakpoint[]
  reserveClass?: string[]
  apply?: Record<string, StyleValue>
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

// constructor
export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoint[]
  private reserveClass: string[]
  private styleMap: Map<string, Set<string>>
  private apply: Record<string, StyleValue>
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

    if (Object.keys(this.apply).length > 0) {
      this.initializeApplyStyles()
    }
  }
  // Replace camelCase css properties into kebab-case css properties
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

  // adding `\` for some expression in the css selector
  private escapeCSSSelector(str: string): string {
    return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, '\\$1')
  }

  // generate regex pattern for class name parsing
  private generateClassNameRegEx(): RegExp {
    const typePrefixes = Object.keys(this.property)
      .sort((a, b) => b.length - a.length)
      .join('|')

    return new RegExp(
      // you dont have to understand this, me neither
      `(?:([a-zA-Z0-9-]+|\\[[^\\]]+\\]|\\([^)]+\\)|\\{[^}]+\\}):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )
  }

  // parse any class names and divide them into parts
  public parseClassName(
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

    // overall, it will parse :
    // {prefix}:{type}-{value}{unit?}

    return [
      prefix, //? as its name. e.g. hover, md, focus
      type, //? compute css properties or variables that will styled. e.g. [color]-, [--red,background]-, bg-,
      value, //? parsed css value from the class name. e.g. red, space-between, 64, 100
      unit, //? is optional if the value is numbers. e.g. px, rem, %
      // both secValue & secUnit isn't implemented yet
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

      // example:
      // config = {
      //   values: {
      //     red: "255 0 0"
      //   }
      // }
      //
      // case:
      // [background]-[rgb({red})]
      //
      // will parsed into:
      // background: rgb(255 0 0)
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

  private getParentClass(className: string): CSSPropertyOrVariable[] {
    return Object.keys(this.classes).filter((cssProperty) =>
      Object.prototype.hasOwnProperty.call(
        this.classes[cssProperty as CSSPropertyOrVariable],
        className
      )
    ) as CSSPropertyOrVariable[]
  }

  public processCustomClass(className: string, prefix?: string): ProcessedStyle | null {
    const properties = this.getParentClass(className)
    if (properties.length > 0) {
      const rules = properties
        .map((prop) => {
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

  public processAlias(className: string, prefix: string = ''): ProcessedStyle | null {
    const alias = this.aliases[className]
    if (!alias) return null

    const aliasClasses = alias.split(' ')
    const combinedRules: string[] = []

    aliasClasses.forEach((aliasClass) => {
      const shouldClasses = this.processCustomClass(aliasClass)
      if (shouldClasses) {
        const { cssRules } = shouldClasses
        combinedRules.push(cssRules as string)

        return
      }

      const parsed = this.parseClassName(aliasClass)
      if (!parsed) return

      const [prefix, type, value, unit, secValue, secUnit] = parsed
      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

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

  public processClassNames(classNames: string[]): void {
    classNames.forEach((className) => {
      if (!className) return
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

        return
      }

      const shouldClasses = this.processCustomClass(getType, getPrefix)

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
  }

  private processReservedClasses() {
    this.reserveClass.forEach((className) => {
      const classArray = Array.isArray(className)
        ? className
        : className.split(/\s+/).filter(Boolean)
      this.processClassNames(classArray)
    })
  }

  private initializeApplyStyles() {
    this.processApplyObject(this.apply)
  }

  private processApplyObject(styles: Record<string, StyleValue>, parentSelector: string = '') {
    Object.entries(styles).forEach(([selector, value]) => {
      if (typeof value === 'string') {
        this.processApplyStyles(selector, value, parentSelector)
      } else if (typeof value === 'object') {
        const fullSelector = this.combineSelectors(parentSelector, selector)
        const ignoreQueries = ['@property', '@counter-style', '@page', '@font-face']
        if (
          selector.startsWith('@') &&
          !ignoreQueries.some((query) => selector.startsWith(query))
        ) {
          Object.entries(value).forEach(([nestedSelector, nestedValue]) => {
            if (typeof nestedValue === 'string') {
              this.processApplyStyles(nestedSelector, nestedValue, selector)
            }
          })
        } else {
          Object.entries(value).forEach(([nestedSelector, nestedValue]) => {
            if (typeof nestedValue === 'string') {
              const finalSelector =
                nestedSelector === ''
                  ? fullSelector
                  : this.combineSelectors(fullSelector, nestedSelector)
              this.processApplyStyles(finalSelector, nestedValue, '')
            }
          })
        }
      }
    })
  }

  private combineSelectors(parent: string, child: string): string {
    if (!parent) return child
    if (child.includes('&')) {
      return child.replace(/&/g, parent)
    }
    if (parent.startsWith('@')) {
      return parent
    }
    return `${parent} ${child}`
  }

  private processApplyStyles(selector: string, classNames: string, parentSelector: string = '') {
    const uniqueQueries = ['@media', '@keyframes', '@layer', '@container']
    const isUniqueQuery = uniqueQueries.some(
      (query) => selector.startsWith(query) || parentSelector.startsWith(query)
    )
    const mediaSelector = isUniqueQuery
      ? selector.startsWith('@media')
        ? selector
        : parentSelector
      : ''
    const actualSelector = isUniqueQuery
      ? selector.startsWith('@media')
        ? parentSelector
        : selector
      : selector
    const fullSelector =
      !isUniqueQuery && parentSelector
        ? this.combineSelectors(parentSelector, selector)
        : actualSelector

    const processedStyles = new Set<string | string[]>()
    classNames.split(/\s+/).forEach((className) => {
      if (className === '') {
        processedStyles.add('null')
        return
      }
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

    if (processedStyles.size > 0) {
      const styleRule = Array.from(processedStyles).join('; ')
      if (mediaSelector) {
        if (!this.styleMap.has(mediaSelector)) {
          this.styleMap.set(mediaSelector, new Set())
        }
        const mediaSet = this.styleMap.get(mediaSelector)
        if (mediaSet) {
          mediaSet.add(`${fullSelector} ${styleRule !== 'null' ? `{ ${styleRule} }` : ''}`)
        }
      } else {
        this.addStyle(fullSelector, styleRule, null, null)
      }
    }
  }

  public addStyle(
    className: string,
    cssRules: string | string[],
    value?: string | null,
    prefix?: string | null,
    isCustomSelector: boolean | null = true
  ): void {
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

    return stylesheet
  }
}

export default { TenoxUI }
