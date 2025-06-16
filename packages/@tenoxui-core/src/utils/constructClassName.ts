export function constructRaw(
  prefix: null | undefined | string,
  type: string,
  value?: null | string,
  unit?: null | string,
  secValue?: null | string,
  secUnit?: null | string
) {
  return `${prefix ? `${prefix}:` : ''}${type}${value ? `-${value}${unit}` : ''}${
    secValue ? `/${secValue}${secUnit}` : ''
  }`
}
