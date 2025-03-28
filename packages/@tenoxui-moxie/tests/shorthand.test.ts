import { describe, it, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Value Processor', () => {
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
      className: 'my-color-red',
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
      className: 'p-md',
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
        }
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
      className: 'm-4/8',
      cssRules: 'margin: 1rem 2rem',
      value: null,
      prefix: 'hover'
    })
    expect(ui.processShorthand('m', '[30%]', '', 'hover', '8')).toStrictEqual({
      className: 'm-[30%]/8', // secondValue is ignored
      cssRules: 'margin: 30%',
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
})
