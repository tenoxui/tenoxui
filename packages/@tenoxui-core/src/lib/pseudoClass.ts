import {
  Property,
  Classes,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSVariable,
  CSSProperty
} from '../types'
import { StyleHandler } from './styleHandler'
import { ComputeValue } from './computeValue'
import { camelToKebab } from '../utils/converter'
import { isObjectWithValue } from '../utils/valueObject'

export class Pseudo {
  constructor(
    private element: HTMLElement,
    private property: Property,
    private classes: Classes,
    private computeValue: ComputeValue,
    private styler: StyleHandler
  ) {}

  private getPropName(type: string, propKey?: CSSPropertyOrVariable): GetCSSProperty | undefined {
    if (type.startsWith('[') && type.endsWith(']')) {
      const properties = type
        .slice(1, -1)
        .split(',')
        .map((p) => p.trim())

      const processProp = (prop: string): CSSProperty | CSSVariable => {
        if (prop.startsWith('--')) return prop as CSSVariable

        const attrProp = this.property[prop]
        if (!attrProp) return prop as CSSProperty

        if (typeof attrProp === 'object' && 'property' in attrProp) {
          return camelToKebab(attrProp.property as string) as CSSProperty
        }
        return camelToKebab(attrProp as string) as CSSProperty
      }

      return properties.length === 1 ? processProp(properties[0]) : properties.map(processProp)
    }

    if (propKey && propKey in this.classes) {
      return camelToKebab(propKey as string) as CSSProperty
    }

    const property = this.property[type]
    if (!property) return undefined

    if (typeof property === 'object' && 'property' in property) {
      return camelToKebab(property.property as string) as CSSProperty
    }

    return Array.isArray(property)
      ? (property.map((prop) => camelToKebab(prop as string)) as CSSProperty[])
      : (camelToKebab(property as string) as CSSProperty)
  }

  private getInitialValue(propsName: GetCSSProperty): { [key: string]: string } | string {
    return Array.isArray(propsName)
      ? propsName.reduce(
          (acc, prop) => {
            acc[prop as string] = this.element.style.getPropertyValue(prop as string)
            return acc
          },
          {} as { [key: string]: string }
        )
      : this.element.style.getPropertyValue(propsName as string)
  }

  private revertStyle(
    propsName: GetCSSProperty,
    styleInitValue: { [key: string]: string } | string
  ): void {
    if (Array.isArray(propsName)) {
      propsName.forEach((prop) =>
        this.computeValue.setStyle(
          prop,
          (styleInitValue as { [key: string]: string })[prop as string]
        )
      )
    } else {
      this.computeValue.setStyle(propsName, styleInitValue as string)
    }
  }

  public pseudoHandler(
    type: string,
    value: string,
    unit: string,
    secondValue?: string,
    secondUnit?: string,
    pseudoEvent?: string,
    revertEvent?: string,
    propKey?: CSSPropertyOrVariable
  ): void {
    const properties = this.property[type]
    const propsName = propKey ? this.getPropName('', propKey) : this.getPropName(type)
    if (!propsName || !pseudoEvent || !revertEvent) return

    const styleInitValue = this.getInitialValue(propsName)

    const applyStyle = () => {
      if (isObjectWithValue(properties)) {
        properties.value.includes('{0}')
          ? this.styler.addStyle(type, value, unit, secondValue, secondUnit)
          : this.styler.addStyle(type)
      } else if (
        propKey &&
        propKey in this.classes &&
        typeof this.classes[propKey] === 'object' &&
        this.classes[propKey] !== null &&
        type in (this.classes[propKey] as Record<string, unknown>)
      ) {
        this.styler.addStyle(type, value, '', '', '', propKey)
      } else {
        this.styler.addStyle(type, value, unit)
      }
    }

    this.element.addEventListener(pseudoEvent, applyStyle)
    this.element.addEventListener(revertEvent, () => this.revertStyle(propsName, styleInitValue))
  }
}
