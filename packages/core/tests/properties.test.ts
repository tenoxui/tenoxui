import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'

describe('types & propeties', () => {
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

  it('should apply single style into element correctly', () => {
    const styler = useStyles({
      property: { p: 'padding' }
    })

    // apply the style into element
    // styler.applyStyles("p-1rem");
    element.classList.add('p-1rem')
    styler.useDOM()
    expect(element.style.padding).toBe('1rem')
  })

  it('should apply multiple styles into element correctly', () => {
    const styler = useStyles({
      property: { p: 'padding', bg: 'background' }
    })

    // apply the style into element
    styler.applyStyles('p-1rem')
    styler.applyStyles('bg-red')

    expect(element.style.padding).toBe('1rem')
    expect(element.style.background).toBe('red')
  })

  it('should apply multi styles with applyMultiStyles method', () => {
    const styler = useStyles({
      property: { p: 'padding', bg: 'background', text: 'color' }
    })

    // apply the style into element
    styler.applyMultiStyles('p-2.5rem text-#ccf654 bg-black')

    expect(element.style.padding).toBe('2.5rem')
    expect(element.style.background).toBe('black')
    expect(element.style.color).toBe('rgb(204, 246, 84)')
  })

  it('should add value into css variable', () => {
    const styler = useStyles({
      property: { psize: '--padding-size', 'my-color': '--my-color' }
    })

    styler.applyMultiStyles('psize-2.5rem my-color-blue')

    expect(element.style.getPropertyValue('--padding-size')).toBe('2.5rem')
    expect(element.style.getPropertyValue('--my-color')).toBe('blue')
  })

  it('should have correctly use custom value property', () => {
    const styler = useStyles({
      property: {
        p: {
          property: 'padding',
          value: '1rem {value} 2rem {value}'
        }
      }
    })

    styler.applyMultiStyles('p-10px')

    expect(element.style.padding).toBe('1rem 10px 2rem 10px')
  })
})
