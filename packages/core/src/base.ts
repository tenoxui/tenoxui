// base.ts
import {
  GetCSSProperty,
  MakeTenoxUIParams,
  CSSPropertyOrVariable,
  CSSVariable,
  CSSProperty,
  Breakpoint
} from './lib/types'
import { camelToKebab } from './utils/converter'
import { isObjectWithValue } from './utils/valueObject'

// Type guard for property with value

type ParsedClassName = [
  string | undefined, // prefix
  string, // type
  string | undefined, // value
  string | undefined, // unit
  string | undefined, // secValue
  string | undefined // secUnit
]

export class ComputeValue {
  protected readonly config: Required<MakeTenoxUIParams>

  constructor({
    element,
    property = {},
    values = {},
    classes = {},
    breakpoints = []
  }: MakeTenoxUIParams) {
    this.config = {
      element,
      property,
      values,
      classes,
      breakpoints
    }
  }
  getConfig() {
    return this.config
  }
  public valueHandler(type: string, value: string, unit: string): string {
    if (!type || !value) return ''

    const property = this.config.property[type]
    const registryValue = this.config.values[value] as string
    let resolvedValue = registryValue || value

    // Handle unit case
    if (unit && (value + unit).length !== value.length) {
      return value + unit
    }

    // Handle predefined property value
    if (isObjectWithValue(property) && property.value && !property.value.includes('{0}')) {
      return property.value
    }

    // Handle CSS variables
    if (resolvedValue.startsWith('$')) {
      return `var(--${resolvedValue.slice(1)})`
    }

    // Handle bracket notation values
    if (resolvedValue.startsWith('[') && resolvedValue.endsWith(']')) {
      const cleanValue = resolvedValue.slice(1, -1).replace(/_/g, ' ')
      return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
    }

    // Check type registry
    const typeRegistry = this.config.values[type]
    if (typeRegistry && typeof typeRegistry === 'object') {
      resolvedValue = typeRegistry[value] || resolvedValue
    }

    return resolvedValue + unit
  }

  protected setStyle(property: CSSPropertyOrVariable, value: string): void {
    if (!property || !value) return

    if ((property as CSSVariable).startsWith('--')) {
      this.config.element.style.setProperty(property as CSSVariable, value)
    } else {
      this.config.element.style[property as CSSProperty] = value
    }
  }

  protected setCustomValue(
    { property, value: template }: { property: GetCSSProperty; value?: string },
    value: string,
    secondValue: string = ''
  ): void {
    if (!property) return

    const finalValue = template
      ? template.replace(/\{0}/g, value).replace(/\{1}/g, secondValue)
      : value

    if (Array.isArray(property)) {
      property.forEach((prop) => this.setStyle(prop, finalValue))
    } else {
      this.setStyle(property, finalValue)
    }
  }

  protected setDefaultValue(property: GetCSSProperty, value: string): void {
    if (!property || !value) return

    if (Array.isArray(property)) {
      property.forEach((prop) => this.setStyle(prop, value))
    } else {
      this.setStyle(property, value)
    }
  }
}

export class StyleHandler extends ComputeValue {
  private readonly isInitialLoad: WeakMap<HTMLElement, boolean>

  constructor(config: MakeTenoxUIParams) {
    super(config)
    this.isInitialLoad = new WeakMap()
    this.isInitialLoad.set(this.config.element, true)
  }

  private handleTransitionProperty(
    property: 'transition' | 'transitionDuration',
    value: string
  ): void {
    const isInitial = this.isInitialLoad.get(this.config.element)

    if (!isInitial) {
      this.config.element.style[property] = value
      return
    }

    this.config.element.style.transition = 'none'
    this.config.element.style.transitionDuration = '0s'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.config.element.style.transition = ''
        this.config.element.style.transitionDuration = ''
        this.config.element.style[property] = value
        this.isInitialLoad.set(this.config.element, false)
      })
    })
  }

  private handleCustomClass(type: string, resolvedValue: string, secondValue: string): void {
    const items = type
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    items.forEach((item) => {
      const propertyDef = this.config.property[item]

      if (item.startsWith('--')) {
        this.setStyle(item as CSSVariable, resolvedValue)
      } else if (propertyDef) {
        if (isObjectWithValue(propertyDef)) {
          this.setCustomValue(propertyDef, resolvedValue, secondValue)
        } else {
          this.setDefaultValue(propertyDef as CSSProperty, resolvedValue)
        }
      } else {
        this.setDefaultValue(item as CSSProperty, resolvedValue)
      }
    })
  }

  public addStyle(
    type: string,
    value?: string,
    unit?: string,
    secondValue?: string,
    secondUnit?: string,
    classProp?: CSSPropertyOrVariable
  ): void {
    if (!type) return

    const propertyDef = this.config.property[type]

    // Handle class-based styles
    if (classProp && value && this.config.classes[classProp]) {
      this.setStyle(classProp, value)
      return
    }

    // Handle custom value property without explicit value
    if (!value && isObjectWithValue(propertyDef)) {
      value = propertyDef.value
    }

    if (!value) return

    const resolvedValue = this.valueHandler(type, value, unit || '')
    const resolvedSecondValue = secondValue
      ? this.valueHandler(type, secondValue, secondUnit || '')
      : ''

    // Handle transition properties
    if (propertyDef === 'transition' || propertyDef === 'transitionDuration') {
      this.handleTransitionProperty(propertyDef, resolvedValue)
      return
    }

    // Handle CSS variables
    if (type.startsWith('[') && type.endsWith(']')) {
      this.handleCustomClass(type, resolvedValue, resolvedSecondValue)
      return
    }

    // Handle custom value properties
    if (isObjectWithValue(propertyDef)) {
      this.setCustomValue(propertyDef, resolvedValue, resolvedSecondValue)
      return
    }

    // Handle default properties
    if (propertyDef) {
      this.setDefaultValue(propertyDef as CSSProperty, resolvedValue)
    }
  }
}

export class PseudoHandler extends StyleHandler {
  private getPropName(type: string, propKey?: CSSPropertyOrVariable): GetCSSProperty | undefined {
    if (!type && !propKey) return undefined

    if (type.startsWith('[') && type.endsWith(']')) {
      const properties = type
        .slice(1, -1)
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)

      const processProp = (prop: string): CSSProperty | CSSVariable => {
        if (prop.startsWith('--')) return prop as CSSVariable

        const attrProp = this.config.property[prop]
        if (!attrProp) return prop as CSSProperty

        if (isObjectWithValue(attrProp)) {
          return camelToKebab(attrProp.property as string) as CSSProperty
        }
        return camelToKebab(attrProp as string) as CSSProperty
      }

      return properties.length === 1 ? processProp(properties[0]) : properties.map(processProp)
    }

    if (propKey && propKey in this.config.classes) {
      return camelToKebab(propKey as string) as CSSProperty
    }

    const property = this.config.property[type]
    if (!property) return undefined

    if (isObjectWithValue(property)) {
      return camelToKebab(property.property as string) as CSSProperty
    }

    return Array.isArray(property)
      ? (property.map((prop) => camelToKebab(prop as string)) as CSSProperty[])
      : (camelToKebab(property as string) as CSSProperty)
  }

  private getInitialValue(propsName: GetCSSProperty): Record<string, string> | string {
    if (!propsName) return ''

    return Array.isArray(propsName)
      ? propsName.reduce(
          (acc, prop) => {
            acc[prop] = this.config.element.style.getPropertyValue(prop as string)
            return acc
          },
          {} as Record<string, string>
        )
      : this.config.element.style.getPropertyValue(propsName as string)
  }

  private revertStyle(
    propsName: GetCSSProperty,
    styleInitValue: Record<string, string> | string
  ): void {
    if (!propsName) return

    if (Array.isArray(propsName)) {
      propsName.forEach((prop) =>
        this.setStyle(prop, (styleInitValue as Record<string, string>)[prop])
      )
    } else {
      this.setStyle(propsName, styleInitValue as string)
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
    if (!type || !pseudoEvent || !revertEvent) return

    const properties = this.config.property[type]
    const propsName = propKey ? this.getPropName('', propKey) : this.getPropName(type)
    if (!propsName) return

    const styleInitValue = this.getInitialValue(propsName)

    const applyStyle = () => {
      if (isObjectWithValue(properties)) {
        properties.value?.includes('{0}')
          ? this.addStyle(type, value, unit, secondValue, secondUnit)
          : this.addStyle(type)
      } else if (
        propKey &&
        propKey in this.config.classes &&
        typeof this.config.classes[propKey] === 'object' &&
        this.config.classes[propKey] !== null &&
        type in (this.config.classes[propKey] as Record<string, string>)
      ) {
        this.addStyle(type, value, '', '', '', propKey)
      } else {
        this.addStyle(type, value, unit)
      }
    }

    this.config.element.addEventListener(pseudoEvent, applyStyle)
    this.config.element.addEventListener(revertEvent, () =>
      this.revertStyle(propsName, styleInitValue)
    )
  }
}

export class Responsive extends StyleHandler {
  private matchBreakpoint(breakpoint: Breakpoint, prefix: string, width: number): boolean {
    if (!breakpoint || breakpoint.name !== prefix) return false

    const { min, max } = breakpoint

    if (min !== undefined && max !== undefined) return width >= min && width <= max
    if (min !== undefined) return width >= min
    if (max !== undefined) return width <= max

    return false
  }

  public handleResponsive(
    breakpointPrefix: string,
    type: string,
    value: string,
    unit: string,
    secondValue = '',
    secondUnit = '',
    propKey?: CSSPropertyOrVariable
  ): void {
    if (!breakpointPrefix || !type) return

    const properties = this.config.property[type]

    const applyStyle = () => {
      if (isObjectWithValue(properties)) {
        this.addStyle(type)
      } else if (propKey && this.config.classes[propKey]) {
        this.addStyle(type, value, unit, secondValue, secondUnit, propKey)
      } else {
        this.addStyle(type, value, unit, secondValue, secondUnit)
      }
    }

    const handleResize = () => {
      const windowWidth = window.innerWidth
      const matchPoint = this.config.breakpoints.find((bp) =>
        this.matchBreakpoint(bp, breakpointPrefix, windowWidth)
      )

      if (matchPoint) {
        applyStyle()
      } else {
        this.config.element?.style.setProperty(type, '')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
  }
}

export class ParseStyles {
  private readonly config: Required<MakeTenoxUIParams>
  private readonly responsive: Responsive
  private readonly pseudo: PseudoHandler
  private readonly styler: StyleHandler

  constructor(config: MakeTenoxUIParams) {
    this.config = {
      element: config.element,
      property: config.property ?? {},
      values: config.values ?? {},
      breakpoints: config.breakpoints ?? [],
      classes: config.classes ?? {}
    }

    this.responsive = new Responsive(this.config)
    this.pseudo = new PseudoHandler(this.config)
    this.styler = new StyleHandler(this.config)
  }

  parseClassName(className: string): ParsedClassName | null {
    if (!className) return null

    const typePrefixes = Object.keys(this.config.property)
      .sort((a, b) => b.length - a.length)
      .join('|')

    const classNameRegEx = new RegExp(
      `(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
    )

    const match = className.match(classNameRegEx)
    if (!match) return null

    const [, prefix, type, value, unit, secValue, secUnit] = match
    return [prefix, type, value, unit, secValue, secUnit]
  }

  public getParentClass(className: string): CSSPropertyOrVariable[] {
    if (!className) return []

    return Object.keys(this.config.classes).filter((cssProperty) => {
      const classConfig = this.config.classes[cssProperty as CSSPropertyOrVariable]
      return classConfig && Object.prototype.hasOwnProperty.call(classConfig, className)
    }) as CSSPropertyOrVariable[]
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
    if (!prefix || !type) return

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
    if (!type || !value) return

    if (prefix) {
      this.applyPrefixedStyle(prefix, type, value, unit, secondValue, secondUnit)
    } else {
      this.styler.addStyle(type, value, unit, secondValue, secondUnit)
    }
  }

  public handlePredefinedStyle(type: string, prefix?: string): boolean {
    if (!type) return false

    const properties = this.config.property[type]
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
    if (!type) return false

    const propKeys = this.getParentClass(type)
    if (!propKeys.length) return false

    propKeys.forEach((propKey) => {
      const classValue = this.config.classes[propKey]
      if (classValue && type in classValue) {
        const value = classValue[type]
        if (prefix) {
          this.applyPrefixedStyle(prefix, type, value, '', '', '', propKey)
        } else {
          this.styler.addStyle(type, value, '', '', '', propKey)
        }
      }
    })
    return true
  }
}
