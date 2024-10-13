import { Property, Classes, DefinedValue, GetCSSProperty, CSSPropertyOrVariable } from './types'
import { StyleHandler } from './styleHandler'
import { Responsive } from './responsive'
import { Pseudo } from './pseudoClass'
import { isObjectWithValue } from '../utils/valueObject'

export class ParseStyles {
  private readonly styleAttribute: Property
  private readonly valueRegistry: DefinedValue
  private readonly classes: Classes
  private readonly styler: StyleHandler
  private readonly pseudo: Pseudo
  private readonly responsive: Responsive

  constructor(
    property: Property,
    values: DefinedValue,
    classes: Classes,
    styler: StyleHandler,
    pseudo: Pseudo,
    responsive: Responsive
  ) {
    this.styleAttribute = property
    this.valueRegistry = values
    this.classes = classes
    this.styler = styler
    this.pseudo = pseudo
    this.responsive = responsive
  }

  public getParentClass(className: string): string[] {
    const classObject = this.classes
    const matchingProperties: string[] = []
    for (const cssProperty in classObject) {
      if (
        Object.prototype.hasOwnProperty.call(
          classObject[cssProperty as CSSPropertyOrVariable],
          className as string
        )
      ) {
        matchingProperties.push(cssProperty)
      }
    }
    return matchingProperties
  }

  private applyPrefixedStyle(
    prefix: string,
    type: string,
    value: string,
    unit: string,
    propKey?: CSSPropertyOrVariable
  ): void {
    switch (prefix) {
      case 'hover':
        this.pseudo.pseudoHandler(type, value, unit, 'mouseover', 'mouseout', propKey)
        break
      case 'focus':
        this.pseudo.pseudoHandler(type, value, unit, 'focus', 'blur', propKey)
        break
      default:
        this.responsive.handleResponsive(prefix, type, value, unit, propKey)
    }
  }

  public parseDefaultStyle(
    prefix: string | undefined,
    type: string,
    value: string,
    unit: string | undefined
  ): void {
    if (prefix) {
      this.applyPrefixedStyle(prefix, type, value, unit || '')
    } else {
      this.styler.addStyle(type, value, unit || '')
    }
  }

  public handlePredefinedStyle(type: string, prefix?: string): boolean {
    const properties = this.styleAttribute[type]
    if (properties && isObjectWithValue(properties)) {
      const value = properties.value || ''
      if (prefix) {
        this.applyPrefixedStyle(prefix, type, value, '')
      } else {
        this.styler.addStyle(type)
      }
      return true
    }
    return false
  }

  public handleCustomClass(type: string, prefix?: string): boolean {
    const propKeys = this.getParentClass(type)
    if (propKeys.length > 0) {
      propKeys.forEach((propKey) => {
        const classValue = this.classes[propKey as CSSPropertyOrVariable]
        if (classValue && type in classValue) {
          const value = classValue[type]
          if (prefix) {
            this.applyPrefixedStyle(prefix, type, value, '', propKey as CSSPropertyOrVariable)
          } else {
            this.styler.addStyle(type, value, '', propKey as CSSPropertyOrVariable)
          }
        }
      })
      return true
    }
    return false
  }
}
