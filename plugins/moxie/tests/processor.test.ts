import { describe, it, expect, beforeEach } from 'vitest'
import {
  Processor,
  isProcessedValue,
  isUtilityFunction,
  isUtilityConfig,
  extractMatchGroups
} from '../src/lib/processor'
import { createRegexp } from '../src/lib/regexp'

describe('Processor Helper Functions', () => {
  describe('isProcessedValue', () => {
    it('should return true for valid ProcessedValue objects', () => {
      expect(isProcessedValue({ key: 'test', value: 'value' })).toBe(true)
    })

    it('should return false for invalid objects', () => {
      expect(isProcessedValue(null)).toBe(false)
      expect(isProcessedValue({})).toBe(false)
      expect(isProcessedValue({ key: 'test' })).toBe(false)
      expect(isProcessedValue({ value: 'test' })).toBe(false)
      expect(isProcessedValue({ key: 123, value: 'test' })).toBe(false)
    })
  })

  describe('isUtilityFunction', () => {
    it('should return true for functions', () => {
      expect(isUtilityFunction(() => {})).toBe(true)
      expect(isUtilityFunction(function () {})).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isUtilityFunction({})).toBe(false)
      expect(isUtilityFunction('string')).toBe(false)
      expect(isUtilityFunction(null)).toBe(false)
    })
  })

  describe('isUtilityConfig', () => {
    it('should return true for objects with property or value', () => {
      expect(isUtilityConfig({ property: 'test' })).toBe(true)
      expect(isUtilityConfig({ value: 'test' })).toBe(true)
      expect(isUtilityConfig({ property: 'test', value: 'value' })).toBe(true)
    })

    it('should return false for invalid objects', () => {
      expect(isUtilityConfig({})).toBe(false)
      expect(isUtilityConfig(null)).toBe(false)
      expect(isUtilityConfig('string')).toBe(false)
    })
  })

  describe('extractMatchGroups', () => {
    it('should extract groups from RegExp match', () => {
      const match = ['full', 'variant', 'property', 'value'] as RegExpMatchArray
      match.groups = { variant: 'hover', property: 'bg', value: 'red' }

      const result = extractMatchGroups(match)
      expect(result).toEqual({
        variant: 'hover',
        property: 'bg',
        value: 'red'
      })
    })

    it('should handle missing groups', () => {
      const match = ['full'] as RegExpMatchArray
      const result = extractMatchGroups(match)
      expect(result).toEqual({
        variant: undefined,
        property: '',
        value: undefined
      })
    })
  })
})

describe('Processor', () => {
  let processor: Processor

  beforeEach(() => {
    processor = new Processor({
      utilities: {
        bg: 'background-color',
        text: 'color',
        p: 'padding',
        custom: { property: 'custom-prop', value: ['allowed', 'valid'] },
        // different rules format
        r1: '--my-rules',
        r2: ['--my-rules1', '--my-rules2'],
        r3: '--my-rules: red',
        r4: ({ value }) => {
          let rules = `--my-rules: ${value}`

          if (value === '1') return { '--my-rules': value }
          if (value === '1a') return { 'props:--my-rules': value }
          if (value === '2') {
            return {
              property: '--my-rules',
              value
            }
          }
          if (value === '3') {
            return {
              rules: { property: '--my-rules', value }
            }
          }
          if (value === '4') {
            return {
              rules: { '--my-rules': value }
            }
          }
          if (value === '5') {
            return [{ '--my-rules1': 'red' }, '--my-rules2: blue', ['--my-rules3', 'yellow']]
          }
          if (value === '6') {
            return {
              rules: [
                { '--my-rules1': 'red' },
                '--my-rules2: blue',
                [['--my-rules3', '--my-rules4'], 'yellow']
              ]
            }
          }
          if (value === '7') {
            return [
              { property: '--my-rules1', value },
              { property: '--my-rules2', value }
            ]
          }
          if (value === '8') {
            return [{ '--my-rules1': value }, { '--my-rules2': value }]
          }

          return rules
        },
        r5: {
          '--my-rules1': '3',
          '--my-rules2': '1'
        }
      },
      variants: {
        hover: ':hover',
        focus: ':focus',
        // functional variants
        max: ({ value }) => (!value ? null : `@media (max-width: ${value}) { @slot }`),
        supports: ({ value, key }) => (!key ? null : `@supports (${key}: ${value}) { @slot }`)
      }
    })
  })

  describe('processVariant', () => {
    it('should return null for empty variant', () => {
      expect(processor.processVariant('')).toBe(null)
    })

    it('should process arbitrary variants', () => {
      expect(processor.processVariant('[&>*:hover]')).toBe('&>*:hover')
      expect(processor.processVariant('(min-width:768px)')).toBe('min-width:768px')
      expect(processor.processVariant('[@supports_(height:_1vh)_{_@slot_}]')).toBe(
        '@supports (height: 1vh) { @slot }'
      )
    })

    it('should process functional variants', () => {
      expect(processor.processVariant('max-768px')).toBe('@media (max-width: 768px) { @slot }')
      expect(processor.processVariant('max-10rem')).toBe('@media (max-width: 10rem) { @slot }')
      expect(processor.processVariant('max')).toBeNull()
      expect(processor.processVariant('supports')).toBeNull()
      expect(processor.processVariant('supports-10px')).toBeNull()
      expect(processor.processVariant('supports-(height:1vh)')).toBe(
        '@supports (height: 1vh) { @slot }'
      )
    })

    it('should process known variants', () => {
      expect(processor.processVariant('hover')).toBe(':hover')
    })

    it('should return null for unknown variants', () => {
      expect(processor.processVariant('unknown')).toBe(null)
    })
  })

  describe('processValue', () => {
    it('should return raw value when no processing needed', () => {
      expect(processor.processValue('red')).toBe('red')
    })

    it('should process arbitrary values', () => {
      expect(processor.processValue('[10px]')).toBe('10px')
      expect(processor.processValue('(--custom-var)')).toBe('var(--custom-var)')
    })

    it('should handle key-value pairs', () => {
      const result = processor.processValue('[color:red]')
      expect(result).toEqual({ key: 'color', value: 'red' })
    })

    it('should escape underscores in arbitrary values', () => {
      expect(processor.processValue('[font_family_test]')).toBe('font family test')
      expect(processor.processValue('[font\\_family]')).toBe('font_family')
    })
  })

  describe('process', () => {
    it('should process simple utility classes', () => {
      const result = processor.process('bg-red')
      expect(result).toMatchObject({
        use: 'moxie',
        className: 'bg-red',
        rules: { property: 'background-color', value: 'red' },
        variant: null,
        isImportant: false
      })
    })

    it('should handle important modifier', () => {
      const result = processor.process('!bg-red')
      expect(result?.isImportant).toBe(true)

      const result2 = processor.process('bg-red!')
      expect(result2?.isImportant).toBe(true)
    })

    it('should process variants', () => {
      const result = processor.process('hover:bg-red')
      expect(result).toMatchObject({
        variant: ':hover',
        rules: { property: 'background-color', value: 'red' }
      })
    })

    it('should return null for invalid classes', () => {
      expect(processor.process('invalid-class')).toBe(null)
    })

    it('should handle utility configurations with value validation', () => {
      const result = processor.process('custom-allowed')
      expect(result).not.toBe(null)

      const invalidResult = processor.process('custom-notallowed')
      expect(invalidResult).toEqual({
        className: 'custom-notallowed',
        reason: "Value `notallowed` doesn't match the given patterns.",
        rules: null,
        use: 'moxie'
      })
    })

    it('should handle regex-validated utilities', () => {
      const processorWithRegex = new Processor({
        utilities: {
          w: [/^\d+$/, 'width'],
          h: [/^\d+$/, ({ value }) => `height: ${value * 0.25 + 'rem'}`],
          h2: [
            [/^\d+$/, '10px'],
            ({ value }) => `height: ${value === '10px' ? 'red' : value * 0.25 + 'rem'}`
          ],
          h3: {
            property: 'height',
            value: [/^\d+$/, '10px']
          },

          size: ({ value }) => {
            if (!value.match(/^\d+$/))
              return { fail: true, reason: "Value `invalid` doesn't match the input RegExp." }
            const v = value * 0.25 + 'rem'
            return { width: v, height: v }
          }
        }
      })

      expect(processorWithRegex.process('w-100')).not.toBe(null)
      expect(processorWithRegex.process('h-100')).toMatchObject({
        use: 'moxie',
        className: 'h-100',
        rules: `height: ${100 * 0.25 + 'rem'}`
      })
      expect(processorWithRegex.process('h2-100')).toMatchObject({
        use: 'moxie',
        className: 'h2-100',
        rules: `height: ${100 * 0.25 + 'rem'}`
      })
      expect(processorWithRegex.process('h2-10px')).toMatchObject({
        use: 'moxie',
        className: 'h2-10px',
        rules: `height: red`
      })
      expect(processorWithRegex.process('h3-10px')).toMatchObject({
        use: 'moxie',
        className: 'h3-10px',
        rules: {
          property: 'height',
          value: '10px'
        }
      })
      expect(processorWithRegex.process('h3-100')).toMatchObject({
        use: 'moxie',
        className: 'h3-100',
        rules: {
          property: 'height',
          value: '100'
        }
      })
      expect(processorWithRegex.process('size-100')).toMatchObject({
        use: 'moxie',
        className: 'size-100',
        rules: {
          width: '25rem',
          height: '25rem'
        }
      })
      expect(processorWithRegex.process('w-invalid')).toEqual({
        className: 'w-invalid',
        reason: "Value `invalid` doesn't match the given patterns.",
        rules: null,
        use: 'moxie'
      })
      expect(processorWithRegex.process('h-invalid')).toEqual({
        className: 'h-invalid',
        reason: "Value `invalid` doesn't match the given patterns.",
        rules: null,
        use: 'moxie'
      })
      expect(processorWithRegex.process('h2-invalid')).toEqual({
        className: 'h2-invalid',
        reason: "Value `invalid` doesn't match the given patterns.",
        rules: null,
        use: 'moxie'
      })
      expect(processorWithRegex.process('h3-invalid')).toEqual({
        className: 'h3-invalid',
        reason: "Value `invalid` doesn't match the given patterns.",
        rules: null,
        use: 'moxie'
      })
      expect(processorWithRegex.process('size-invalid')).toEqual({
        className: 'size-invalid',
        reason: "Value `invalid` doesn't match the input RegExp.",
        rules: null,
        use: 'moxie'
      })
    })
  })

  describe('processUtilities', () => {
    it('should create error result for string utility with key', () => {
      const context = {
        className: 'test',
        value: { key: 'color', value: 'red' },
        property: 'background',
        variant: null,
        utilities: {},
        raw: [] as any,
        isImportant: false
      }

      const result = processor.processUtilities(context)
      expect(result).toMatchObject({
        use: 'moxie',
        reason: "String utility can't have key, and color is parsed as key!"
      })
    })

    it('should handle utility functions', () => {
      const utilityFn = ({ className, value }: any) => ({
        property: 'test-prop',
        value: value + '-processed'
      })

      const context = {
        className: 'test',
        value: 'input',
        property: utilityFn,
        variant: null,
        utilities: {},
        raw: [] as any,
        isImportant: false
      }

      const result = processor.processUtilities(context)
      expect(result).toMatchObject({
        rules: { property: 'test-prop', value: 'input-processed' }
      })
    })

    it('should handle different return formats', () => {
      expect(processor.process('r1-1')).toMatchObject({
        rules: {
          property: '--my-rules',
          value: '1'
        }
      })
      expect(processor.process('r2-1')).toMatchObject({
        rules: {
          property: ['--my-rules1', '--my-rules2'],
          value: '1'
        }
      })
      expect(processor.process('r3')).toMatchObject({
        rules: '--my-rules: red'
      })
      expect(processor.process('r3-whatever-it-is')).toBeNull()

      /**
       * Functional utilities return test
       */

      // return type: 1 & 4
      expect(processor.process('r4-1')).toMatchObject({
        rules: {
          '--my-rules': '1'
        }
      })
      expect(processor.process('r4-1a')).toMatchObject({
        rules: {
          'props:--my-rules': '1a'
        }
      })
      expect(processor.process('r4-4')).toMatchObject({
        rules: {
          '--my-rules': '4'
        }
      })
      // return type: 2 & 3
      expect(processor.process('r4-2')).toMatchObject({
        rules: {
          property: '--my-rules',
          value: '2'
        }
      })
      expect(processor.process('r4-3')).toMatchObject({
        rules: {
          property: '--my-rules',
          value: '3'
        }
      })
      // return type: 5 & 6
      expect(processor.process('r4-5')).toMatchObject({
        rules: [{ '--my-rules1': 'red' }, '--my-rules2: blue', ['--my-rules3', 'yellow']]
      })
      expect(processor.process('r4-6')).toMatchObject({
        rules: [
          { '--my-rules1': 'red' },
          '--my-rules2: blue',
          [['--my-rules3', '--my-rules4'], 'yellow']
        ]
      })
      expect(processor.process('r4-7')).toMatchObject({
        rules: [
          { property: '--my-rules1', value: '7' },
          { property: '--my-rules2', value: '7' }
        ]
      })

      expect(processor.process('r4-8')).toMatchObject({
        rules: [{ '--my-rules1': '8' }, { '--my-rules2': '8' }]
      })
      expect(processor.process('r5')).toMatchObject({
        rules: { '--my-rules1': '3', '--my-rules2': '1' }
      })
    })
  })
})
