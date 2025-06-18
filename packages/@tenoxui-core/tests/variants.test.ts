import { TenoxUI } from '../src/index.ts'
import { describe, it, expect } from 'vitest'

describe('tenoxui/core variant test', () => {
  let css = new TenoxUI({
    utilities: {
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

  it('should handle complex variant', () => {
    const css = new TenoxUI({
      utilities: {
        bg: 'background'
      },
      variants: {
        hover: ({ value }) =>
          !value ? 'value:&:hover' : value === 'dark' ? 'value:.dark &:hover' : null,
        dark: ({ value }) =>
          !value ? 'value:.dark &' : value === 'hover' ? 'value:.dark &:hover' : null,
        max: ({ value, unit }) =>
          !value ? null : `value:@media (max-width: ${value + (unit || 'px')})`
      }
    })

    expect(css.generatePrefix('hover')).toBe('&:hover')
    expect(css.generatePrefix('hover-dark')).toBe('.dark &:hover')
    expect(css.generatePrefix('dark')).toBe('.dark &')
    expect(css.generatePrefix('dark-hover')).toBe('.dark &:hover')
    expect(css.generatePrefix('max')).toBe(null)
    expect(css.generatePrefix('max-768')).toBe('@media (max-width: 768px)')
    expect(css.generatePrefix('max-768px')).toBe('@media (max-width: 768px)')
  })
})

describe('Issues Fix', () => {
  it('should handle variants with same prefix', () => {
    /**
     * Issue:
     * If you have variants with same prefix, it's not handled properly.
     *
     * PoC:
     * You have to define new variant `dark` and then create new variant -
     * once again named `dark-hover`, but without `value:` mark before -
     * the variant value. Like this :
     *
     * variants: {
     *   dark: ".dark &",
     *   "dark-hover": ".dark &:hover"
     * }
     *
     * Since the prefixLoaded parse the prefix as tenoxui class names, -
     * the `dark-hover` is parsed as [undefined, "dark", "hover"], and -
     * this makes prefix like `dark-{whatever-the-value-is}` is a valid -
     * prefix. Here's the output variant with the same method :
     *
     * dark => .dark &
     * dark-hover => .dark &
     * dark-whatever-this-is => .dark &
     *
     * All of the variants will return the same value. To avoid this, you can add `value:` mark before the variant value though.
     *
     * How we solve this:
     * We just add simple check to treat all of the variant with string -
     * as value as direct variant, so it shouldn't have any value.
     */
    const css = new TenoxUI({
      utilities: {
        bg: 'background'
      },
      variants: {
        hover: '&:hover',
        dark: '.dark &',
        'dark-hover': '.dark &:hover',
        'dark:hover': 'value:.dark &:hover'
      }
    })

    expect(css.generatePrefix('hover')).toBe('&:hover')
    expect(css.generatePrefix('dark')).toBe('.dark &')
    expect(css.generatePrefix('dark-hover')).toBe('.dark &:hover')
    expect(css.generatePrefix('dark:hover')).toBe('.dark &:hover')
  })
})
