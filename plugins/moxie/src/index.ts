import { createRegexp } from './lib/regexp'
import type { Plugin, ProcessUtilitiesContext, CSSPropertyOrVariable } from '@tenoxui/core'
import type {
  UtilityFunctionResult,
  Config,
  ProcessResult,
  Value,
  FnResult,
  FnUtilityContext
} from './types'
import { toKebabCase, escapeSelector } from './utils'

type UtilityFn = (ctx: {
  className?: string
  value?: { raw: string; data: string | null }
  raw?: (undefined | string)[]
  key?: string | null
}) => {
  className?:
    | string
    | {
        raw: string
        full?: string
        prefix?: string
        suffix?: string
      }
  rules?: string
  property?: CSSPropertyOrVariable | CSSPropertyOrVariable[]
  value?: string | { raw: string; data: string | null } | null
} | null

export function Moxie(config: Config = {}): Plugin<ProcessResult> {
  const { values = {}, priority = 0, prefixChars = [], typeSafelist = [], strict = false } = config

  let REGEXP_FN: (className: string) => unknown
  let ALL_VARIANTS

  const replaceWithValueRegistry = (text: string): string => {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      const val = values[key]
      return typeof val === 'string' ? val : match
    })
  }

  const processValue = (rawValue: string): string | { key: string; value: string } => {
    const pattern = /^(?:\(|\[)([^:]+):(.+)(?:\)|\])$/
    let extractedFor: string | null = null
    let value = rawValue || ''
    const matchValue = value.match(pattern)
    if (matchValue) {
      const x = matchValue[2].trim()
      extractedFor = matchValue[1].trim()
      value =
        (rawValue.startsWith('[') && rawValue.endsWith(']')) ||
        (rawValue.startsWith('(') && rawValue.endsWith(')'))
          ? rawValue.startsWith('[')
            ? `[${x}]`
            : `(${x})`
          : x
    }

    const createReturn = (value) =>
      extractedFor
        ? {
            key: extractedFor,
            value
          }
        : value

    if (values[value]) return createReturn(values[value])
    if (value.startsWith('$')) {
      return createReturn(`var(--${value.slice(1)})`)
    }
    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('(') && value.endsWith(')'))
    ) {
      const cleanValue = value
        .slice(1, -1)
        .replace(/\\_/g, 'M0X13C55')
        .replace(/_/g, ' ')
        .replace(/M0X13C55/g, '_')
      if (cleanValue.includes('{')) {
        return createRegexp(replaceWithValueRegistry(cleanValue))
      }
      return createReturn(cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue)
    }
    return createReturn(value)
  }

  return {
    name: 'tenoxui-moxie',
    priority,
    regexp({ utilities }) {
      const { variant, property, value } = createRegexp({
        utilities,
        inputPrefixChars: prefixChars,
        safelist: typeSafelist
      }).patterns

      return {
        patterns: {
          variant,
          property,
          value
        }
      }
    },
    processValue(value: string): string {
      return processValue(value)
    },
    processVariant(variant: string): string {
      const match = variant.match(createRegexp({ utilities: ALL_VARIANTS }).matcher)
      const fn = match && ALL_VARIANTS[match[2]]

      let key = null
      let value = match?.[3]
      const x = processValue(match?.[3])
      if (typeof x === 'object') {
        key = x.key
        value = x.value
      }

      return typeof fn === 'function' ? fn({ key, value }) : undefined
    },

    processUtilities(context: ProcessUtilitiesContext) {
      const { className, value: finalValue, property, variant, utilities, raw } = context
      let value = finalValue
      let key = null
      if (finalValue && typeof finalValue === 'object') {
        value = finalValue.value
        key = finalValue.key
      }

      const createNullObj = (className) => {
        return {
          from: 'moxie',
          className,
          rules: null
        }
      }

      const createData = (className, prefix, property, value, fullRules) => {
        return {
          from: 'moxie',
          className,
          rules: fullRules || {
            property,
            value
          },
          prefix,
          raw
        }
      }

      if (typeof property === 'string' && key) return createNullObj(className)

      let properties = property
      if (
        (raw[2].startsWith('[') && raw[2].endsWith(']')) ||
        (raw[2].startsWith('(') && raw[2].endsWith(')'))
      ) {
        properties = raw[2]
      }

      if (!className || !properties || !utilities) return null

      if (typeof properties === 'string') {
        if (properties.startsWith('[') && properties.endsWith(']')) {
          const props = properties.slice(1, -1).split(',')

          return createData(
            className,
            variant,
            props.length > 1 ? props : properties.slice(1, -1),
            value
          )
        }
      }
      if (typeof properties === 'function') {
        const props = properties({
          className,
          value,
          raw,
          key
        })

        const data = !props
          ? createNullObj(className)
          : createData(
              props.className ? props.className : className,
              variant,
              props.property ? props.property : property,
              props.value || value,
              props.rules
            )

        return data
      }
    },
    process(_, ctx) {
      const { parser, variants } = ctx
      REGEXP_FN = parser
      ALL_VARIANTS = variants
    },
    transform(data) {
      const results = {
        moxie: [],
        rest: []
      }

      const process = (item) => {
        try {
          const { full, raw, prefix = '', suffix } = item.className

          if ((!item.prefix && item.raw?.[1]) || !item.rules) {
            results.rest.push(item)
            return
          }

          const variant = item.prefix || ''

          const rules = `{ ${
            Array.isArray(item.rules)
              ? item.rules.map((item) => `${toKebabCase(item.property)}: ${item.value}`).join('; ')
              : Array.isArray(item.rules.property)
                ? item.rules.property
                    .map((prop) => `${toKebabCase(prop)}: ${item.rules.value}`)
                    .join('; ')
                : typeof item.rules === 'object' && 'property' in item.rules
                  ? `${toKebabCase(item.rules.property)}: ${item.rules.value}`
                  : item.rules
          } }`

          if (variant.includes('&')) {
            const className =
              typeof item.className === 'object'
                ? `${prefix || ''}.${variant.replace(/&/g, escapeSelector(raw))}${suffix}`
                : '.' + variant.replace(/&/g, escapeSelector(item.className))

            results.moxie.push(className + ' ' + rules)
          } else if (variant.includes('@slot')) {
            const className =
              typeof item.className === 'object'
                ? `${prefix || ''}.${escapeSelector(raw)}${suffix}`
                : '.' + escapeSelector(item.className)

            results.moxie.push(variant.replace('@slot', className + ' ' + rules))
          } else if (variant.includes('@class')) {
            if (!variant.includes('@rules')) return null

            const className =
              typeof item.className === 'object'
                ? `${prefix || ''}.${escapeSelector(raw)}${suffix}`
                : '.' + escapeSelector(item.className)

            results.moxie.push(
              variant.replace('@class', className).replace('@rules', rules.slice(1, -1))
            )
          } else {
            const className =
              typeof item.className === 'object'
                ? `${prefix || ''}.${escapeSelector(raw)}${suffix}`
                : '.' + escapeSelector(item.className)

            results.moxie.push(className + ' ' + rules)
          }
        } catch (err) {
          console.error(`Error when transforming ${item.className}`, err)
          results.rest.push(item)
        }
      }

      data.forEach((item) => {
        if (item.from === 'moxie') {
          process(item)
        } else {
          const { className, property, value, variant, raw } = item
          process({
            className,
            rules: { property, value },
            prefix: variant,
            raw
          })
        }
      })

      return results
    }
  }
}

export * from './types'
export * from './lib/regexp'
// export { transform } from './lib/transformer'
export default Moxie
