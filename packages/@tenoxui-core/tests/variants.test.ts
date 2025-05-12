import { TenoxUI } from '../src/index.ts'
import { describe, it, expect } from 'vitest'

describe('tenoxui/core shorthand test', () => {
  let css = new TenoxUI({
    property: {
      bg: 'background'
    },
    variants: {
      // basic variants
      hover: '&:hover',
      dark: '[data-theme=dark] &, .dark &',
      // responsive variants
      md: 'value:@media (width >= 48rem)',
      'min-md': 'value:@media (width >= 48rem)',
      'max-md': 'value:@media (width < 48rem)'
    }
  })

  it('should parse basic variants', () => {
    expect(css.processCustomPrefix('hover')).toBe('&:hover')
  })
  it('should parse custom variants', () => {
    expect(css.generatePrefix('(&:hover)')).toBe('&:hover')
    expect(css.generatePrefix('(body_&)')).toBe('body &')
    expect(css.generatePrefix('[@supports_(height:_100vh)]')).toBe('@supports (height: 100vh)')
  })
  it('should parse breakpoint variants', () => {
    expect(css.processCustomPrefix('md')).toBe('@media (width >= 48rem)')
    expect(css.processCustomPrefix('max-md')).toBe('@media (width < 48rem)')
    expect(css.processCustomPrefix('min-md')).toBe('@media (width >= 48rem)')
  })
  it('should parse basic variants', () => {
    expect(css.process('hover:bg-red')[0].className).toBe('hover\\:bg-red')
    expect(css.process('hover:bg-red')[0].variants).toStrictEqual({
      name: 'hover',
      data: '&:hover'
    })
    expect(css.process('md:bg-red')[0].variants).toStrictEqual({
      name: 'md',
      data: '@media (width >= 48rem)'
    })
  })
})
