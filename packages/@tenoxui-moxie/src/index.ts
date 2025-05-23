import type { Values, Classes, CSSPropertyOrVariable } from '@tenoxui/types'
import type { Property, Config, Parsed, ProcessedStyle, Results } from './types'
import { toKebabCase, escapeCSSSelector, constructRaw } from './utils'
import { regexp, escapeRegex } from './lib/regexp'

export class TenoxUI {
  private property: Property
  private values: Values
  private classes: Classes
  private prefixChars: string[]

  constructor({ property = {}, values = {}, classes = {}, prefixChars = [] }: Config = {}) {
    this.property = property
    this.values = values
    this.classes = classes
    this.prefixChars = prefixChars.map(escapeRegex)
  }

  public regexp(safelist?: string[]) {
    return regexp({
      safelist,
      property: this.property,
      classes: this.classes,
      inputPrefixChars: this.prefixChars
    })
  }

  public parse(className: string, safelist?: string[]): Parsed {
    const patterns = this.regexp(safelist)
    // catch all possible class names with value defined
    const fullMatch = className.match(new RegExp(patterns.all))
    if (fullMatch) {
      const [, prefix, type, value, unit, secValue, secUnit] = fullMatch

      return [prefix, type, value, unit || '', secValue, secUnit]
    }

    // catch valueless class names, such as from this.classes
    const valuelessMatch = className.match(
      new RegExp(`^(?:(${patterns.prefix}):)?${patterns.type}$`)
    )

    if (valuelessMatch) return [valuelessMatch[1], valuelessMatch[2], '', '', undefined, undefined]

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
    className: string = '',
    raw: Parsed
  ): ProcessedStyle | null {
    const properties = this.property[type]

    // return null when properties is an object, but doesn't have `property` field
    if (
      typeof properties === 'object' &&
      !Array.isArray(properties) &&
      !('property' in properties)
    ) {
      return null
    }

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
      ((typeof properties === 'string' && !properties.includes(':')) ||
        Array.isArray(properties)) &&
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
          item.trim().startsWith('--') ? String(item.trim()) : toKebabCase(String(item.trim()))
        )

      return {
        className: constructRaw(prefix, type, value, unit),
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

        // return direct data from `type`
        if (
          property &&
          typeof property === 'object' &&
          !Array.isArray(property) &&
          'cssRules' in property
        ) {
          const {
            className: itemClass,
            cssRules = null,
            value = null,
            prefix: itemPrefix
          } = property

          return {
            className: itemClass || className,
            cssRules,
            value,
            prefix: itemPrefix || prefix,
            isCustom: Boolean(itemClass)
          }
        }

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
          } else if (typeof template === 'string' && !template.includes('{')) {
            processedValue = template
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

        // checking if the second value is present with both property and value is string
        // if so, return null
        if (
          ((typeof properties.property === 'string' || Array.isArray(properties.property)) &&
            typeof template === 'string' &&
            (value.includes(extractedFor + ':') || (!template.includes('{1') && secondValue))) ||
          // check if the property is string or array of properties
          // but the value is null
          ((typeof properties.property === 'string' || Array.isArray(properties.property)) &&
            template === null) ||
          // check if the type is a direct rules but has `value` defined
          (typeof properties.property === 'string' && properties.property.includes(':') && value) ||
          ((typeof properties.property === 'string' || Array.isArray(properties.property)) &&
            typeof properties.value === 'string' &&
            !properties.value.includes('{') &&
            value)
        ) {
          return null
        }

        return {
          className: constructRaw(prefix, type, value, unit, secondValue, secondUnit),
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
                    : (toKebabCase(String(property)) as string)
                  : // basic string property
                    (toKebabCase(String(property)) as string),
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

      // return direct data from `type` an object and have `cssRules` field in it
      if (
        finalRegProperty &&
        typeof finalRegProperty === 'object' &&
        !Array.isArray(finalRegProperty) &&
        'cssRules' in finalRegProperty
      ) {
        const {
          className: itemClass,
          cssRules = null,
          value = null,
          prefix: itemPrefix
        } = finalRegProperty

        return {
          className: itemClass || className,
          cssRules,
          value,
          prefix: itemPrefix || prefix,
          isCustom: Boolean(itemClass)
        }
      }

      return {
        className: constructRaw(prefix, type, value, unit, secondValue, secondUnit),
        cssRules: !finalRegProperty
          ? null
          : Array.isArray(finalRegProperty)
            ? (finalRegProperty as string[])
            : typeof finalRegProperty === 'string' &&
                (finalRegProperty.includes(':') || finalRegProperty.startsWith('value:'))
              ? finalRegProperty.startsWith('value:')
                ? finalRegProperty.slice(6)
                : (toKebabCase(String(finalRegProperty)) as string)
              : (toKebabCase(String(finalRegProperty)) as string),
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
        computedValue = computedValue.replace(/\{0\}/g, finalValue)
      }

      if (pattern.includes('{1')) {
        // handle simple {1} replacements first
        if (pattern.includes('{1}')) {
          if (inputSecValue) {
            computedValue = inputSecValue.startsWith('[')
              ? finalSecValue
              : computedValue.replace(/\{1\}/g, finalSecValue)
          } else {
            computedValue = defaultValue || value
          }
        }

        // handle {1 | defaultValue} pattern with optional default values
        // find {1 ... } pattern and extract default value if present
        const regex = /\{1([^}]*)\}/g
        let match

        while ((match = regex.exec(computedValue)) !== null) {
          const fullMatch = match[0]
          const innerContent = match[1].trim()
          let replacementValue = finalSecValue

          if (!replacementValue && innerContent.includes('|')) {
            // use default value after | if second value isn't provided
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
          : value.replace(/\{0\}/g, finalValue)
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

    // check if the class name is already a combined type and value
    const hasAppendedValue = value && className.endsWith(`-${value}${unit}`)

    if (properties.length > 0) {
      const rules = properties
        .map((prop) => {
          const classObj = this.classes[prop]
          // check if the utility is support custom value
          // if not, don't process it
          if (
            !classObj ||
            (value &&
              !hasAppendedValue &&
              classObj[className] &&
              !classObj[className].includes('{0}') &&
              !classObj[className].includes('|'))
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

          return `${toKebabCase(String(prop))}: ${processedValue}`
        })
        .filter(Boolean)
        .join('; ')

      return {
        className: hasAppendedValue
          ? className
          : constructRaw(prefix, className, value, unit, secValue, secUnit),
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
          const raw = [...parsed, constructRaw(prefix, type, value, unit, secValue, secUnit)]

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
                className: escapeCSSSelector(className),
                cssRules,
                value: null,
                prefix,
                raw
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
              className,
              raw
            )

            if (result) {
              const { className, cssRules, value: ruleValue, prefix: rulePrefix, isCustom } = result
              if (!cssRules || cssRules === 'null') continue

              results.push({
                className: isCustom ? className : escapeCSSSelector(className),
                cssRules,
                value: ruleValue,
                prefix: rulePrefix,
                raw
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
export * from './utils'
export { regexp } from './lib/regexp'
export default TenoxUI
