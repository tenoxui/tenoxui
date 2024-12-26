import { Property, Classes, CSSPropertyOrVariable } from '../types'
import { StyleHandler } from './styleHandler'
import { Responsive } from './responsive'
import { Pseudo } from './pseudoClass'
import { isObjectWithValue } from '../utils/valueObject'

export class ParseStyles {
  constructor(
    private property: Property,
    private classes: Classes,
    private styler: StyleHandler,
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

  private parseValuePattern(pattern: string, inputValue?: string, inputUnit?: string): string {
    if (!pattern.includes('{0}')) return pattern

    const [value, defaultValue] = pattern.split('||').map((s) => s.trim())
    return inputValue ? value.replace('{0}', inputValue + inputUnit) : defaultValue || value
  }

  public handleCustomClass(
    prefix: string | undefined,
    type: string,
    inputValue?: string,
    inputUnit?: string
  ): boolean {
    const propKeys = this.getParentClass(type)
    if (!propKeys.length) return false

    propKeys.forEach((propKey) => {
      const classValue = this.classes[propKey as CSSPropertyOrVariable]
      if (classValue?.[type]) {
        const value = classValue[type]

        const computeValue = this.parseValuePattern(value, inputValue, inputUnit)

        // if (value.includes('||')) console.log(value)
        prefix
          ? this.applyPrefixedStyle(
              prefix,
              type,
              computeValue,
              '',
              '',
              '',
              propKey as CSSPropertyOrVariable
            )
          : this.styler.addStyle(type, computeValue, '', '', '', propKey as CSSPropertyOrVariable)
      }
    })
    return true
  }
}
