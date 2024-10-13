import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
import { screenSize } from './utils/event'

describe('Responsive feature/apply styles on different screen', () => {
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

  it('should matching the breakpoints from each screenSize', () => {
    const styler = useStyles()

    // breakpoint around small screen
    let bp = { name: 'sm', min: 0, max: 639 }
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 400)).toBe(true) // still around small screen
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 650)).toBe(false) // outside small screen

    // around medium size
    bp = { name: 'md', min: 640, max: 768 }
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 639)).toBe(false) // behind medium screen size
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 657)).toBe(true) // around medium size

    // breakpoints start from 640px to infinite
    bp = { name: 'md', min: 640 }
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 400)).toBe(false)
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 650)).toBe(true)
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 9909)).toBe(true)

    // breakpoint from 0 to 768px
    bp = { name: 'md', max: 768 }
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 400)).toBe(true)
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 640)).toBe(true)
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 769)).toBe(false)
    expect(styler.create['responsive'].matchBreakpoint(bp, bp.name, 800)).toBe(false)
  })

  /**
   * Apply different styles in different screen size
   */
  it('should apply styles in different screen size', () => {
    const styler = useStyles({
      property: {
        p: 'padding'
      },
      breakpoints: [
        { name: 'sm', min: 0, max: 639 },
        { name: 'md', min: 640, max: 767 }
      ]
    })

    styler.applyMultiStyles('p-0.5rem sm:p-1rem md:p-2rem lg:p-3rem')

    expect(element.style.padding).toBe('0.5rem')
    screenSize(400, 800)
    expect(element.style.padding).toBe('1rem')
    screenSize(640, 800)
    expect(element.style.padding).toBe('2rem')
  })
})
