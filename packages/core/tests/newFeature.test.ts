import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupJSDOM, createStyler } from './utils/init'
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
      property: {
        p: {
          property: 'padding',
          value: '{value}'
        }
      }
    })

    console.log(styler.create.parser.parseClassName('p-1px/1rem'))

    styler.applyStyles('p-1px/2rem')

    expect(element.style.padding).toBe('1px')
  })
})
