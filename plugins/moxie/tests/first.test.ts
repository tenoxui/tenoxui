import { describe, it, expect } from 'vitest'
import { TenoxUI } from '@tenoxui/core'
import { Moxie } from '../src'

describe('Moxie Unit Test', () => {
  let ui = new TenoxUI({
    plugins: [Moxie()]
  })
  const fnui = (config = {}) => new TenoxUI({ plugins: [Moxie()], ...config })

  it('shoudl create correct moxie matcher', () => {
    expect(ui.matcher).toStrictEqual(
      /^(?:(?<variant>[a-zA-Z0-9_\-]+(?:-(?:\[[^\]]+\]|\([^()]*(?:\([^()]*\)[^()]*)*\)|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}))?|\[[^\]]+\]|\([^()]*(?:\([^()]*\)[^()]*)*\)|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}):)?(?<property>\[[^\]]+\]+)(?:-(?<value>-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\([^()]*(?:\([^()]*\)[^()]*)*\)|\$[^\s\/]+|(?:-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\$[^\s\/]+)\/(?:-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\$[^\s\/]+)))?$/
    )
    ui = fnui({ utilities: { bg: '...' } })
    expect(ui.matcher).toStrictEqual(
      /^(?:(?<variant>[a-zA-Z0-9_\-]+(?:-(?:\[[^\]]+\]|\([^()]*(?:\([^()]*\)[^()]*)*\)|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}))?|\[[^\]]+\]|\([^()]*(?:\([^()]*\)[^()]*)*\)|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}):)?(?<property>bg|\[[^\]]+\]+)(?:-(?<value>-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\([^()]*(?:\([^()]*\)[^()]*)*\)|\$[^\s\/]+|(?:-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\$[^\s\/]+)\/(?:-?\d+(?:\.\d+)?|[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|#[0-9a-fA-F]+|\[[^\]]+\]|\$[^\s\/]+)))?$/
    )
  })
  it('should parse with correct moxie parser', () => {
    ui = fnui({ utilities: { bg: '...' } })
    expect(ui.parse('bg-red')).toStrictEqual(['bg-red', undefined, 'bg', 'red'])
    expect(ui.parse('bg-$red')).toStrictEqual(['bg-$red', undefined, 'bg', '$red'])
    expect(ui.parse('bg-[red]')).toStrictEqual(['bg-[red]', undefined, 'bg', '[red]'])
  })
  it('should process data with new version', () => {
    const utilities = {
      bg: 'background',
      m: 'margin'
    }
    const t1 = new TenoxUI({ utilities })
    const t2 = new TenoxUI({ utilities, plugins: [Moxie()] })

    expect(t1.process('bg-red m-10px')).toStrictEqual([
      {
        className: 'bg-red',
        rules: {
          property: 'background',
          type: 'bg'
        },
        value: {
          data: 'red',
          raw: 'red'
        },
        variant: null
      },
      {
        className: 'm-10px',
        rules: { property: 'margin', type: 'm' },
        value: {
          data: '10px',
          raw: '10px'
        },
        variant: null
      }
    ])
    expect(t2.process('bg-red m-10px')).toStrictEqual([
      {
        className: 'bg-red',
        prefix: null,
        rules: {
          property: 'background',
          value: {
            data: 'red',
            raw: 'red'
          }
        }
      },
      {
        className: 'm-10px',
        prefix: null,
        rules: {
          property: 'margin',
          value: {
            data: '10px',
            raw: '10px'
          }
        }
      }
    ])
  })
  it('should process value', () => {
    expect(ui.processValue('$my-var')).toBe('var(--my-var)')
    expect(ui.processValue('[--my-var]')).toBe('var(--my-var)')
    expect(ui.processValue("['my_var']")).toBe("'my var'")
    expect(ui.processValue("['my\\_var']")).toBe("'my_var'")
  })
  it('should process with functional utility', () => {
    ui = fnui({
      utilities: {
        bg(value) {
          const { raw, data } = value
          return {
            property: 'background',
            value: {
              raw,
              data: raw === 'blue' ? 'red' : data
            }
          }
        }
      }
    })
    expect(ui.process('bg-red')).toStrictEqual([
      {
        className: 'bg-red',
        prefix: null,
        rules: {
          property: 'background',
          value: {
            data: 'red',
            raw: 'red'
          }
        }
      }
    ])

    expect(ui.process('bg-blue')).toStrictEqual([
      {
        className: 'bg-blue',
        prefix: null,
        rules: {
          property: 'background',
          value: {
            data: 'red',
            raw: 'blue'
          }
        }
      }
    ])
  })
})
