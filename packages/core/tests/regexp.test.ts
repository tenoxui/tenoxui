import { TenoxUI } from '../src'
import { createMatcher } from '../src/utils'
import { describe, expect, it } from 'vitest'

describe('regexp', () => {
  let ui = new TenoxUI()
  let defaultPattern = '[\\w.-]+'
  it('should create matcher pattern', () => {
    let pattern = /^(?:(?<variant>[\w.-]+):)?(?<utility>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    expect(ui.matcher.regexp).toStrictEqual(pattern)
    expect(createMatcher(defaultPattern, defaultPattern, defaultPattern)).toStrictEqual(pattern)
    expect(ui.regexp().regexp).toStrictEqual(pattern)
    expect(createMatcher('bg|flex', defaultPattern, defaultPattern)).toStrictEqual(
      /^(?:(?<variant>bg|flex):)?(?<utility>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    )
  })
  const regexp = /^(?:(?<variant>bg|flex):)?(?<utility>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
  it('should process plugin', () => {
    ui = new TenoxUI({
      plugins: [
        {
          name: 'regex-plugin',
          priority: 1,
          regexp({ patterns }) {
            return {
              patterns: { variant: patterns.variant + '|bg|flex' }
            }
          }
        },
        {
          name: 'regex-plugin2',
          priority: 2,
          regexp: () => ({
            patterns: { variant: '4|5' }
          })
        }
      ]
    })
    expect(ui.matcher.regexp).toStrictEqual(
      /^(?:(?<variant>4|5|bg|flex):)?(?<utility>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    )
    expect(
      new TenoxUI({
        plugins: [
          {
            name: 'regex-plugin',
            regexp: () => ({ regexp })
          }
        ]
      }).matcher.regexp
    ).toStrictEqual(regexp)
  })
  it('should process plugin with array of string', () => {
    ui = new TenoxUI({
      plugins: [
        {
          name: 'regex-plugin',
          priority: 1,
          regexp({ patterns }) {
            return {
              patterns: { variant: [patterns.variant, 'bg', 'flex'] }
            }
          }
        },
        {
          name: 'regex-plugin2',
          priority: 2,
          regexp: () => ({
            patterns: { variant: ['4', '5'] }
          })
        }
      ]
    })
    expect(ui.matcher.regexp).toStrictEqual(
      /^(?:(?<variant>4|5|bg|flex):)?(?<utility>[\w.-]+)(?:-(?<value>[\w.-]+?))?$/
    )
    expect(
      new TenoxUI({
        plugins: [
          {
            name: 'regex-plugin',
            regexp: () => ({ regexp })
          }
        ]
      }).matcher.regexp
    ).toStrictEqual(regexp)
  })
})
