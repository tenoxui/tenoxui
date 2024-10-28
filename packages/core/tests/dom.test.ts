import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
import { scanAndApplyStyles, setupClassObserver } from '../src/lib/observer'

describe('all methods', () => {
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

  it("should scan the element's class names and apply the styles", () => {
    const styler = useStyles({
      property: {
        p: 'padding',
        bg: 'background',
        text: 'color'
      }
    })
    const scanner = () => scanAndApplyStyles(className => styler.applyStyles(className), element)
    const updateStyles = () => {
      styler.element.style = ''
      scanner()
    }

    // styler.applyStyles("bg-red");
    // adding styles directly to the element's classList
    element.classList.add('bg-red')
    updateStyles()
    expect(element.style.background).toBe('red')

    // updating classList
    // element.classList.remove("bg-red");
    element.classList.add('bg-blue')
    element.classList.add('text-red')
    updateStyles()
    expect(element.style.background).toBe('blue')
    expect(element.style.color).toBe('red')

    // using setAttribute
    element.setAttribute('class', 'p-1rem bg-green')
    updateStyles()
    expect(element.style.padding).toBe('1rem')
    expect(element.style.background).toBe('green')
  })

  it('should observe multiple class changes', async () => {
    const styler = useStyles({ property: { bg: 'background', text: 'color', p: 'padding' } })

    /**
     * Setting up new class name observer.
     * Can use useDOM() method or only setupClassObserver() method
     */
    setupClassObserver(className => styler.applyStyles(className), element)

    setTimeout(() => {
      element.classList.add('bg-red', 'text-white')
    }, 0)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(element.style.background).toBe('red')
    expect(element.style.color).toBe('white')

    setTimeout(() => {
      element.classList.remove('bg-red')
      element.classList.add('p-1rem')
    }, 0)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(element.style.background).toBe('')
    expect(element.style.padding).toBe('1rem')
  })
})
