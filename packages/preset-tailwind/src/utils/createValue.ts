import { is } from 'cssrxp'
import { toKebab } from './toKebab'
import type { CSSProperty, CSSPropertyOrVariable } from '@tenoxui/types'
import type { DirectValue, PropertyParamValue } from '@tenoxui/moxie'

export function createColorType(
  prop: CSSPropertyOrVariable | CSSPropertyOrVariable[],
  value: string,
  secondValue?: string
): DirectValue {
  const finalValue = value.replace('current', 'currentColor')

  const normalizeProp = (p: CSSPropertyOrVariable): string =>
    typeof p === 'string' && !p.startsWith('--') ? toKebab(p) : (p as string)

  const props = Array.isArray(prop) ? prop.map(normalizeProp) : [normalizeProp(prop)]

  if (secondValue) {
    const srgbMix = props
      .map((p) => `${p}: color-mix(in srgb, ${finalValue} ${secondValue}%, transparent);`)
      .join('\n')

    const oklabMix = props
      .map((p) => `${p}: color-mix(in oklab, ${finalValue} ${secondValue}%, transparent);`)
      .join('\n')

    return `value:${srgbMix} @supports (color: color-mix(in lab, red, red)) { ${oklabMix} }`
  }

  const plain = props.map((p) => `${p}: ${finalValue}`).join(';')
  return `value:${plain};`
}

export function processValue(value: string, unit: string, sizing: number = 0.25) {
  let finalValue = is.length.test(value) ? value : value + unit
  if (is.number.test(value + unit) && value + unit !== '0')
    finalValue = Number(value) * sizing + 'rem'
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
  return (({ value = '', unit = '', secondValue = '', secondUnit = '', key = '', raw }) => {
    if (!value || key || (!allowSecondValue && secondValue)) return null

    const [, , inVal, inUn] = raw as string[]

    const finalValue = inVal.startsWith('[')
      ? value
      : values[value + unit] || values[inVal + inUn] || processValue(value, unit, sizing)

    if (allowSecondValue && secondValue) {
      const finalSecondValue = processValue(secondValue, secondUnit, sizing)

      let finalValueFRFR = `${finalValue} ${finalSecondValue}`
      if (
        allowFraction &&
        is.number.test(value + unit) &&
        is.number.test(secondValue + secondUnit)
      ) {
        finalValueFRFR = ((Number(value) / Number(secondValue)) * 100).toFixed(2) + '%'
      }

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
