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

    expect(ui.processCustomClass('flex').cssRules).toBe('display: flex')
    expect(ui.processCustomClass('flex', '', '', 'hover').cssRules).toBe('display: flex')
    expect(ui.processCustomClass('flex', '', '', 'hover').prefix).toBe('hover')
    expect(ui.processCustomClass('flex', '4').cssRules).toBe('')
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

  it('should correctly parse class name with same `type` or class name prefix', () => {
    const ui = new Moxie({
      // until v0.6.4, class name isn't being parsed correctly if you have -
      // shorthand that matched the class names such as from this.classes
      // for example :
      // class name `items-center` is being matched as `ms-center` only, -
      // the `ite` is being ignored.
      // `ite{type:ms}-{value:center}`
      property: {
        ms: '...'
      },
      classes: {
        alignItems: {
          'items-center': 'center',
          'items-center-hehe': 'center'
        }
      }
    })

    expect(ui.process(['items-center', 'items-center-hehe'])).toStrictEqual([
      {
        className: 'items-center',
        cssRules: 'align-items: center',
        value: null,
        prefix: '',
        raw: [undefined, 'items-center', '', '', undefined, undefined, 'items-center']
      },
      {
        className: 'items-center-hehe',
        cssRules: 'align-items: center',
        value: null,
        prefix: '',
        raw: [undefined, 'items-center', 'hehe', '', undefined, undefined, 'items-center-hehe']
      }
    ])
  })
})
