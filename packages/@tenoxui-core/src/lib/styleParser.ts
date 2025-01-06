import { Property, Classes, CSSPropertyOrVariable } from '../types'
import { StyleHandler } from './styleHandler'
import { ComputeValue } from './computeValue'
import { Responsive } from './responsive'
import { Pseudo } from './pseudoClass'
import { isObjectWithValue } from '../utils/valueObject'

export class ParseStyles {
  constructor(
    private property: Property,
    private classes: Classes,
    private styler: StyleHandler,
    private computeValue: ComputeValue,
    private pseudo: Pseudo,
    private responsive: Responsive
  ) {}

  public getParentClass(className: string): string[] {
    return Object.keys(this.classes).filter((cssProperty) =>
      Object.prototype.hasOwnProperty.call(
        this.classes[cssProperty as CSSPropertyOrVariable],
        className
      )
    )
  }

  private applyPrefixedStyle(
    prefix: string,
    type: string,
    value: string,
    unit = '',
    secondValue = '',
    secondUnit = '',
    propKey?: CSSPropertyOrVariable
  ): void {
    const pseudoEvents: Record<string, [string, string]> = {
      hover: ['mouseover', 'mouseout'],
      focus: ['focus', 'blur']
    }

    const events = pseudoEvents[prefix]
    if (events) {
      this.pseudo.pseudoHandler(type, value, unit, secondValue, secondUnit, ...events, propKey)
    } else {
      this.responsive.handleResponsive(prefix, type, value, unit, secondValue, secondUnit, propKey)
    }
  }

  public parseDefaultStyle(
    prefix: string | undefined,
    type: string,
    value: string,
    unit = '',
    secondValue = '',
    secondUnit = ''
  ): void {
    prefix
      ? this.applyPrefixedStyle(prefix, type, value, unit, secondValue, secondUnit)
      : this.styler.addStyle(type, value, unit, secondValue, secondUnit)
  }

  public handlePredefinedStyle(type: string, prefix?: string): boolean {
    const properties = this.property[type]
    if (properties && isObjectWithValue(properties)) {
      const value = properties.value || ''
      prefix ? this.applyPrefixedStyle(prefix, type, value, '') : this.styler.addStyle(type)
      return true
    }
    return false
  }

  private parseValuePattern(
    pattern: string,
    inputValue?: string,
    inputUnit?: string,
    inputSecValue?: string,
    inputSecUnit?: string
  ): string {
    if (!pattern.includes('{0}') && !pattern.includes('||')) return pattern

    const [value, defaultValue] = pattern.split('||').map((s) => s.trim())
    const finalValue = this.computeValue.valueHandler('', inputValue, inputUnit)
    const finalSecValue = this.computeValue.valueHandler('', inputSecValue, inputSecUnit)

    // handle both {0} and {1}
    if (pattern.includes('{0}') && pattern.includes('{1')) {
      let computedValue = value
      if (inputValue) {
        computedValue = computedValue.replace('{0}', finalValue)
      }
      if (inputSecValue || pattern.includes('{1')) {
        // find {1 ... } pattern and extract default value if present
        const match = computedValue.match(/{1([^}]*)}/)
        if (match) {
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

  public handleCustomClass(
    prefix: string | undefined,
    type: string,
    inputValue?: string,
    inputUnit?: string,
    inputSecValue?: string,
    inputSecUnit?: string
  ): boolean {
    const propKeys = this.getParentClass(type)
    if (!propKeys.length) return false

    propKeys.forEach((propKey) => {
      const classValue = this.classes[propKey as CSSPropertyOrVariable]
      if (classValue?.[type]) {
        const value = classValue[type]

        const finalValue = this.parseValuePattern(
          value,
          inputValue,
          inputUnit,
          inputSecValue,
          inputSecUnit
        )
        prefix
          ? this.applyPrefixedStyle(
              prefix,
              type,
              finalValue,
              '',
              '',
              '',
              propKey as CSSPropertyOrVariable
            )
          : this.styler.addStyle(type, finalValue, '', '', '', propKey as CSSPropertyOrVariable)
      }
    })
    return true
  }
}
