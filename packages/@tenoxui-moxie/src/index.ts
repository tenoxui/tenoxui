import type { Values, Aliases, Classes, Breakpoint, CSSPropertyOrVariable } from '@tenoxui/types'
import type {
  Property,
  Config,
  TenoxUIConfig,
  ProcessedStyle,
  MediaQueryRule,
  ClassModifier
} from './types'

export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private aliases: Aliases
  private breakpoints: Breakpoint[]

  constructor({
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = []
  }: Config = {}) {
    this.property = property
    this.values = values
    this.classes = classes
    this.aliases = aliases
    this.breakpoints = breakpoints
  }

  public toKebabCase(str: string): string {
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

  public escapeCSSSelector(str: string): string {
    return str.replace(/([ #{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '\\$1')
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
      `(?:([a-zA-Z0-9-]+|\\[[^\\]]+\\]|\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)|\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\})|(?:\\([^()]*(?:\\([^()]*\\)[^()]*)*\\))|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\})|(?:\\([^()]*(?:\\([^()]*\\)[^()]*)*\\))|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
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
  public processValue(type: string, value?: string, unit?: string): string {
    if (!value) return ''

    // Replace values wrapped in {} with values from this.values
    const replaceWithValueRegistry = (text: string): string => {
      return text.replace(/\{([^}]+)\}/g, (match, key) => {
        const val =
          typeof this.values === 'object' && this.values !== null ? this.values[key] : undefined
        return typeof val === 'string' ? val : match
      })
    }

    if (
      typeof this.values === 'object' &&
      this.values !== null &&
      ((this.values[type] && typeof this.values[type] === 'object' && this.values[type][value]) ||
        this.values[value])
    ) {
      if (typeof this.values[type] === 'object' && this.values[type] !== null) {
        return this.values[type][value] as string
      }

      return this.values[value] as string
    } else if (value.startsWith('$')) {
      return `var(--${value.slice(1)})` //? [color]-$my-color => color: var(--my-color)
    } else if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = value.slice(1, -1).replace(/_/g, ' ') //? replace '_' with ' '

      if (cleanValue.includes('{')) {
        return replaceWithValueRegistry(cleanValue)
      }
      return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
    }

    return value + (unit || '') //? [padding]-4px => padding: 4px
  }

  public processShorthand(
    type: string = '',
    value: string | undefined = '',
    unit: string | undefined = '',
    prefix: string | undefined,
    secondValue: string | undefined = '',
    secondUnit: string | undefined = ''
  ): ProcessedStyle | null {
    const properties = this.property[type]
    // Extract "for" from (color:red) => { for: 'color', cleanValue: 'red' }
    // Pattern that matches both (label:value) and [label:value] formats
    const pattern = /^(?:\(|\[)([^:]+):(.+)(?:\)|\])$/
    let extractedFor: string | null = null
    let cleanValue = value || ''
    const matchValue = cleanValue.match(pattern)
    if (matchValue) {
      extractedFor = matchValue[1].trim()
      cleanValue = matchValue[2].trim()
    }

    let finalCleanValue

    if (value.includes(extractedFor + ':')) {
      finalCleanValue = value.startsWith('(') ? `(${cleanValue})` : `[${cleanValue}]`
    } else finalCleanValue = value

    // process input value
    const finalValue = this.processValue(type, finalCleanValue, unit)
    // process second value
    const finalSecValue = this.processValue(type, secondValue, secondUnit)

    // if the type started with square bracket
    // e.g. [--my-color], [color,borderColor] ...
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
        cssRules, // return css rules directly
        value: null, // and set value to null to prevent value duplication
        prefix
      }
    }

    // if type matched property's key
    // e.g. { property: { bg: 'background' } }
    // the `bg` is the type
    if (properties) {
      if (typeof properties === 'object' && 'property' in properties && 'value' in properties) {
        const property =
          typeof properties.property === 'function'
            ? properties.property({
                value: unit ? value : finalValue,
                unit,
                secondValue: secondUnit ? secondValue : finalSecValue,
                secondUnit,
                key: extractedFor
              })
            : properties.property

        const template = properties.value

        let processedValue

        if (typeof template === 'function') {
          processedValue = template({
            value: unit ? value : finalValue,
            unit,
            secondValue: secondUnit ? secondValue : finalSecValue,
            secondUnit,
            key: extractedFor,
            property
          })
        } else if (template && typeof template === 'string') {
          processedValue = this.parseValuePattern(type, template, finalValue, '', finalSecValue, '')
            ? this.parseValuePattern(type, template, finalValue, '', finalSecValue, '')
            : finalValue
        } else processedValue = null

        const className = `${type}${value ? `-${value}${unit}` : ''}${
          secondValue ? `/${secondValue}${secondUnit}` : ''
        }`

        return {
          className: properties.classNameSuffix
            ? ({
                className,
                modifier: properties.classNameSuffix
              } as ClassModifier)
            : (className as string),
          cssRules: Array.isArray(property)
            ? (property as string[])
            : typeof property === 'string' && (property as string).includes(':')
              ? (property as string)
              : (this.toKebabCase(String(property)) as string),
          value: template === null ? null : value.startsWith('[') ? finalValue : processedValue,
          prefix
        }
      }

      const finalRegProperty =
        typeof properties === 'function'
          ? properties({
              value: unit ? value : finalValue,
              unit,
              secondValue: secondUnit ? secondValue : finalSecValue,
              secondUnit,
              key: extractedFor
            })
          : properties

      return {
        className: `${type}${value ? '-' + value + unit : ''}`,
        cssRules: Array.isArray(properties)
          ? (finalRegProperty as string[])
          : typeof finalRegProperty === 'string' && finalRegProperty.startsWith('value:')
            ? finalRegProperty.slice(6)
            : (this.toKebabCase(String(finalRegProperty)) as string),
        value:
          typeof finalRegProperty === 'string' && finalRegProperty.startsWith('value:')
            ? null
            : finalValue,
        prefix
      }
    }

    return null
  }

  private parseValuePattern(
    className: string,
    pattern: string,
    inputValue: string,
    inputUnit: string,
    inputSecValue: string,
    inputSecUnit: string
  ): string {
    if (!pattern.includes('{0}') && !pattern.includes('{1') && !pattern.includes('||'))
      return pattern

    const [value, defaultValue] = pattern.split('||').map((s) => s.trim())
    const finalValue = this.processValue(className, inputValue, inputUnit)
    const finalSecValue = this.processValue(className, inputSecValue, inputSecUnit)

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
            computedValue = inputSecValue.startsWith('[')
              ? finalSecValue
              : computedValue.replace('{1}', finalSecValue)
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
          computedValue = inputValue.startsWith('[')
            ? finalValue
            : computedValue.replace(fullMatch, replacementValue)
        }
      }
      return inputValue ? computedValue : defaultValue || value
    }
    // Handle only {0} replacement
    else {
      return inputValue
        ? inputValue.startsWith('[')
          ? finalValue
          : value.replace('{0}', finalValue)
        : defaultValue || value
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
            className,
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
      const result = this.processShorthand(type, value!, unit, undefined, secValue, secUnit)

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

  public process(classNames: string | string[]): ProcessedStyle[] {
    const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)

    const results: ProcessedStyle[] = []

    classList.forEach((className) => {
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
            aliasClassName as string,
            cssRules as string
          )

          results.push({
            className: mediaKey,
            cssRules: ruleSet,
            value: null,
            prefix: null
          })
        } else {
          results.push({
            className: aliasClassName,
            cssRules,
            value: null,
            prefix: getPrefix
          })
        }

        return
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
            className as string,
            cssRules as string
          )

          results.push({
            className: mediaKey,
            cssRules: ruleSet,
            value: null,
            prefix: null
          })
        } else {
          results.push({
            className,
            cssRules,
            value: null,
            prefix
          })
        }
        return
      }

      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

      if (result) {
        const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result
        const processedClass =
          typeof className === 'string'
            ? this.escapeCSSSelector(className)
            : this.escapeCSSSelector(className.className) + className.modifier

        if (breakpoint) {
          const rules = Array.isArray(cssRules)
            ? cssRules.map((rule) => `${this.toKebabCase(rule)}: ${ruleValue}`).join('; ')
            : `${cssRules}${ruleValue !== null ? `: ${ruleValue}` : ''}`
          const { mediaKey, ruleSet } = this.generateMediaQuery(breakpoint, processedClass, rules)

          results.push({
            className: mediaKey,
            cssRules: ruleSet,
            value: null,
            prefix: null
          })
        } else {
          results.push({
            className: processedClass,
            cssRules,
            value: ruleValue,
            prefix: rulePrefix
          })
        }
      }
    })

    return results
  }
}

export * from './types'
export { Config, TenoxUIConfig }
export default { TenoxUI }
