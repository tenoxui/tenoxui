import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GenerateCSS, toKebabCase, escapeCSSSelector } from '../src/ts/static-css'
import { HTMLParser } from '../src/ts/parser/HTMLParser'
import { JSLikeParser } from '../src/ts/parser/JSLikeParser'
import fs from 'node:fs'
import path from 'node:path'

describe('GenerateCSS', () => {
  let config
  let generator
  beforeEach(() => {
    config = {
      property: {
        bg: 'background-color',
        text: 'color',
        p: 'padding',
        br: 'border-radius',
        jc: 'justifyContent',
        size: ['width', 'height'],
        bdr: 'border'
        //'bdr-clr': 'borderColor'
      },
      values: {
        primary: '#ccf654'
      },
      classes: {
        display: {
          center: 'flex'
        },
        alignItems: {
          center: 'center'
        },
        justifyContent: {
          center: 'center'
        }
      },
      input: [path.resolve(process.cwd(), 'src/apps/index.html')],
      output: path.resolve(process.cwd(), 'test-output.css')
    }
    generator = new GenerateCSS(config)
  })

  it('should convert arbitrary value correctly', () => {
    expect(generator.parseClass('bg-[rgb(75,_104,_229)]')).toBe(
      '.bg-\\[rgb\\(75\\,_104\\,_229\\)\\] { background-color: rgb(75, 104, 229); }'
    )
  })

  it('should use multi words value correctly without arbitrary class', () => {
    expect(generator.parseClass('bdr-clr-red')).toBe('.bdr-clr-red { border: clr-red; }')
    expect(generator.parseClass('jc-space-between')).toBe(
      '.jc-space-between { justify-content: space-between; }'
    )
    expect(generator.parseClass('jc-flex-start')).toBe(
      '.jc-flex-start { justify-content: flex-start; }'
    )
    expect(generator.parseClass('[color,background-color]-red')).toBe(
      '.\\[color\\,background-color\\]-red { color: red; background-color: red; }'
    )
  })

  it('should generate CSS from multiple class names', () => {
    const css = generator.create(['bg-primary', 'text-white', 'p-[calc(1rem_+_10px)]', 'center'])
    expect(css).toContain('.bg-primary { background-color: #ccf654; }')
    expect(css).toContain('.text-white { color: white; }')
    expect(css).toContain('.p-\\[calc\\(1rem_\\+_10px\\)\\] { padding: calc(1rem + 10px); }')
  })
})
