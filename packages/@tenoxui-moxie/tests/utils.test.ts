import { describe, it, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Utility', () => {
  const ui = new Moxie()

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

  it('should get all class names inside classes object ', () => {
    expect(
      ui.getAllClassNames({
        display: {
          flex: '...',
          block: '...',
          hidden: '...'
        },
        justifyContent: {
          flex: '...',
          between: '...'
        }
      })
    ).toStrictEqual(['flex', 'block', 'hidden', 'between'])
  })

  it('should generate shorthand list to be matched', () => {
    const ui = new Moxie({
      property: {
        bg: '...'
      },
      classes: {
        display: {
          flex: '...'
        }
      }
    })

    expect(ui.getTypePrefixes()).toContain('flex|bg')
    expect(ui.getTypePrefixes(['my-custom-list'])).toContain('my-custom-list|')
  })

  it('should parse pattern with curly bracket correctly', () => {
    const ui = new Moxie({
      property: {
        test: {
          property: '...'
        },
        test2: {
          property: '...',
          group: 'size'
        },
        test3: {
          property: '...',
          value: '{0}rem'
        }
      },
      values: {
        md: '20rem',
        size: {
          md: '40rem'
        }
      }
    })

    expect(ui.parseValuePattern('', '{0}', '20', 'px')).toBe('20px')
    expect(ui.parseValuePattern('', '{0}rem', '20', 'px')).toBe('20pxrem')
    expect(ui.parseValuePattern('', '{0}', 'md')).toBe('20rem')
    expect(ui.parseValuePattern('size', '{0}', 'md')).toBe('40rem')
    expect(ui.parseValuePattern('', 'rgb({0}) || blue')).toBe('blue')
    expect(ui.parseValuePattern('', 'rgb({0}) || blue', '(255_0_0)')).toBe('rgb(255 0 0)')
    expect(ui.parseValuePattern('', 'rgb({0} / {1 | 1}) || blue', '(255_0_0)')).toBe(
      'rgb(255 0 0 / 1)'
    )
    expect(ui.parseValuePattern('', 'rgb({0} / {1 | 1}) || blue', '(255_0_0)', '', '20', '%')).toBe(
      'rgb(255 0 0 / 20%)'
    )
    expect(ui.parseValuePattern('', 'rgb({0} / {1 | 1}) || blue', '', '', '', '')).toBe('blue')
  })
})
