import { describe, it, test, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Moxie', () => {
  let ui: Moxie = new Moxie()
  const tx = new Moxie({
    classes: {
      display: {
        flex: 'flex',
        iflex: 'inline-flex'
      },
      '--bg-opacity': {
        bg: '{1}% || 1'
      },
      backgroundColor: {
        bg: 'rgb({0} / var(--bg-opacity)) || red'
      }
    },
    values: {
      'red-500': '255 0 0'
    }
  })

  console.log(tx.process(['bg', 'bgred-500', 'bg(255_0_0)/40']))

  console.log(tx.processCustomClass('bg', 'red-500'))

  describe('Utility', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(ui.toKebabCase('someCamelCase')).toBe('some-camel-case')
      expect(ui.toKebabCase('marginInline')).toBe('margin-inline')
      expect(ui.toKebabCase('webkitAnimation')).toBe('-webkit-animation')
      expect(ui.toKebabCase('oTransition')).toBe('-o-transition')
      expect(ui.toKebabCase('mozTransition')).toBe('-moz-transition')
      expect(ui.toKebabCase('msTransition')).toBe('-ms-transition')
    })

    it('should escape unique characters', () => {
      expect(ui.escapeCSSSelector(`#{}.:;?%&,@+*~'"!^$[]()=>|/`)).toBe(
        `\\#\\{\\}\\.\\:\\;\\?\\%\\&\\,\\@\\+\\*\\~\\'\\"\\!\\^\\$\\[\\]\\(\\)\\=\\>\\|\\/`
      )
    })
  })
  describe('Parser', () => {
    ui = new Moxie({
      property: {
        bg: 'background',
        m: ({ value, unit }) => `value:margin: ${!unit ? 0.25 * value + 'rem' : value + unit}`,
        mx: ['marginLeft', 'marginRight']
      },
      classes: {
        display: {
          flex: '{0} || flex',
          m2: 'block'
        },

        margin: {
          p10: '...'
        }
      }
    })
    it('should parse prefix', () => {
      const ui = new Moxie({
        property: {
          m: '...'
          // p: '...'
        }
      })

      let className = '[prefixes52628]:m2px/(calc(25px_*_0.9rem))'
      expect(ui.parse(className)[0]).toBe('[prefixes52628]')
      className = 'x:m2'

      expect(ui.parse(className)[0]).toBe('x')
      className = '[x]:m-2px'

      expect(ui.parse(className)[0]).toBe('[x]')
      className = '{x}:m-2px'

      expect(ui.parse(className)[0]).toBe('{x}')
      className = '(x):m-2px'

      expect(ui.parse(className)[0]).toBe('(x)')
      expect(ui.parse('x:m-2px/[hello]px')).toStrictEqual(['x', 'm', '2', 'px', '[hello]', 'px'])
      expect(ui.parse('[hehe]:[padding,--color]-$my-color/red')).toStrictEqual([
        '[hehe]',
        '[padding,--color]',
        '$my-color',
        '',
        'red',
        ''
      ])
    })
    it('should parse from shorthand', () => {
      let className = 'hover:m-3'
      expect(ui.parse(className)[0]).toBe('hover')
      expect(ui.parse(className)[1]).toBe('m')
      expect(ui.parse(className)[2]).toBe('3')
    })
    it('should parse from classes', () => {
      let className = 'hover:p10-1rem'

      expect(ui.parse(className)[0]).toBe('hover')
      expect(ui.parse(className)[1]).toBe('p10')
    })
  })

  describe('Styles', () => {
    const ui = new Moxie({
      property: {
        m: 'margin',
        size: ['width', 'height'],
        mx: ({ value, unit }) =>
          `value:margin-inline: ${unit ? value + unit : 0.25 * Number(value) + 'rem'}`,
        p: {
          property: 'padding',
          value: ({ value, unit }) => {
            return value + unit
          }
        }
      }
    })

    it('should process shorthand', () => {
      console.log(ui.processShorthand('m', '10', 'px', '', '', '', true))
      expect(ui.processShorthand('m', '10', 'px', 'hover', '', '', true).className).toBe('m-10px')
      expect(ui.processShorthand('m', '', '', 'hover', '', '', true).prefix).toBe('hover')
      expect(ui.processShorthand('mx', '10', '', 'hover', '', '', true)).toStrictEqual({
        className: 'mx-10',
        cssRules: 'margin-inline: 2.5rem',
        value: null,
        prefix: 'hover'
      })
      expect(ui.processShorthand('p', '1', 'rem', '', '', '', false)).toStrictEqual({
        className: 'p1rem',
        cssRules: 'padding',
        value: '1rem',
        prefix: ''
      })
    })
  })
})
