import {
  Property,
  Classes,
  GetCSSProperty,
  CSSPropertyOrVariable,
  CSSVariable,
  CSSProperty
} from './types'
import { StyleHandler } from './styleHandler'
import { ComputeValue } from './computeValue'
import { camelToKebab } from '../utils/converter'
import { isObjectWithValue } from '../utils/valueObject'

export class Pseudo {
  private readonly htmlElement: HTMLElement
  private readonly styleAttribute: Property
  private readonly classes: Classes
  private readonly styler: StyleHandler
  private readonly computeValue: ComputeValue

  constructor(
    element: HTMLElement,
    property: Property,
    classes: Classes,
    computeValue: ComputeValue,
    styler: StyleHandler
  ) {
    this.htmlElement = element
    this.styleAttribute = property
    this.classes = classes
    this.styler = styler
    this.computeValue = computeValue
  }

  private getPropName(type: string, propKey?: CSSPropertyOrVariable): GetCSSProperty | undefined {
    if (type.startsWith('[--') && type.endsWith(']')) {
      return type.slice(1, -1) as CSSVariable
    }
    const property = (this.styleAttribute[type] as any)?.property || this.styleAttribute[type]
    if (propKey && propKey in this.classes) {
      return camelToKebab(propKey as string) as CSSProperty
    } else if (Array.isArray(property)) {
      return property.map(camelToKebab) as CSSProperty[]
    } else if (property) {
      return camelToKebab(property as string) as CSSProperty
    } else {
      return undefined
    }
  }

  private getInitialValue(propsName: GetCSSProperty): { [key: string]: string } | string {
    if (Array.isArray(propsName)) {
      return propsName.reduce(
        (acc, propName) => {
          acc[propName] = this.htmlElement.style.getPropertyValue(propName as string)
          return acc
        },
        {} as { [key: string]: string }
      )
    }

    return this.htmlElement.style.getPropertyValue(propsName as string)
  }

  private revertStyle(
    propsName: GetCSSProperty,
    styleInitValue: { [key: string]: string } | string
  ): void {
    if (Array.isArray(propsName)) {
      propsName.forEach((propName) => {
        this.computeValue.setCssVar(
          propName,
          (styleInitValue as { [key: string]: string })[propName]
        )
      })
    } else {
      this.computeValue.setCssVar(propsName, styleInitValue as string)
    }
  }

  public pseudoHandler(
    type: string,
    value: string,
    unit: string,
    secondValue?: string,
    secondUnit?: string,
    pseudoEvent: string,
    revertEvent: string,
    propKey?: CSSPropertyOrVariable
  ): void {
    const properties = this.styleAttribute[type]
    const propsName = propKey ? this.getPropName('', propKey) : this.getPropName(type)
    if (!propsName) return // Early return if propsName is undefined

    const styleInitValue = this.getInitialValue(propsName)

    const applyStyle = () => {
      if (isObjectWithValue(properties)) {
        if (properties.value.includes('{value}')) {
          this.styler.addStyle(type, value, unit, secon, secondUnit)
        } else {
          this.styler.addStyle(type)
        }
      } else if (
        propKey &&
        propKey in this.classes &&
        typeof this.classes[propKey] === 'object' &&
        this.classes[propKey] !== null &&
        type in (this.classes[propKey] as Record<string, unknown>)
      ) {
        this.styler.addStyle(type, value, '', secondValue, secondUnit, propKey)
      } else {
        this.styler.addStyle(type, value, unit, secondValue, secondUnit)
      }
    }

    const revertStyle = () => this.revertStyle(propsName, styleInitValue)

    this.htmlElement.addEventListener(pseudoEvent, applyStyle)
    this.htmlElement.addEventListener(revertEvent, revertStyle)
  }
}
