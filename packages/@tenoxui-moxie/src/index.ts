import type { Values, Classes, CSSPropertyOrVariable, GetCSSProperty } from '@tenoxui/types'
import type { Property, Config, Parsed, ProcessedStyle, Results } from './types'

export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes

  constructor({ property = {}, values = {}, classes = {} }: Config = {}) {
    this.property = {
      // use moxie-* utility to access all properties and variables
      // e.g. `moxie-(color:red)` => `color: red`, `moxie-(--my-var:20px_1rem)` => `--my-var: 20px 1rem`
      moxie: ({ key, secondValue }) => (secondValue ? null : (key as GetCSSProperty)),
      ...property
    }
    this.values = values
    this.classes = classes
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
    return str
      .replace(/^(\d)/, '\\3$1 ') // escape any digits at the start of the selector
      .replace(/([#{}.:;?%&,@+*~'"!^$[\]()=>|/])/g, '\\$1')
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

  public regexp(safelist?: string[]) {
    const typePrefixes = this.getTypePrefixes(safelist).join('|')

    // Common pattern for handling complex nested structures
    const nestedBracketPattern = '\\[[^\\]]+\\]'
    const nestedParenPattern = '\\([^()]*(?:\\([^()]*\\)[^()]*)*\\)'
    const nestedBracePattern = '\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}'

    // 1. Prefix pattern
    const prefixPattern =
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
      nestedBracePattern

    // 2. Type pattern
    const typePattern = `(${typePrefixes}|\\[[^\\]]+\\])`

    // 3. Separator
    const separator = '(?:-)'

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

    return {
      prefix: prefixPattern,
      type: typePattern,
      separator: separator,
      value: valuePattern,
      unit: unitPattern,
      secondValuePattern: secondaryPattern,
      all:
        '(?:(' +
        prefixPattern +
        '):)?' +
        typePattern +
        separator +
        valuePattern +
        unitPattern +
        secondaryPattern
    }
  }

  public parse(className: string, safelist?: string[]): Parsed {
    const regexp = this.regexp(safelist)

    // catch all possible class names with value defined
    const fullMatch = className.match(new RegExp(regexp.all))
    if (fullMatch) {
      const [, prefix, type, value, unit, secValue, secUnit] = fullMatch
      const constructedClass = `${prefix ? `${prefix}:` : ''}${type}-${value}${unit}${
        secValue ? `/${secValue}${secUnit}` : ''
      }`

      return [prefix, type, value, unit || '', secValue, secUnit, constructedClass]
    }

    // catch valueless class names, such as from this.classes
    const valuelessMatch = className.match(new RegExp(`(?:(${regexp.prefix}):)?${regexp.type}`))

    if (valuelessMatch)
      return [valuelessMatch[1], valuelessMatch[2], '', '', undefined, undefined, className]

    return null
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
    raw?: Parsed
  ): ProcessedStyle | null {
    const properties = this.property[type]
    // Extract "key" from (color:red) => { key: 'color', cleanValue: 'red' }
    // Pattern that matches both (key:value) and [key:value] formats
    const pattern = /^(?:\(|\[)([^:]+):(.+)(?:\)|\])$/
    let extractedFor: string | null = null
    let cleanValue = value || ''
    const matchValue = cleanValue.match(pattern)
    if (matchValue) {
      extractedFor = matchValue[1].trim()
      cleanValue = matchValue[2].trim()
    }

    // the basic shorthand (string or array properties) is :
    // should have `value`
    // shouldn't have `key` (or label)
    // shouldn't have `secondValue`
    if (
      (typeof properties === 'string' || Array.isArray(properties)) &&
      (!value || value.includes(extractedFor + ':') || secondValue)
    ) {
      return null
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
      if (!value || secondValue) return null // Early return for invalid values

      const items = type
        .slice(1, -1)
        .split(',')
        .map((item) =>
          item.trim().startsWith('--') ? String(item.trim()) : this.toKebabCase(String(item.trim()))
        )

      return {
        className: `${type}-${value}${unit}`,
        cssRules: items.length === 1 ? items[0] : items,
        value: finalValue,
        prefix
      }
    }

    // if type matched property's key
    if (properties) {
      // complex shorthand handler
      if (typeof properties === 'object' && 'property' in properties) {
        // compute values group from `this.values`
        const groupValue =
          properties.group &&
          (this.values[properties.group] as { [value: string]: string })[finalValue]
            ? (this.values[properties.group] as { [value: string]: string })[finalValue]
            : unit
              ? value
              : finalValue

        const property =
          // handle `properties.property` function
          typeof properties.property === 'function'
            ? properties.property({
                value: value.startsWith('[') ? finalValue : groupValue,
                unit: value.startsWith('[') ? '' : unit,
                secondValue: value.startsWith('[') ? '' : secondUnit ? secondValue : finalSecValue,
                secondUnit: value.startsWith('[') ? '' : secondUnit,
                key: extractedFor,
                raw
              })
            : // defaulting to string property
              // e.g. { property: { p: { property: 'padding', value: '{0} {1}' } }
              // the `p` is the type or the shorthand for `padding` property -
              // and has support for second value
              properties.property

        // `properties.value` handler
        const template = properties.value || '{0}' // defaulting to `{0}` if `properties.value` is not defined

        let processedValue

        // handle `properties.value` as function
        // include direct secondValue and secondUnit as parameters
        if (typeof template === 'function') {
          processedValue = template({
            value: groupValue,
            unit,
            secondValue: secondUnit ? secondValue : finalSecValue,
            secondUnit,
            key: extractedFor,
            raw
          })
        }

        // handle `properties.value` as string
        // use `{0}` and `{1}` to determine where the value and secondValue should take place
        else if (template && typeof template === 'string') {
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
        }
        // if `properties.value` is an array
        else if (Array.isArray(template)) {
          // return null when the value isn't available in the array -
          // or when the secondValue is defined
          if (!template.includes(value + unit) || secondValue) return null
          // process further
          else processedValue = value + unit
        } else processedValue = null
        const className = `${type}${value ? `-${value}${unit}` : ''}${
          secondValue ? `/${secondValue}${secondUnit}` : ''
        }`

        // checking if the second value is present with both property and value is string
        // if so, return null
        if (
          typeof properties.property === 'string' &&
          typeof template === 'string' &&
          (value.includes(extractedFor + ':') || (!template.includes('{1') && secondValue))
        ) {
          return null
        }

        return {
          className,
          cssRules:
            // if not property, or when `properties.property` as function return null
            !property
              ? null
              : Array.isArray(property)
                ? (property as string[])
                : // is direct CSS rules
                  typeof property === 'string' &&
                    ((property as string).includes(':') || (property as string).includes('value:'))
                  ? (property as string).includes('value:')
                    ? (property as string).slice(6)
                    : (this.toKebabCase(String(property)) as string)
                  : // basic string property
                    (this.toKebabCase(String(property)) as string),
          value:
            template === null ||
            property === null ||
            (property as string).includes(':') ||
            (property as string).includes('value:')
              ? null
              : value.startsWith('[')
                ? finalValue
                : processedValue,
          prefix
        }
      }

      // handle basic shorthands
      const finalRegProperty =
        // handle `properties` as function
        // e.g. m: ({ value, unit }) => `margin: ${value}${unit || 'px'}`
        // m-4 => margin: 4px
        // m-4rem => margin: 4rem
        typeof properties === 'function'
          ? properties({
              value: value.startsWith('[') ? finalValue : unit ? value : finalValue,
              unit: value.startsWith('[') ? '' : unit,
              secondValue: value.startsWith('[') ? '' : secondUnit ? secondValue : finalSecValue,
              secondUnit: value.startsWith('[') ? '' : secondUnit,
              key: extractedFor,
              raw
            })
          : // e.g. { property: { bg: 'background' } }
            // the `bg` is the type or the shorthand for `background` property
            properties

      return {
        className: `${type}${value ? '-' + value + unit : ''}${
          secondValue ? `/${secondValue}${secondUnit}` : ''
        }`,
        cssRules: !finalRegProperty
          ? null
          : Array.isArray(properties)
            ? (finalRegProperty as string[])
            : typeof finalRegProperty === 'string' &&
                (finalRegProperty.includes(':') || finalRegProperty.startsWith('value:'))
              ? finalRegProperty.startsWith('value:')
                ? finalRegProperty.slice(6)
                : (this.toKebabCase(String(finalRegProperty)) as string)
              : (this.toKebabCase(String(finalRegProperty)) as string),
        value:
          typeof finalRegProperty === 'string' && finalRegProperty.includes(':')
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
    secUnit: string | undefined = ''
  ): ProcessedStyle | null {
    if (!className) return null

    const properties = this.getParentClass(className)

    if (properties.length > 0) {
      const rules = properties
        .map((prop) => {
          const classObj = this.classes[prop]
          // check if the utility is support custom value
          // if not, don't process it
          if (
            !classObj ||
            (value && !classObj[className].includes('||')) ||
            (value && !classObj[className].includes('|'))
          )
            return null

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
        className: value === isValueType ? className : finalClassName,
        cssRules: rules,
        value: null,
        prefix
      }
    }

    return null
  }

  public process(classNames: string | string[]): Results[] {
    try {
      const classList = Array.isArray(classNames) ? classNames : classNames.split(/\s+/)
      const results: Results[] = []

      for (const className of classList) {
        try {
          if (!className) continue
          const parsed = this.parse(className)
          if (!parsed) continue
          const [prefix, type, value, unit, secValue, secUnit] = parsed
          if (!type) continue // Skip if type is missing

          const classFromClasses =
            this.getParentClass(`${type}-${value}`).length > 0 ? `${type}-${value}` : type

          // Try processing as custom class first
          try {
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
              if (!cssRules || cssRules === 'null') continue
              results.push({
                className,
                cssRules,
                value: null,
                prefix,
                raw: parsed
              })
              continue
            }
          } catch (customClassError) {
            console.warn(`Error processing custom class "${className}":`, customClassError)
            // Continue to try shorthand processing
          }

          // Try shorthand processing
          try {
            const result = this.processShorthand(
              type,
              value!,
              unit,
              prefix,
              secValue,
              secUnit,
              parsed
            )

            if (result) {
              const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result
              if (!cssRules || cssRules === 'null') continue

              results.push({
                className,
                cssRules,
                value: ruleValue,
                prefix: rulePrefix,
                raw: parsed
              })
            }
          } catch (shorthardError) {
            console.warn(`Error processing shorthand "${className}":`, shorthardError)
          }
        } catch (singleClassError) {
          console.warn(`Failed to process class \`${className}\`:`, singleClassError)
          // Continue processing other classes even if one fails
        }
      }

      return results
    } catch (globalError) {
      console.error('Critical error in process method:', globalError)
      return []
    }
  }
}

export * from './types'
export default TenoxUI
