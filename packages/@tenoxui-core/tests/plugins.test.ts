import { describe, it, expect } from 'vitest'
import { Moxie as Core, TenoxUI } from '../src/index.ts'

describe('Core Plugins Test', () => {
  it('should process using plugin', () => {
    const ui = new Core({
      utilities: { m: 'margin' },
      plugins: [
        {
          name: 'utility-plugin',
          processUtility({ className, utilities }) {
            for (const key in utilities) {
              const prefix = key + '-'
              if (className.startsWith(prefix)) {
                const value = className.slice(prefix.length)
                return {
                  className,
                  cssRules: utilities[key],
                  value,
                  prefix: null,
                  raw: []
                }
              }
            }
          }
        }
      ]
    })
    expect(ui.process('m-10px')[0]).toBeDefined()
    expect(ui.process('m-10px')[0].cssRules).toBe('margin')
    expect(ui.process('m-10px')[0].value).toBe('10px')
    expect(ui.process('m-10px')[0].className).toBe('m-10px')
  })
})

describe('Main Plugins Test', () => {
  it('should process using plugin', () => {
    const ui = new TenoxUI({
      utilities: { p: "shouldn't it be a margin?" },
      plugins: [
        {
          name: 'utility-plugin',
          processUtility({ className }) {
            const utilities = { m: 'margin' }
            for (const key in utilities) {
              const prefix = key + '-'
              if (className.startsWith(prefix)) {
                const value = className.slice(prefix.length)
                return {
                  className,
                  cssRules: utilities[key],
                  value,
                  prefix: null,
                  raw: []
                }
              }
            }
          }
        },
        {
          name: 'class name processor',
          processClassName({ className, prefix, variant }) {
            if (className.includes('p-')) {
              return {
                className: prefix + ':' + className,
                cssRules: 'padding',
                value: className.slice(2),
                variants: { name: prefix, data: variant },
                raw: []
              }
            }
          }
        }
      ]
    })
    expect(ui.process('m-10px')[0]).toBeDefined()
    expect(ui.process('m-10px')[0].cssRules).toBe('margin')
    expect(ui.process('m-10px')[0].value).toBe('10px')
    expect(ui.process('m-10px')[0].className).toBe('m-10px')

    expect(ui.process('p-10px')[0].cssRules).toBe('padding')
    expect(ui.process('p-10px')[0].value).toBe('10px')
    expect(ui.process('hover:p-10px')[0].variants.name).toBe('hover')
    expect(ui.process('hover:p-10px')[0].className).toBe('hover:p-10px')
    expect(ui.process('hover:p-10px')[0].cssRules).toBe('padding')
  })
  it('should transform final data', () => {
    const ui = new TenoxUI({
      utilities: { p: "shouldn't it be a margin?" },
      plugins: [
        {
          name: 'class name processor',
          transform({ className }) {
            if (className.includes('p-')) {
              return {
                className: '#my-app ' + className
              }
            }
          }
        }
      ]
    })

    expect(ui.process('p-10px')[0].className).toBe('#my-app p-10px')
  })
})
