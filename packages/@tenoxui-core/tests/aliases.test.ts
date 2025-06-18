import { TenoxUI } from '../src/index.ts'
import { describe, it, expect } from 'vitest'

describe('tenoxui/core shorthand test', () => {
  let css = new TenoxUI({
    utilities: {
      bg: 'background',
      m: 'margin',
      size: ['width', 'height']
    },
    aliases: {
      btn: 'size-40px m-8px bg-red',
      'btn-primary': 'size-42px m-12px bg-blue hover:bg-yellow',
      'btn-40px': 'size-42px m-12px bg-blue hover:bg-yellow'
    },
    variants: {
      hover: '&:hover'
    }
  })

  it('should process alias with same prefix name', () => {
    expect(css.process('btn')[0].className).toBe('btn')
    expect(css.process('btn-primary')[0].className).toBe('btn-primary')
    expect(css.process('hover:btn-primary')[0].className).toBe('hover\\:btn-primary')
    expect(css.process('btn-40px')[0].className).toBe('btn-40px')
    expect(css.process('hover:btn-40px')[0].className).toBe('hover\\:btn-40px')
  })
})
