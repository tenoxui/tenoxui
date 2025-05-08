import { is } from 'cssrxp'
import { toKebab } from './toKebab'
import type { CSSProperty } from '@tenoxui/types'
import type { DirectValue, PropertyParamValue } from '@tenoxui/moxie'

export function createColorType(prop: string, value: string, secondValue?: string): DirectValue {
  value = value.replace('current', 'currentColor')
  return secondValue
    ? `value:${prop}: color-mix(in srgb, ${value} ${secondValue}%, transparent); @supports (color: color-mix(in lab, red, red)) { ${prop}: color-mix(in oklab, ${value} ${secondValue}%, transparent); }`
    : `value:${prop}: ${value}`
}

export function createColorTypew(value: string, secondValue?: string) {
  return ['inherit', 'current', 'black', 'white', 'transparent'].includes(value)
    ? value.replace('current', 'currentColor')
    : value.includes('(') && value.endsWith(')')
      ? `${value.slice(0, -1)}${secondValue ? ' / ' + secondValue + '%)' : ')'}`
      : value + secondValue
}

export function processValue(value: string, unit: string, sizing: number = 0.25) {
  let finalValue = is.length.test(value) ? value : value + unit
  if (is.number.test(value + unit)) finalValue = Number(value) * sizing + 'rem'
  return finalValue
}

export function createSizingType(
  property: CSSProperty | CSSProperty[],
  sizing: number,
  valueOnly: boolean = false,
  allowSecondValue: boolean = false,
  allowFraction: boolean = false,
  values: Record<string, string> = {}
): PropertyParamValue {
  return (({ value = '', unit = '', secondValue = '', secondUnit = '', key = '' }) => {
    if (!value || key || (!allowSecondValue && secondValue)) return null

    const finalValue = values[value + unit] || processValue(value, unit, sizing)

    if (allowSecondValue && secondValue) {
      const finalSecondValue = processValue(secondValue, secondUnit, sizing)

      let finalValueFRFR = `${finalValue} ${finalSecondValue}`
      if (allowFraction && is.number.test(value + unit) && is.number.test(secondValue + secondUnit))
        finalValueFRFR = (Number(value) / Number(secondValue)) * 100 + '%'

      return valueOnly
        ? finalValueFRFR
        : 'value:' +
            (Array.isArray(property)
              ? property.map((item) => `${toKebab(item)}: ${finalValueFRFR}`).join(';')
              : `${toKebab(property)}: ${finalValueFRFR}`)
    }

    return valueOnly
      ? finalValue
      : 'value:' +
          (Array.isArray(property)
            ? property.map((item) => `${toKebab(item)}: ${finalValue}`).join(';')
            : `${toKebab(property)}: ${finalValue}`)
  }) as PropertyParamValue
}
