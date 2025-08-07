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
          let rules = `--my-rules: ${value}`

          if (value === '1') return { '--my-rules': value }
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
    expect(ui.process('r4-1')).toBe('.r4-1 { --my-rules: 1 }')
    expect(ui.process('r4-2')).toBe('.r4-2 { --my-rules: 2 }')
    expect(ui.process('r4-3')).toBe('.r4-3 { --my-rules: 3 }')
    expect(ui.process('r4-4')).toBe('.r4-4 { --my-rules: 4 }')
    expect(ui.process('r4-5')).toBe(
      '.r4-5 { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow }'
    )
    expect(ui.process('r4-6')).toBe(
      '.r4-6 { --my-rules1: red; --my-rules2: blue; --my-rules3: yellow; --my-rules4: yellow }'
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
})
