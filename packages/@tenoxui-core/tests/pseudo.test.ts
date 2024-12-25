import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
import { merge, transformClasses } from '@nousantx/someutils'
import { hover, unHover, screenSize } from './utils/event'

describe('Value handler and applying styles', () => {
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

  it('should apply custom class property correctly', () => {
    const styler = useStyles({
      property: {
        bg: 'background',
        text: 'color',
        'my-bg': '--my-bg-var'
      }
    })

    styler.applyMultiStyles(
      `
      [color]-red 
hover:[color]-blue

      [text-decoration-color,border-color]-yellow 
hover:[text-decoration-color,border-color]-green

      [my-bg,bg,--bg-color]-blue 
hover:[my-bg,bg,--bg-color]-red
      `
    )

    // hover element
    hover(element)

    expect(element.style.textDecorationColor).toBe('green')
    expect(element.style.borderColor).toBe('green')
    expect(element.style.background).toBe('red')
    expect(element.style.getPropertyValue('--my-bg-var')).toBe('red')
    expect(element.style.getPropertyValue('--bg-color')).toBe('red')
    expect(element.style.color).toBe('blue')

    // unhover element
    unHover(element)

    expect(element.style.textDecorationColor).toBe('yellow')
    expect(element.style.borderColor).toBe('yellow')
    expect(element.style.background).toBe('blue')
    expect(element.style.getPropertyValue('--my-bg-var')).toBe('blue')
    expect(element.style.getPropertyValue('--bg-color')).toBe('blue')
    expect(element.style.color).toBe('red')
  })
})
