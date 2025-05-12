import { describe, it, expect } from 'vitest'
import Moxie from '../src/index.ts'

describe('Parser', () => {
  let ui: Moxie = new Moxie()

  it('should parse prefix correctly', () => {
    ui = new Moxie({
      property: {
        h: '...'
      }
    })

    expect(ui.parse('hover:h')[0]).toBe('hover')
    expect(ui.parse('tx-[hehehe]:h')[0]).toBe('tx-[hehehe]')
    expect(ui.parse('tx-(hehehe):h')[0]).toBe('tx-(hehehe)')
    expect(ui.parse('tx-{hehehe}:h')[0]).toBe('tx-{hehehe}')
    expect(ui.parse('[hehehe]:h')[0]).toBe('[hehehe]')
    expect(ui.parse('(hehehe):h')[0]).toBe('(hehehe)')
    expect(ui.parse('{hehehe}:h')[0]).toBe('{hehehe}')
    expect(ui.parse('max-(50%):h')[0]).toBe('max-(50%)')
    expect(ui.parse('max-50px:h')[0]).toBe('max-50px')
    expect(ui.parse('(&:hover):h')[0]).toBe('(&:hover)')
  })

  it('should parse basic shorthand', () => {
    ui = new Moxie({
      property: {
        m: '...'
      },
      classes: {
        display: {
          flex: '...'
        }
      }
    })
    expect(ui.parse('[background]')[1]).toBe('[background]')
    expect(ui.parse('[color,--my-color]')[1]).toBe('[color,--my-color]')
    expect(ui.parse('[padding]-1rem')[1]).toBe('[padding]')
    expect(ui.parse('[padding]-1rem')[2]).toBe('1')
    expect(ui.parse('[padding]-1rem')[3]).toBe('rem')
    expect(ui.parse('m-20px')[1]).toBe('m')
    expect(ui.parse('m-20px')[2]).toBe('20')
    expect(ui.parse('m-20px')[3]).toBe('px')
    expect(ui.parse('md:flex')[0]).toBe('md')
    expect(ui.parse('md:flex')[1]).toBe('flex')
    expect(ui.process('md:flex')[0].raw[6]).toBe('md:flex')
  })

  it('should parse value and second value', () => {
    const safelist = ['m']

    let className = 'm-20px'
    expect(ui.parse(className, safelist)[1]).toBe('m')
    expect(ui.parse(className, safelist)[2]).toBe('20')
    expect(ui.parse(className, safelist)[3]).toBe('px')
    className = 'm-(everything-here-is-fine)px'
    expect(ui.parse(className, safelist)[2]).toBe('(everything-here-is-fine)')
    expect(ui.parse(className, safelist)[3]).toBe('px')
    className = 'm-20px/1rem'
    expect(ui.parse(className, safelist)[2]).toBe('20')
    expect(ui.parse(className, safelist)[3]).toBe('px')
    expect(ui.parse(className, safelist)[4]).toBe('1')
    expect(ui.parse(className, safelist)[5]).toBe('rem')
  })
})
