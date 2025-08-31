import { describe, it, expect } from 'vitest'
import { transform, Moxie } from '../src'
import { TenoxUI } from '@tenoxui/core'

describe('Integration Test', () => {
  const config = {
    utilities: {
      __moxie: {
        r1: '--my-rules',
        r2: ['--my-rules1', '--my-rules2'],
        r3: '--my-rules: red',
        r4: ({ value }) => {
          if (!value) return { '--tenox': '100%' }
          let rules = `--my-rules: ${value}`

          if (value === '1') return { '--my-rules': value }
          if (value === '1a') return { 'props:--my-rules': value }
          if (value === '1b') return { 'props:--my-rules1,--my-rules2': value }
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
          if (value === '4a') {
            return {
              rules: { 'props:--my-rules': value }
            }
          }
          if (value === '4b') {
            return {
              rules: { 'props:--my-rules1,--my-rules2': value }
            }
          }
          if (value === '5') {
            return [{ '--my-rules1': 'red' }, '--my-rules2: blue', ['--my-rules3', 'yellow']]
          }
          if (value === '5a') {
            return [{ 'props:--my-rules1': 'red' }, '--my-rules2: blue', ['--my-rules3', 'yellow']]
          }
          if (value === '5b') {
            return [
              { 'props:--my-rules1,--my-rules1a': 'red' },
              '--my-rules2: blue',
              ['--my-rules3', 'yellow']
            ]
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
          if (value === '6a') {
            return {
              rules: [
                { 'props:--my-rules1': 'red' },
                '--my-rules2: blue',
                [['--my-rules3', '--my-rules4'], 'yellow']
              ]
            }
          }
          if (value === '6b') {
            return {
              rules: [
                { 'props:--my-rules1,--my-rules1a': 'red' },
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
          if (value === '8a') {
            return [{ 'props:--my-rules1': value }, { '--my-rules2': value }]
          }
          if (value === '8b') {
            return [{ 'props:--my-rules1,--my-rules1a': value }, { '--my-rules2': value }]
          }

          return rules
        }
      }
    },
    variants: {
      hover: '&:hover',
      dark: '.dark &',
      max: ({ value }) => (!value ? null : `@media (max-width: ${value}) { @slot }`),
      supports: ({ value, key }) => (!key ? null : `@supports (${key}: ${value}) { @slot }`)
    }
  }

  const main = new TenoxUI({
    ...config,
    plugins: [Moxie({ utilitiesName: '__moxie' })]
  })

  let ui = new TenoxUI({
    ...config,
    plugins: [
      {
        name: 'transform-from-moxie',
        priority: 1,
        transform: (data) => transform(data).rules.join('\n')
      },
      Moxie({ priority: 2, utilitiesName: '__moxie' })
    ]
  })
  it('should transform generated data from TenoxUI', () => {
    expect(ui.process('r1-1')).toBe('.r1-1 { --my-rules: 1 }')
    expect(ui.process('r2-1')).toBe('.r2-1 { --my-rules1: 1; --my-rules2: 1 }')
    expect(ui.process('r3')).toBe('.r3 { --my-rules: red }')
    expect(ui.process('r3-1')).toBeNull() // direct string rules can't have value

    expect(ui.process('r4-10')).toBe('.r4-10 { --my-rules: 10 }')
    expect(ui.process('r4')).toBe('.r4 { --tenox: 100% }')
    expect(ui.process('r4-1')).toBe('.r4-1 { --my-rules: 1 }')
    expect(ui.process('r4-1a')).toBe('.r4-1a { --my-rules: 1a }')
    expect(ui.process('r4-1b')).toBe('.r4-1b { --my-rules1: 1b; --my-rules2: 1b }')
    expect(ui.process('r4-2')).toBe('.r4-2 { --my-rules: 2 }')
    expect(ui.process('r4-3')).toBe('.r4-3 { --my-rules: 3 }')
    expect(ui.process('r4-4')).toBe('.r4-4 { --my-rules: 4 }')
    expect(ui.process('r4-4a')).toBe('.r4-4a { --my-rules: 4a }')
    expect(ui.process('r4-4b')).toBe('.r4-4b { --my-rules1: 4b; --my-rules2: 4b }')
    expect(ui.process('r4-5')).toBe(
      '.r4-5 { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow }'
    )
    expect(ui.process('r4-5a')).toBe(
      '.r4-5a { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow }'
    )
    expect(ui.process('r4-5b')).toBe(
      '.r4-5b { --my-rules1: red; --my-rules1a: red; --my-rules2: blue; --my-rules3: yellow }'
    )
    expect(ui.process('r4-6')).toBe(
      '.r4-6 { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow; --my-rules4: yellow }'
    )
    expect(ui.process('r4-6a')).toBe(
      '.r4-6a { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow; --my-rules4: yellow }'
    )
    expect(ui.process('r4-6b')).toBe(
      '.r4-6b { --my-rules1: red; --my-rules1a: red; --my-rules2: blue; --my-rules3: yellow; --my-rules4: yellow }'
    )
    expect(ui.process('r4-7 r4-8 r4-8a r4-8b')).toBe(
      `.r4-7 { --my-rules1: 7; --my-rules2: 7 }\n.r4-8 { --my-rules1: 8; --my-rules2: 8 }\n.r4-8a { --my-rules1: 8a; --my-rules2: 8a }\n.r4-8b { --my-rules1: 8b; --my-rules1a: 8b; --my-rules2: 8b }`
    )
  })

  it('should handle utility with variant', () => {
    expect(ui.process('hover:r3')).toBe('.hover\\:r3:hover { --my-rules: red }')
    expect(ui.process('dark:r3')).toBe('.dark .dark\\:r3 { --my-rules: red }')
    expect(ui.process('max:r3')[0].variant).toBeNull()
    expect(ui.process('max-768px:r3')).toBe(
      '@media (max-width: 768px) { .max-768px\\:r3 { --my-rules: red } }'
    )
    expect(ui.process('supports-(background:red):r3')).toBe(
      '@supports (background: red) { .supports-\\(background\\:red\\)\\:r3 { --my-rules: red } }'
    )
  })

  it('should process moxie plugin correctly', () => {
    const ui = new TenoxUI({
      utilities: {
        __moxie: {
          bg: 'background',
          m: [
            /^red|center|[-+]?(?:\d*\.\d+|\d+)$/,
            ({ value, raw }) =>
              value === 'red'
                ? 'background'
                : raw[3] === 'center'
                  ? { property: ['alignItems', 'justifyContent'] }
                  : {
                      rules: [{ 'margin,--my-size': value * 0.25 + 'rem' }, 'display: flex']
                    }
          ],
          w: 'width',
          h: 'height',
          xxx: 'this-is-my-holy-prop'
        }
      },
      variants: {
        hover: ':hover',
        focus: ':focus',
        md: '@media (width: 768px)',
        lg: '@media (width: 1024px)',
        max: ({ value }) => `@media (max-width: ${value})`,
        min: ({ value }) => `@media (min-width: ${value})`,
        dark: '@media (prefers-color-scheme: dark)'
      },
      plugins: [
        Moxie({
          utilitiesName: '__moxie',
          priority: 2,
          prefixChars: [':'],
          typeSafelist: ['my-cat'],
          plugins: [
            {
              name: 'process-variants',
              // basic variant plugin implementation
              processVariant(variant) {
                if (variant === 'vx') return '&:hover'
                if (variant === 'dark') return '.dark &'
                if (variant === 'dark:hover') return '.dark &:hover'
                if (variant === 'md:dark:hover')
                  return '@media (max-width: 768px) { .dark @class:hover { @rules } }'
              },
              // custom value processing
              processValue({ value }) {
                if (value && value === 'center') {
                  return 'calc(50%, -50%)'
                }
              },
              // custom utility processing plugin
              processUtilities({
                property,
                value,
                variant,
                className,
                isImportant,
                raw,
                createResult,
                createErrorResult
              }) {
                if (raw[2] === 'xxx') {
                  if (value)
                    return createErrorResult(className, raw[2] + " Utility shouldn't have value")

                  return createResult(className, variant, 'background', 'red', raw, isImportant)
                }
              },
              // custom className processing
              process(className, { createResult }) {
                if (className === 'my-cat') {
                  return createResult(
                    className,
                    null,
                    '',
                    '',
                    [],
                    false,
                    'background: red; display: flex'
                  )
                }
              }
            }
          ]
        }),
        {
          name: 'transform-moxie',
          priority: 1,
          transform: (data) => transform(data).rules.join('\n')
        }
      ]
    })

    expect(
      ui.process([
        'max-768px:bg-red',
        'md:m-red',
        'vx:m-10',
        'dark:bg-red',
        'dark:hover:bg-yellow',
        'md:dark:hover:bg-green',
        'm-center',
        'xxx',
        'xxx-center', // have value, shouldn't do a thing
        'my-cat'
      ])
    ).toBe(`.max-768px\\:bg-red { background: red }
.md\\:m-red { background: red }
.vx\\:m-10:hover { margin: 2.5rem; --my-size: 2.5rem; display: flex }
.dark .dark\\:bg-red { background: red }
.dark .dark\\:hover\\:bg-yellow:hover { background: yellow }
@media (max-width: 768px) { .dark .md\\:dark\\:hover\\:bg-green:hover { background: green } }
.m-center { align-items: calc(50%, -50%); justify-content: calc(50%, -50%) }
.xxx { background: red }
.my-cat { background: red; display: flex }`)
  })
})
