import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
import { parseClassName } from '../src/lib/classNameParser'
import { camelToKebab } from '../src/utils/converter'
describe('makeTenoxUI', () => {
  let element: HTMLElement
  let useStyles: (config?: any) => ReturnType<typeof createStyler>

  beforeEach(() => {
    setupJSDOM()
    element = document.createElement('div')
    element.className = 'my-element'
    document.body.appendChild(element)
    useStyles = (config = {}) => createStyler(element, config)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('should parse class names correctly', () => {
    const styler = useStyles({
      property: { bg: 'background', text: 'color' }
    })

    // parsed types
    expect(parseClassName('text-red', styler.property)[1]).toBe('text')
    expect(parseClassName('[--my-color]-red', styler.property)[1]).toBe('[--my-color]')
    // parsed values
    expect(parseClassName('bg-red', styler.property)[2]).toBe('red')
    expect(parseClassName('bg-#ccf655', styler.property)[2]).toBe('#ccf655')
    expect(parseClassName('bg-$my-color', styler.property)[2]).toBe('$my-color')
    expect(parseClassName('bg-[--my-var]', styler.property)[2]).toBe('[--my-var]')
    expect(parseClassName('bg-[var(--my-var)]', styler.property)[2]).toBe('[var(--my-var)]')
    expect(parseClassName('bg-[rgb(221_183_124_/_0.3)]', styler.property)[2]).toBe(
      '[rgb(221_183_124_/_0.3)]'
    )
  })

  it('should convert values correctly', () => {
    const styler = useStyles({
      property: {
        bg: 'background'
      },
      values: {
        primary: '#ccf654'
      }
    })

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-primary', styler.property)[2],
        ''
      )
    ).toBe('#ccf654')

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-blue', styler.property)[2],
        ''
      )
    ).toBe('blue')

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-$my-background', styler.property)[2],
        ''
      )
    ).toBe('var(--my-background)')

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-[--c-primary]', styler.property)[2],
        ''
      )
    ).toBe('var(--c-primary)')

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-[var(--c-primary)]', styler.property)[2],
        ''
      )
    ).toBe('var(--c-primary)')

    expect(
      styler.create['computeValue'].valueHandler(
        '',
        parseClassName('bg-[rgb(221_183_124_/_0.3)]', styler.property)[2],
        ''
      )
    ).toBe('rgb(221 183 124 / 0.3)')
  })
  it('should have correct css property and value', () => {
    const styler = useStyles({
      property: {
        text: 'color',
        bg: 'background',
        box: ['width', 'height'],
        br: ['webkitBorderRadius', 'mozBorderRadius', 'borderRadius']
      }
    })

    styler.applyMultiStyles('text-red bg-black box-100px br-8px')

    expect(element.style).toHaveProperty('color', 'red')
    expect(element.style).toHaveProperty('background', 'black')
    expect(element.style).toHaveProperty('width', '100px')
    expect(element.style).toHaveProperty('height', '100px')
    expect(element.style).toHaveProperty('borderRadius', '8px')
  })

  it('should have correct value for css variable', () => {
    const styler = useStyles({
      property: {
        color3: '--color3',
        color45: ['--color4', '--color5'],
        color6: {
          property: '--color6',
          value: 'linear-gradient(to right, {0}, blue, var(--tx))'
        }
      }
    })

    styler.applyStyles('[--color1]-red')
    styler.applyStyles('[--color2]-blue')
    styler.applyStyles('color3-yellow')
    styler.applyStyles('color45-green')
    styler.applyStyles('color6-red')

    expect(element.style.getPropertyValue('--color1')).toBe('red')
    expect(element.style.getPropertyValue('--color2')).toBe('blue')
    expect(element.style.getPropertyValue('--color3')).toBe('yellow')
    expect(element.style.getPropertyValue('--color4')).toBe('green')
    expect(element.style.getPropertyValue('--color5')).toBe('green')
    expect(element.style.getPropertyValue('--color6')).toBe(
      'linear-gradient(to right, red, blue, var(--tx))'
    )
  })

  it('should convert `camelType` into `kebab-type`', () => {
    const styler = useStyles()

    expect(camelToKebab('itsTenox')).toBe('its-tenox')
    // camelToKebab method is used to convert camelCase css property -
    // into kebab-type css property
    expect(camelToKebab('backgroundColor')).toBe('background-color')
    expect(camelToKebab('borderRadius')).toBe('border-radius')
    expect(camelToKebab('color')).toBe('color')
  })

  it('should return correct css properties or variables', () => {
    const styler = useStyles({
      property: {
        bg: 'background',
        bgC: 'backgroundColor',
        px: ['paddingLeft', 'paddingRight']
      },
      classes: {
        backgroundColor: {
          tx: 'red'
        }
      }
    })
  })
})
