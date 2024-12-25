import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
import { parseClassName } from '../src/lib/classNameParser'
import { merge, transformClasses } from '@nousantx/someutils'
import { CoreConfig } from '../src/lib/types'

describe('Attributify mode tenoxui', () => {
  let element: HTMLElement
  let useStyles: (config?: CoreConfig) => ReturnType<typeof createStyler>

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

  it('should apply styles from css property as html attribute', () => {
    const styler = useStyles({
      property: { bg: 'background' },
      attributify: true
      // attributifyPrefix: 'tx-test-'
    })

    element.setAttribute('background', 'red')
    element.setAttribute('color', 'blue')
    element.setAttribute('tx---color', 'red')

    styler.useDOM()

    expect(element.style.background).toBe('red')
    expect(element.style.color).toBe('blue')
    expect(element.style.getPropertyValue('--color')).toBe('red')
  })
  it('should apply styles from config.property', () => {
    const styler = useStyles({
      property: {
        bg: 'background',
        text: 'color',
        'my-color': '--my-color'
      },
      attributify: true
    })
    element.setAttribute('bg', 'red')
    element.setAttribute('text', 'blue')
    element.setAttribute('my-color', 'red')
    styler.useDOM()

    expect(element.style.background).toBe('red')
    expect(element.style.color).toBe('blue')
    expect(element.style.getPropertyValue('--my-color')).toBe('red')
  })
  it('should apply styles from config.property with multiple properties', () => {
    const styler = useStyles({
      property: {
        box: ['width', 'height'],
        'my-color': ['color', '--my-color']
      },
      attributify: true
    })
    element.setAttribute('box', '50px')
    element.setAttribute('my-color', 'red')

    styler.useDOM()

    expect(element.style.width).toBe('50px')
    expect(element.style.height).toBe('50px')
    expect(element.style.color).toBe('red')
    expect(element.style.getPropertyValue('--my-color')).toBe('red')
  })
  it('should ignore some attributes', () => {
    const styler = useStyles({
      property:{bg:"background"},
      attributify: true
      // attributifyPrefix: 'tx-test-',
      // attributifyIgnore: ['background', 'class']
    })
    /**
     * apply styles through data- attribute instead
     */
    element.setAttribute('data-background', 'blue')
    /**
     * If not ignored, the background property should be red
     */
    element.setAttribute('background', 'red')
    element.setAttribute('color', 'red')
    styler.useDOM()

    expect(element.style.background).toBe('red')
    // expect(element.style.height).toBe('50px')
    expect(element.style.color).toBe('red')
    // expect(element.style.getPropertyValue('--my-color')).toBe('red')
  })
})
