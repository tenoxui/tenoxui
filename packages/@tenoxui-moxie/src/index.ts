import type { Values, Classes, CSSPropertyOrVariable, GetCSSProperty } from '@tenoxui/types'
import type { Property, Config, ProcessedStyle } from './types'
export * from './types'
export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private useHyphens: boolean

  constructor({ property = {}, values = {}, classes = {}, alwaysUseHyphens = true }: Config = {}) {
    this.property = {
      moxie: ({ key }) => key as GetCSSProperty, // use moxie-* to access all properties and variables
      ...property
    }
    this.values = values
    this.classes = classes
    this.useHyphens = alwaysUseHyphens
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

  private getTypePrefixes(safelist: string[] = []): string[] {
    const styleAttribute = this.property
    const classRegistry = this.classes
    const propertyTypes = Object.keys(styleAttribute)

    if (!classRegistry) {
      return [...propertyTypes, ...safelist].sort((a, b) => b.length - a.length)
    }

    const classConfigs = this.getAllClassNames(classRegistry)
    const classPatterns = [...classConfigs]

    return [...propertyTypes, ...classPatterns, ...safelist].sort((a, b) => b.length - a.length)
  }

  private generateClassNameRegEx(safelist?: string[]): RegExp {
    const typePrefixes = this.getTypePrefixes(safelist).join('|')

    // Common pattern for handling complex nested structures
    const nestedBracketPattern = '\\[[^\\]]+\\]'
    const nestedParenPattern = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'
    const nestedBracePattern = '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'

    // 1. Prefix pattern
    const prefixPattern =
      '(?:(' +
      // Simple prefix (hover, md, focus, etc.)
      '[a-zA-Z0-9_-]+|' +
      // value-like prefix (nth-(4), max-[445px], etc.)
      '[a-zA-Z0-9_-]+(?:-(?:' +
      nestedBracketPattern +
      '|' +
      nestedParenPattern +
      '|' +
      nestedBracePattern +
      '))|' +
      // Direct bracket, parenthesis, or brace content
      nestedBracketPattern +
      '|' +
      nestedParenPattern +
      '|' +
      nestedBracePattern +
      '):)?'

    // 2. Type pattern
    const typePattern = `(${typePrefixes}|\\[[^\\]]+\\])`

    // 3. Separator (optional)
    const separator = this.useHyphens ? '(?:-)' : '(?:-)?'

    // 4. Value pattern - modified to handle $ variables correctly
    const valuePattern =
      '(-?(?:\\d+(?:\\.\\d+)?)|' + // Numbers
      '(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|' + // Words with hyphens
      '(?:#[0-9a-fA-F]+)|' + // Hex colors
      nestedBracketPattern +
      '|' + // Bracket content
      nestedBracePattern +
      '|' + // Curly brace content
      nestedParenPattern +
      '|' + // Parentheses content
      '(?:\\$[^\\s\\/]+))' // Dollar sign content

    // 5. Unit pattern (optional)
    const unitPattern = '([a-zA-Z%]*)'

    // 6. Secondary value pattern (optional)
    const secondaryPattern =
      '(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|' + // Same pattern as valuePattern
      '(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|' +
      '(?:#[0-9a-fA-F]+)|' +
      nestedBracketPattern +
      '|' +
      nestedBracePattern +
      '|' +
      nestedParenPattern +
      '|' +
      '(?:\\$[^\\s\\/]+))' +
      '([a-zA-Z%]*))?'

    return new RegExp(
      prefixPattern + typePattern + separator + valuePattern + unitPattern + secondaryPattern
    )
  }

  public parse(className: string, safelist?: string[]) {
    // Check if the className exists in any class object
    if (Object.values(this.classes).some((classObj) => classObj?.[className])) {
      return [undefined, className, '', '', undefined, undefined]
    }

    const classNameRegEx = this.generateClassNameRegEx(safelist)
    const match = (className + '-dummy').match(classNameRegEx)
    if (!match) return null

    const [, prefix, type, value, unit, secValue, secUnit] = match
    const finalValue = value ? (value === 'dummy' ? '' : value.replace('-dummy', '')) : ''
    const finalSecValue = secValue
      ? secValue === 'dummy'
        ? ''
        : secValue.replace('-dummy', '')
      : ''

    return [prefix, type, finalValue, unit || '', finalSecValue, secUnit, className]
  }

  // unique value parser
  public processValue(value: string, unit: string, group: string): string {
    if (!value) return ''

    // Replace values wrapped in {} with values from this.values
    const replaceWithValueRegistry = (text: string): string => {
      return text.replace(/\{([^}]+)\}/g, (match, key) => {
        const valueRegistry = this.values
        const val =
          valueRegistry !== null
            ? typeof valueRegistry[group] === 'object'
              ? (valueRegistry[group] as { [value: string]: string })[key]
              : valueRegistry[key]
            : undefined

        return typeof val === 'string' ? val : match
      })
    }

    if (
      typeof this.values === 'object' &&
      this.values !== null &&
      ((this.values[group] &&
        typeof this.values[group] === 'object' &&
        this.values[group][value]) ||
        this.values[value])
    ) {
      if (typeof this.values[group] === 'object' && this.values[group] !== null) {
        return this.values[group][value] as string
      }

      return this.values[value] as string
    } else if (value.startsWith('$')) {
      return `var(--${value.slice(1)})` //? [color]-$my-color => color: var(--my-color)
    } else if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = value
        .slice(1, -1)
        // Replaces `_` but ignores `\_`
        .replace(/\\\_/g, 'm0x13c55')
        .replace(/\_/g, ' ')
        .replace(/m0x13c55/g, '_')

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
    secondUnit: string | undefined = '',
    isHyphen: boolean = true
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
    const finalValue = this.processValue(finalCleanValue, unit, type)
    // process second value
    const finalSecValue = this.processValue(secondValue, secondUnit, type)

    // if the type started with square bracket
    // e.g. [--my-color], [color,borderColor] ...
    if (type.startsWith('[') && type.endsWith(']')) {
      const items = type
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())

      const cssRules = items
        .map((item) => {
          const finalProperty = item.startsWith('--')
            ? String(item)
            : this.toKebabCase(String(item))
          return `${finalProperty}: ${finalValue}`
        })
        .join('; ')

      return {
        className: `${`[${type.slice(1, -1)}]${isHyphen ? '-' : ''}${value}${unit}`}`,
        cssRules, // return css rules directly
        value: null, // and set value to null to prevent value duplication
        prefix
      }
    }

    // if type matched property's key
    // e.g. { property: { bg: 'background' } }
    // the `bg` is the type
    if (properties) {
      if (typeof properties === 'object' && 'property' in properties) {
        const groupValue =
          properties.group &&
          (this.values[properties.group] as { [value: string]: string })[finalValue]
            ? (this.values[properties.group] as { [value: string]: string })[finalValue]
            : unit
              ? value
              : finalValue

        const property =
          typeof properties.property === 'function'
            ? properties.property({
                value: value.startsWith('[') ? finalValue : groupValue,
                unit: value.startsWith('[') ? '' : unit,
                secondValue: value.startsWith('[') ? '' : secondUnit ? secondValue : finalSecValue,
                secondUnit: value.startsWith('[') ? '' : secondUnit,
                key: extractedFor
              })
            : properties.property

        const template = properties.value || '{0}'

        let processedValue

        if (typeof template === 'function') {
          processedValue = template({
            value: groupValue,
            unit,
            secondValue: secondUnit ? secondValue : finalSecValue,
            secondUnit,
            key: extractedFor
          })
        } else if (template && typeof template === 'string') {
          const valuesGroup = properties.group || type
          const newValue = this.processValue(finalCleanValue, unit, valuesGroup)

          if (
            this.values[valuesGroup] &&
            typeof this.values[valuesGroup] === 'object' &&
            this.values[valuesGroup][finalCleanValue]
          ) {
            processedValue = this.values[valuesGroup][finalCleanValue]
          } else if (template.includes('{')) {
            processedValue = this.parseValuePattern(
              valuesGroup,
              template,
              newValue,
              '',
              finalSecValue,
              ''
            )
          } else {
            processedValue = finalValue
          }
        } else processedValue = null

        const className = `${type}${
          value ? `${isHyphen ? (isHyphen ? '-' : '') : ''}${value}${unit}` : ''
        }${secondValue ? `/${secondValue}${secondUnit}` : ''}`

        return {
          className,
          cssRules: Array.isArray(property)
            ? (property as string[])
            : typeof property === 'string' &&
                ((property as string).includes(':') || (property as string).includes('value:'))
              ? (property as string).includes('value:')
                ? (property as string).slice(6)
                : (this.toKebabCase(String(property)) as string)
              : (this.toKebabCase(String(property)) as string),
          value:
            template === null || (property as string).includes('value:')
              ? null
              : value.startsWith('[')
                ? finalValue
                : processedValue,
          prefix
        }
      }

      const finalRegProperty =
        typeof properties === 'function'
          ? properties({
              value: value.startsWith('[') ? finalValue : unit ? value : finalValue,
              unit: value.startsWith('[') ? '' : unit,
              secondValue: value.startsWith('[') ? '' : secondUnit ? secondValue : finalSecValue,
              secondUnit: value.startsWith('[') ? '' : secondUnit,
              key: extractedFor
            })
          : properties

      return {
        className: `${type}${value ? (isHyphen ? '-' : '') + value + unit : ''}${
          secondValue ? `/${secondValue}${secondUnit}` : ''
        }`,
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
    group: string,
    pattern: string,
    inputValue: string,
    inputUnit: string,
    inputSecValue: string,
    inputSecUnit: string
  ): string {
    if (!pattern.includes('{0}') && !pattern.includes('{1') && !pattern.includes('||'))
      return pattern

    const [value, defaultValue] = pattern.split('||').map((s) => s.trim())
    const finalValue = this.processValue(inputValue, inputUnit, group)
    const finalSecValue = this.processValue(inputSecValue, inputSecUnit, group)

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
    secUnit: string | undefined = '',
    isHyphen: boolean = true
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

      const finalClassName = `${className}${value ? `${isHyphen ? '-' : ''}${value}${unit}` : ''}${
        secValue ? `/${secValue}${secUnit}` : ''
      }`

      return {
        className: value === isValueType ? className : finalClassName,
        cssRules: rules,
        value: null,
        prefix
      }
    }

    return null
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

      const parts = this.parse(className)
      const parsed = parts ? parts : [getPrefix, getType, '', '']
      if (!parsed) return this

      const [prefix, type, value, unit, secValue, secUnit] = parsed

      const isHyphen = !className.includes((type || '') + (value || ''))

      const classFromClasses =
        this.getParentClass(`${type}${isHyphen ? '-' : ''}${value}`).length > 0
          ? `${type}${isHyphen ? '-' : ''}${value}`
          : type

      const shouldClasses = this.processCustomClass(
        classFromClasses,
        value,
        unit,
        prefix,
        secValue,
        secUnit,
        isHyphen
      )

      if (shouldClasses) {
        const { className, cssRules, prefix } = shouldClasses

        results.push({
          className,
          cssRules,
          value: null,
          prefix
        })

        return
      }

      const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit, isHyphen)

      if (result) {
        const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result

        results.push({
          className,
          cssRules,
          value: ruleValue,
          prefix: rulePrefix
        })
      }
    })

    return results
  }
}

export default TenoxUI
