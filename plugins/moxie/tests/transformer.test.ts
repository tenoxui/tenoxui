import { describe, it, expect } from 'vitest'
import { transform } from '../src/lib/transformer'
import type { ProcessResult } from '../src/types'

describe('Transformer', () => {
  it('should transform basic process results', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'bg-red',
        rules: { property: 'background-color', value: 'red' },
        variant: null,
        isImportant: false,
        raw: ['bg-red', '', 'bg', 'red'] as RegExpMatchArray
      },
      {
        use: 'moxie',
        className: {
          raw: 'bg-red',
          suffix: ' + *'
        },
        rules: { property: 'background-color', value: 'red' },
        variant: '&:hover',
        isImportant: false,
        raw: ['bg-red', '', 'bg', 'red'] as RegExpMatchArray
      },
      {
        use: 'moxie',
        className: {
          raw: 'bg-red',
          suffix: ' + *',
          prefix: 'body '
        },
        rules: { property: 'background-color', value: 'red' },
        variant: '&:hover',
        isImportant: false,
        raw: ['bg-red', '', 'bg', 'red'] as RegExpMatchArray
      },
      {
        use: 'moxie',
        className: {
          raw: 'bg-red',
          suffix: ' + *.bg-red',
          prefix: 'body '
        },
        rules: { property: 'background-color', value: 'red' },
        variant: '&:hover',
        isImportant: false,
        raw: ['bg-red', '', 'bg', 'red'] as RegExpMatchArray
      },
      {
        use: 'moxie',
        className: { suffix: ' + *' },
        rules: { property: 'background-color', value: 'red' },
        variant: '&:hover',
        isImportant: false,
        raw: ['hover:bg-red', '', 'bg', 'red'] as RegExpMatchArray
      },
      {
        use: 'moxie',
        className: { suffix: ' + *', prefix: '.moxie ' },
        rules: { property: 'background-color', value: 'red' },
        variant: '&:hover',
        isImportant: false,
        raw: ['hover:bg-red', '', 'bg', 'red'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(6)
    expect(result.rules[0]).toContain('.bg-red')
    expect(result.rules[0]).toContain('background-color: red')
    expect(result.rules[1]).toContain('.bg-red:hover + *')
    expect(result.rules[2]).toContain('body .bg-red:hover + *')
    expect(result.rules[3]).toContain('body .bg-red:hover + *.bg-red:hover')
    expect(result.rules[4]).toContain('.hover\\:bg-red:hover + *')
    expect(result.rules[5]).toContain('.moxie .hover\\:bg-red:hover + *')
    expect(result.invalid.moxie).toHaveLength(0)
  })

  it('should transform results with variants', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'hover:bg-blue',
        rules: { property: 'background-color', value: 'blue' },
        variant: '&:hover',
        isImportant: false,
        raw: ['hover:bg-blue', 'hover', 'bg', 'blue'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(1)
    expect(result.rules[0]).toContain(':hover')
    expect(result.rules[0]).toBe('.hover\\:bg-blue:hover { background-color: blue }')
  })

  it('should handle important rules', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: '!bg-red',
        rules: { property: 'background-color', value: 'red' },
        variant: null,
        isImportant: true,
        raw: ['!bg-red', '', 'bg', 'red'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules[0]).toContain('!important')
  })

  it('should handle invalid results', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'invalid',
        rules: null,
        variant: null,
        isImportant: false,
        raw: ['invalid'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(0)
    expect(result.invalid.moxie).toHaveLength(1)
  })

  it('should handle results with variant prefix but no variant', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'unknown:bg-red',
        rules: { property: 'background-color', value: 'red' },
        variant: null,
        isImportant: false,
        raw: ['unknown:bg-red', 'unknown', 'bg', 'red'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(0)
    expect(result.invalid.moxie).toHaveLength(1)
  })

  it('should handle non-moxie results', () => {
    const input: ProcessResult[] = [
      {
        use: 'other',
        className: 'other-class',
        rules: { property: 'color', value: 'blue' },
        variant: null,
        isImportant: false,
        raw: [] as RegExpMatchArray
      } as any
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(0)
    expect(result.invalid.rest).toHaveLength(1)
  })

  it('should handle string rules', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'custom',
        rules: 'color: red; background: blue;',
        variant: null,
        isImportant: false,
        raw: ['custom'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(1)
    expect(result.rules[0]).toContain('.custom { color: red; background: blue }')
  })

  it('should handle array property rules', () => {
    const input: ProcessResult[] = [
      {
        use: 'moxie',
        className: 'multi',
        rules: { property: ['margin-top', 'margin-bottom'], value: '10px' },
        variant: null,
        isImportant: false,
        raw: ['multi'] as RegExpMatchArray
      }
    ]

    const result = transform(input)

    expect(result.rules).toHaveLength(1)
    expect(result.rules[0]).toContain('margin-top: 10px')
    expect(result.rules[0]).toContain('margin-bottom: 10px')
  })
})
