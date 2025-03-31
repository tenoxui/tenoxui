import { describe, it, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Value Processor', () => {
  let ui: Moxie = new Moxie()

  it('should process basic value', () => {
    expect(ui.processValue('20', 'px')).toBe('20px')
    expect(ui.processValue('100', '%')).toBe('100%')
    expect(ui.processValue('red')).toBe('red')
  })

  it('should process arbitrary value', () => {
    ui = new Moxie({
      values: {
        '2xl': '48rem',
        red: 'blue',
        container: {
          '2xl': '28rem'
        }
      }
    })

    expect(ui.processValue('(20px)')).toBe('20px')
    expect(ui.processValue('[20px]')).toBe('20px')
    expect(ui.processValue('(rgb(255_0_0))')).toBe('rgb(255 0 0)')
    expect(ui.processValue('[hello_world]')).toBe('hello world')
    expect(ui.processValue('[hello\\_world]')).toBe('hello_world')
    // parse value from this.values
    expect(ui.processValue('2xl')).toBe('48rem') // no group inputted
    expect(ui.processValue('2xl', '', 'container')).toBe('28rem') // use container group
    expect(ui.processValue('(calc({2xl}_*_2))')).toBe('calc(48rem * 2)')
    expect(ui.processValue('(calc({2xl}_*_2))', '', 'container')).toBe('calc(28rem * 2)')
    expect(ui.processValue('red')).toBe('blue')
    expect(ui.processValue('(red)')).toBe('red')
    expect(ui.processValue('({red})')).toBe('blue')
    expect(ui.processValue('[{red}]')).toBe('blue')
  })

  it('should parse css variable value', () => {
    expect(ui.processValue('(--my-color)')).toBe('var(--my-color)')
    expect(ui.processValue('$my-color')).toBe('var(--my-color)')
  })
})
