import { TenoxUI } from '../src/index.ts'
import { describe, it, expect } from 'vitest'

describe('tenoxui/core shorthand test', () => {
  let css = new TenoxUI({
    breakpoints: {
      md: '48rem'
    }
  })

  it('should parse breakpoint variants', () => {
    expect(css.getBreakpointQuery('md')).toBe('@media (width >= 48rem)')
    expect(css.getBreakpointQuery('max-md')).toBe('@media (width < 48rem)')
    expect(css.getBreakpointQuery('min-md')).toBe('@media (width >= 48rem)')
  })
})
