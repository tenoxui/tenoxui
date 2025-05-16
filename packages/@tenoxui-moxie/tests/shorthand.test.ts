import { describe, it, expect } from 'vitest'
import { TenoxUI as Moxie, escapeCSSSelector } from '../src/index.ts'

describe('Value Processor', () => {
  it('should process direct CSS properties or variables', () => {
    const ui = new Moxie()
    expect(ui.processShorthand('[color]')).toBe(null)
    expect(ui.processShorthand('[color]', 'red').cssRules).toBe('color')
    expect(ui.processShorthand('[color]', 'red', '', '', '3')).toBe(null)
    expect(ui.processShorthand('[backgroundColor]', 'red').cssRules).toBe('background-color')
    expect(ui.processShorthand('[width,height]', 'red').cssRules).toStrictEqual(['width', 'height'])
    expect(ui.processShorthand('[--my-color]', 'red').cssRules).toBe('--my-color')
    expect(ui.processShorthand('[--myColor,color]', 'red').cssRules).toStrictEqual([
      '--myColor',
      'color'
    ])
  })

  it('should process basic shorthand', () => {
    const ui = new Moxie({
      property: {
        p: 'padding',
        size: ['width', 'height'],
        'my-color': '--my-color'
      }
    })

    expect(ui.processShorthand('p', '20', 'px')).toStrictEqual({
      className: 'p-20px',
      cssRules: 'padding',
      value: '20px',
      prefix: undefined
    })
    expect(ui.processShorthand('size', '4', 'rem')).toStrictEqual({
      className: 'size-4rem',
      cssRules: ['width', 'height'],
      value: '4rem',
      prefix: undefined
    })
    expect(ui.processShorthand('my-color', 'red', '', 'hover')).toStrictEqual({
      className: 'hover:my-color-red',
      cssRules: '--my-color',
      value: 'red',
      prefix: 'hover'
    })
  })

  it('should process basic shorthand with custom value', () => {
    const ui = new Moxie({
      property: {
        p: {
          property: 'padding'
          // value: '{0}'
        },
        m: {
          property: 'margin',
          value: '{0}px',
          group: 'size'
        },
        bg: {
          property: 'background',
          value: 'rgb({0}) || red'
        },
        m2: {
          property: 'margin',
          value: '5rem'
        }
      },
      values: {
        md: '2rem',
        size: {
          md: '1rem'
        }
      }
    })

    expect(ui.processShorthand('bg')).toStrictEqual({
      className: 'bg',
      cssRules: 'background',
      value: 'red',
      prefix: undefined
    })
    expect(ui.processShorthand('bg', '(255_0_0)')).toStrictEqual({
      className: 'bg-(255_0_0)',
      cssRules: 'background',
      value: 'rgb(255 0 0)',
      prefix: undefined
    })
    expect(ui.processShorthand('bg', '[oklch(...)]')).toStrictEqual({
      className: 'bg-[oklch(...)]',
      cssRules: 'background',
      value: 'oklch(...)',
      prefix: undefined
    })
    expect(ui.processShorthand('p', '20', 'px')).toStrictEqual({
      className: 'p-20px',
      cssRules: 'padding',
      value: '20px',
      prefix: undefined
    })
    expect(ui.processShorthand('p', 'md', '', 'hover')).toStrictEqual({
      className: 'hover:p-md',
      cssRules: 'padding',
      value: '2rem',
      prefix: 'hover'
    })
    expect(ui.processShorthand('m', '4')).toStrictEqual({
      className: 'm-4',
      cssRules: 'margin',
      value: '4px',
      prefix: undefined
    })
    expect(ui.processShorthand('m2')).toStrictEqual({
      className: 'm2',
      cssRules: 'margin',
      value: '5rem',
      prefix: undefined
    })
    expect(ui.processShorthand('m2', '4')).toBe(null)
  })

  it('should process basic shorthand with direct value', () => {
    const ui = new Moxie({
      property: {
        ui: ({ key }) => key,
        p: ({ value, unit }) =>
          `value:padding: ${!unit ? 0.25 * Number(value) + 'rem' : value + unit}`,
        m: ({ value, unit, secondValue, secondUnit }) => {
          const create = (value, unit) =>
            !isNaN(value)
              ? !unit
                ? 0.25 * Number(value) + 'rem'
                : value + unit
              : value + (unit || '')

          return `value:margin: ${create(value, unit)}${
            secondValue ? ` ${create(secondValue, secondUnit)}` : ''
          }`
        },
        flex: 'display: flex',
        grid: 'value:display: grid'
      },
      values: {
        fakeblue: 'red'
      }
    })

    expect(ui.processShorthand('ui', '(color:red)')).toStrictEqual({
      className: 'ui-(color:red)',
      cssRules: 'color',
      value: 'red',
      prefix: undefined
    })
    expect(ui.processShorthand('ui', '(color:{fakeblue})')).toStrictEqual({
      className: 'ui-(color:{fakeblue})',
      cssRules: 'color',
      value: 'red',
      prefix: undefined
    })
    expect(ui.processShorthand('ui', '(padding:2rem_30px)')).toStrictEqual({
      className: 'ui-(padding:2rem_30px)',
      cssRules: 'padding',
      value: '2rem 30px',
      prefix: undefined
    })
    expect(ui.processShorthand('p', '20', 'px')).toStrictEqual({
      className: 'p-20px',
      cssRules: 'padding: 20px',
      value: null,
      prefix: undefined
    })
    expect(ui.processShorthand('p', '8')).toStrictEqual({
      className: 'p-8',
      cssRules: 'padding: 2rem',
      value: null,
      prefix: undefined
    })
    expect(ui.processShorthand('m', '4')).toStrictEqual({
      className: 'm-4',
      cssRules: 'margin: 1rem',
      value: null,
      prefix: undefined
    })
    expect(ui.processShorthand('m', '4', '', 'hover', '8')).toStrictEqual({
      className: 'hover:m-4/8',
      cssRules: 'margin: 1rem 2rem',
      value: null,
      prefix: 'hover'
    })
    expect(ui.processShorthand('m', '[30%]', '', 'hover', '8')).toStrictEqual({
      className: 'hover:m-[30%]/8', // secondValue is ignored
      cssRules: 'margin: 30%',
      value: null,
      prefix: 'hover'
    })
    expect(ui.processShorthand('flex')).toStrictEqual({
      className: 'flex', // secondValue is ignored
      cssRules: 'display: flex',
      value: null,
      prefix: undefined
    })
    expect(ui.processShorthand('flex', '', '', 'hover')).toStrictEqual({
      className: 'hover:flex', // secondValue is ignored
      cssRules: 'display: flex',
      value: null,
      prefix: 'hover'
    })
    expect(ui.processShorthand('grid')).toStrictEqual({
      className: 'grid', // secondValue is ignored
      cssRules: 'display: grid',
      value: null,
      prefix: undefined
    })
    expect(ui.processShorthand('grid', '', '', 'hover')).toStrictEqual({
      className: 'hover:grid', // secondValue is ignored
      cssRules: 'display: grid',
      value: null,
      prefix: 'hover'
    })
  })

  it('should process custom value shorthand with direct value', () => {
    const ui = new Moxie({
      property: {
        p: {
          property: 'padding',
          value: ({ value, unit, secondValue, secondUnit }) => {
            const create = (value, unit) =>
              !isNaN(value)
                ? !unit
                  ? 0.25 * Number(value) + 'rem'
                  : value + unit
                : value + (unit || '')

            return `${create(value, unit)}${
              secondValue ? ` ${create(secondValue, secondUnit)}` : ''
            }`
          }
        }
      }
    })

    expect(ui.processShorthand('p', '4').value).toBe('1rem')
    expect(ui.processShorthand('p', '[40%]').value).toBe('40%')
    expect(ui.processShorthand('p', '[40%]', '', '', '1', 'rem').value).toBe('40%') // ignored second value
  })

  it('should process custom value shorthand with direct property and null value', () => {
    const ui = new Moxie({
      property: {
        p: {
          property: ({ value, unit, secondValue, secondUnit }) =>
            `padding: ${value}${unit}${secondValue ? ` ${secondValue + secondUnit}` : ''}`
        }
      }
    })

    expect(ui.processShorthand('p', '4', 'rem').cssRules).toBe('padding: 4rem')
    expect(ui.processShorthand('p', '4', 'rem', '', '20', 'px').cssRules).toBe('padding: 4rem 20px')
    expect(ui.processShorthand('p', '[4rem_20px]', '', '', '1', 'rem').cssRules).toBe(
      'padding: 4rem 20px'
    ) // ignoring second value
  })

  it('should return null on string property and value with key', () => {
    const ui = new Moxie({
      property: {
        bg1: 'background',
        bg2: { property: 'background' },
        bg3: ({ value, key, secondValue }) => (key || secondValue ? null : `background: ${value}`)
      }
    })

    expect(
      ui.process([
        'bg1-red',
        'bg1-red/20',
        'bg1-(color:red)',
        'bg2-red',
        'bg2-red/20',
        'bg2-(color:red)',
        'bg3-red',
        'bg3-red/20',
        'bg3-(color:red)'
      ])
    ).toStrictEqual([
      {
        className: 'bg1-red',
        cssRules: 'background',
        value: 'red',
        prefix: undefined,
        raw: [undefined, 'bg1', 'red', '', undefined, undefined, 'bg1-red']
      },
      {
        className: 'bg2-red',
        cssRules: 'background',
        value: 'red',
        prefix: undefined,
        raw: [undefined, 'bg2', 'red', '', undefined, undefined, 'bg2-red']
      },
      {
        className: 'bg3-red',
        cssRules: 'background: red',
        value: null,
        prefix: undefined,
        raw: [undefined, 'bg3', 'red', '', undefined, undefined, 'bg3-red']
      }
    ])
  })

  // disable secondValue
  it('should disable various way of secondValue', () => {
    const ui = new Moxie({
      property: {
        p1: 'padding',
        p2: ['paddingLeft', 'paddingRight'],
        p3: ({ value, unit, secondValue, key }) =>
          !value || key || secondValue ? null : 'padding: ' + value + (unit || 'px'),
        p4: {
          property: ({ value, unit, secondValue, key }) =>
            !value || key || secondValue ? null : 'padding: ' + value + (unit || 'px')
        },
        moxie: ({ key, secondValue }) => (secondValue ? null : key)
      }
    })

    expect(ui.processShorthand('p1', '2', 'rem').cssRules).toBe('padding')
    expect(ui.processShorthand('p1', '2', 'rem').value).toBe('2rem')
    expect(ui.processShorthand('p1', '2', 'rem', '', '4', 'rem')).toBe(null)
    expect(ui.processShorthand('p1')).toBe(null)
    expect(ui.processShorthand('p1', '(hehe:2rem)')).toBe(null)
    expect(ui.processShorthand('p2', '2', 'rem').cssRules).toStrictEqual([
      'paddingLeft',
      'paddingRight'
    ])
    expect(ui.processShorthand('p2', '2', 'rem').value).toBe('2rem')
    expect(ui.processShorthand('p2', '2', 'rem', '', '4', 'rem')).toBe(null)
    expect(ui.processShorthand('p2')).toBe(null)
    expect(ui.processShorthand('p2', '(hehe:2rem)')).toBe(null)
    expect(ui.processShorthand('p3', '2', 'rem').cssRules).toBe('padding: 2rem')
    expect(ui.processShorthand('p3').cssRules).toBe(null)
    expect(ui.processShorthand('p3', '2', 'rem', '', '4', 'rem').cssRules).toBe(null)
    expect(ui.processShorthand('p3', '(hehe:2rem)').cssRules).toBe(null)
    expect(ui.processShorthand('p4').cssRules).toBe(null)
    expect(ui.processShorthand('p4', '2', 'rem').cssRules).toBe('padding: 2rem')
    expect(ui.processShorthand('p4', '2', 'rem', '', '4', 'rem').cssRules).toBe(null)
    expect(ui.processShorthand('p4', '(hehe:2rem)').cssRules).toBe(null)
    expect(ui.processShorthand('p4').cssRules).toBe(null)
    // moxie-* utility
    expect(ui.processShorthand('moxie', '(color:red)', '', '').cssRules).toBe('color')
    expect(ui.processShorthand('moxie', '(color:red)', '', '').value).toBe('red')
    expect(ui.processShorthand('moxie', '(color:red)', '', '', '4').cssRules).toBe(null)
  })

  it('only get value from array of values', () => {
    const ui = new Moxie({
      property: {
        'break-after': {
          property: 'breakAfter',
          value: ['all', 'auto', 'avoid']
        }
      }
    })

    expect(ui.processShorthand('break-after', 'all').cssRules).toBe('break-after')
    expect(ui.processShorthand('break-after', 'all').value).toBe('all')
    expect(ui.processShorthand('break-after', 'hehehe')).toBe(null)
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
        },
        'space-x': ({ value, unit, raw }) => {
          return {
            className: `${escapeCSSSelector(raw[6])} > :not(:last-child)`,
            cssRules: 'margin',
            value: value + unit,
            prefix: raw[0]
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
    expect(ui.process('hover:space-x-50rem')[0].className).toBe(
      'hover\\:space-x-50rem > :not(:last-child)'
    )
    expect(ui.process('hover:space-x-50rem')[0].value).toBe('50rem')
  })
})
