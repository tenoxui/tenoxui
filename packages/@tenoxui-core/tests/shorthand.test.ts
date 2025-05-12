import { TenoxUI } from '../src/index.ts'
import { describe, it, expect } from 'vitest'

describe('tenoxui/core shorthand test', () => {
  let css = new TenoxUI({
    property: {
      bg: 'background'
    },
    variants: {
      hover: '&:hover'
    }
  })

  it('should process shorthand', () => {
    expect(css.process('hover:bg-red')[0]).toBeDefined()
    expect(css.process('focus:bg-red')[0]).toBeUndefined()
  })
})
