import { TenoxUI } from '../src/index.ts'
import { describe, expect, it } from 'vitest'

describe('regexp', () => {
  let ui = new TenoxUI()
  let defaultPattern = '[\\w.-]+'
  it('should create matcher pattern', () => {
    let pattern = /^(?:(?<variant>[\w.-]+):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    expect(ui.matcher).toStrictEqual(pattern)
    expect(ui.createMatcher(defaultPattern, defaultPattern, defaultPattern)).toStrictEqual(pattern)
    expect(ui.regexp().matcher).toStrictEqual(pattern)
    expect(ui.createMatcher('bg|flex', defaultPattern, defaultPattern)).toStrictEqual(
      /^(?:(?<variant>bg|flex):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    )
  })
  it('should process plugin', () => {
    const regex = /^(?:(?<variant>bg|flex):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    ui = new TenoxUI({
      plugins: [
        {
          name: 'regex-plugin',
          priority: 1,
          regexp({ patterns }) {
            return {
              patterns: {
                variant: patterns.variant + '|bg|flex'
              }
            }
          }
        },
        {
          name: 'regex-plugin2',
          priority: 2,
          regexp: () => ({
            patterns: {
              variant: '4|5'
            }
          })
        }
      ]
    })
    expect(ui.matcher).toStrictEqual(
      /^(?:(?<variant>4|5|bg|flex):)?(?<property>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    )
    expect(
      new TenoxUI({
        plugins: [
          {
            name: 'regex-plugin',
            regexp() {
              return {
                matcher: regex
              }
            }
          }
        ]
      }).matcher
    ).toStrictEqual(regex)
  })
})
