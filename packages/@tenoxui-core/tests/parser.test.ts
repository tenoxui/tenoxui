import { TenoxUI } from '../src/index.ts'
import { describe, expect, it } from 'vitest'

describe('parser', () => {
  let ui = new TenoxUI({
    utilities: {
      bg: '...',
      m: '...'
    }
  })

  it('should parse something', () => {
    expect(ui.parse('bg-red')).toStrictEqual(['bg-red', undefined, 'bg', 'red'])
    expect(ui.parse('hover:bg-red')).toStrictEqual(['hover:bg-red', 'hover', 'bg', 'red'])
    expect(ui.parse('m-4')).toStrictEqual(['m-4', undefined, 'm', '4'])
    expect(ui.parse('m-4/5')).toBeNull()
  })
  it('should parse with plugin', () => {
    ui = new TenoxUI({
      plugins: [
        {
          name: 'use-regexp-plugin',
          regexp() {
            return {
              patterns: {
                property: 'bg|flex|m'
              }
            }
          }
        }
      ]
    })

    expect(ui.parse('bg-red')).toStrictEqual(['bg-red', undefined, 'bg', 'red'])
    expect(ui.parse('hover:bg-red')).toStrictEqual(['hover:bg-red', 'hover', 'bg', 'red'])
    expect(ui.parse('m-4')).toStrictEqual(['m-4', undefined, 'm', '4'])
    expect(ui.parse('m-4/5')).toBeNull()

    ui = new TenoxUI({
      plugins: [
        {
          name: 'infer-pattern',
          parse(className) {
            const regex =
              /^(?:(?<variant>[\w.-]+):)?(?<property>bg|flex|m)(?:-(?<value>[\w.-]+?))?$/

            const match = className.match(regex)
            console.log(match)
            if (match) {
              const [, a, b, c] = match
              return [className, a, b, c, match.groups]
            }
          }
        }
      ]
    })
    expect(ui.parse('bg-red')).toEqual([
      'bg-red',
      undefined,
      'bg',
      'red',
      {
        variant: undefined,
        property: 'bg',
        value: 'red'
      }
    ])
  })
})
