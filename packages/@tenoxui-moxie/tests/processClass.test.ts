import { describe, it, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Value Processor', () => {
  it('should process basic shorthand', () => {
    const ui = new Moxie({
      property: {
        bg: 'background',
        size: ['width', 'height']
      },
      values: {
        primary: '#ccf654'
      }
    })

    expect(ui.process('bg-red')[0].cssRules).toBe('background')
    expect(ui.process('bg-red')[0].value).toBe('red')
    expect(ui.process('bg-primary')[0].value).toBe('#ccf654')
    expect(ui.process('bg-(rgb(255_0_0))')[0].value).toBe('rgb(255 0 0)')
    expect(ui.process('bg-$color')[0].value).toBe('var(--color)')
    expect(ui.process('bg-(--color)')[0].value).toBe('var(--color)')
    expect(ui.process('size-100px')[0].cssRules).toStrictEqual(['width', 'height'])
    expect(ui.process('size-100px')[0].value).toBe('100px')
    expect(ui.process('hover:size-100px')[0].prefix).toBe('hover')
  })

  it('should parse classes from `this.classes`', () => {
    const ui = new Moxie({
      property: {
        h: '...'
      },
      classes: {
        display: {
          flex: 'flex'
        }
      }
    })

    expect(ui.process('flex')[0].cssRules).toBe('display: flex')
    expect(ui.process('hover:flex')[0].cssRules).toBe('display: flex')
    expect(ui.process('hover:flex')[0].prefix).toBe('hover')
  })

  it('should parse classes from `this.classes`, but with custom value', () => {
    const ui = new Moxie({
      property: {
        h: '...'
      },
      classes: {
        display: {
          flex: '{0} || flex'
        },
        '--bg-opacity': { bg: '{1}% || 1' },
        backgroundColor: {
          bg: 'rgb({0} / var(--bg-opacity)) || red'
        }
      },
      values: {
        'red-500': '255 0 0'
      }
    })

    expect(ui.process('flex-block')[0].cssRules).toBe('display: block')
    expect(ui.process('hover:flex-inline-flex')[0].cssRules).toBe('display: inline-flex')
    expect(ui.process('bg')[0].cssRules).toBe('--bg-opacity: 1; background-color: red')
    expect(ui.process('bg-red-500')[0].cssRules).toBe(
      '--bg-opacity: 1; background-color: rgb(255 0 0 / var(--bg-opacity))'
    )
    expect(ui.process('bg-(255_0_0)')[0].cssRules).toBe(
      '--bg-opacity: 1; background-color: rgb(255 0 0 / var(--bg-opacity))'
    )
    expect(ui.process('bg-[255_0_0]')[0].cssRules).toBe(
      '--bg-opacity: 1; background-color: 255 0 0'
    )
    expect(ui.process('bg-[255_0_0]/30')[0].cssRules).toBe(
      '--bg-opacity: 30%; background-color: 255 0 0'
    )
    expect(ui.process('bg-[255_0_0]/[3000%]')[0].cssRules).toBe(
      '--bg-opacity: 3000%; background-color: 255 0 0'
    )
    expect(ui.process('bg-[255_0_0]/(3000%)')[0].cssRules).toBe(
      '--bg-opacity: 3000%%; background-color: 255 0 0'
    )
  })

  it('should parse shorthand and apply value based on keys', () => {
    const ui = new Moxie({
      property: {
        ui: ({ key }) => key,
        p: {
          property: ({ key }) => {
            const keys = {
              x: 'paddingInline',
              t: 'paddingTop'
            }

            return keys[key] || 'padding'
          }
        },
        m: {
          property: ({ key }) => {
            const keys = {
              x: 'marginInline',
              t: 'marginTop'
            }

            return keys[key] || 'margin'
          },
          value: ({ value, unit }) => {
            return !isNaN(value + unit) ? 0.25 * Number(value) + 'rem' : value + unit
          }
        },
        top: {
          property: ({ value, unit }) => {
            return `value:top: ${
              !isNaN(value + unit) ? 0.25 * Number(value) + 'rem' : value + unit
            }`
          }
        }
      },
      values: {
        md: '100px'
      }
    })

    expect(ui.process('ui-(color:red)')[0].cssRules).toBe('color')
    expect(ui.process('ui-(color:red)')[0].value).toBe('red')
    expect(ui.process('p-1rem')[0].cssRules).toBe('padding')
    expect(ui.process('p-1rem')[0].value).toBe('1rem')
    expect(ui.process('p-(x:1rem)')[0].cssRules).toBe('padding-inline')
    expect(ui.process('p-(x:20px)')[0].value).toBe('20px')
    expect(ui.process('p-md')[0].value).toBe('100px')
    expect(ui.process('p-({md})')[0].value).toBe('100px')
    expect(ui.process('p-(x:{md})')[0].value).toBe('100px')
    expect(ui.process('p-(x:calc({md}_*_2))')[0].value).toBe('calc(100px * 2)')
    expect(ui.process('m-md')[0].value).toBe('100px')
    expect(ui.process('m-({md})')[0].value).toBe('100px')
    expect(ui.process('m-[{md}]')[0].value).toBe('100px')
    expect(ui.process('m-[t:{md}]')[0].value).toBe('100px')
    expect(ui.process('m-[t:{md}]')[0].cssRules).toBe('margin-top')
    expect(ui.process('m-[t:101px]')[0].value).toBe('101px')
    expect(ui.process('m-[30px]')[0].value).toBe('30px')
    expect(ui.process('m-4')[0].value).toBe('1rem')
    expect(ui.process('m-8')[0].value).toBe('2rem')
    expect(ui.process('m-3.5')[0].value).toBe('0.875rem')
    expect(ui.process('top-3.5')[0].value).toBe(null)
    expect(ui.process('top-100px')[0].cssRules).toBe('top: 100px')
    expect(ui.process('top-4')[0].cssRules).toBe('top: 1rem')
    expect(ui.process('top-50%')[0].cssRules).toBe('top: 50%')
  })
})
