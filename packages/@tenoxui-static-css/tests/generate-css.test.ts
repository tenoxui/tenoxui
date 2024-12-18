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
        size: ['width', 'height']
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

  it('should convert prefixes properties correctly', () => {
    expect(toKebabCase('justifyContent')).toBe('justify-content')
    expect(toKebabCase('webkitAnimation')).toBe('-webkit-animation')
  })

  it('should escape CSS selectors', () => {
    expect(escapeCSSSelector('bg-#fff')).toBe('bg-\\#fff')
    expect(escapeCSSSelector('p-[1rem]')).toBe('p-\\[1rem\\]')
  })

  it('should match class components correctly', () => {
    expect(generator.classParser.matchClass('hover:p-2rem')).toEqual(['hover', 'p', '2', 'rem'])
    expect(generator.classParser.matchClass('focus:bg-red')).toEqual(['focus', 'bg', 'red', ''])
  })

  it('should convert arbitrary value correctly', () => {
    expect(generator.parseClass('bg-[rgb(75,_104,_229)]')).toBe(
      '.bg-\\[rgb\\(75\\,_104\\,_229\\)\\] { background-color: rgb(75, 104, 229); }'
    )
  })

  it('should use multi words value correctly without arbitrary class', () => {
    expect(generator.parseClass('jc-space-between')).toBe(
      '.jc-space-between { justify-content: space-between; }'
    )
    expect(generator.parseClass('jc-flex-start')).toBe(
      '.jc-flex-start { justify-content: flex-start; }'
    )
  })

  it('should parse HTML and extract class names', () => {
    expect(new HTMLParser().parse('<div class="bg-red text-blue"></div>')).toEqual([
      'bg-red',
      'text-blue'
    ])
  })

  it('should parse JavaScript related class names', () => {
    expect(new JSLikeParser().parse('elem.classList.add("bg-white text-blue")')).toEqual([
      'bg-white',
      'text-blue'
    ])
    expect(new JSLikeParser().parse('elem.setAttribute("class", "bg-white text-blue")')).toEqual([
      'bg-white',
      'text-blue'
    ])
    expect(
      new JSLikeParser().parse(`
<script>
  // elem2.classList.add("bg-black", "text-yellow")
  elem.setAttribute("class", "bg-white text-blue")
</script>
`)
    ).toEqual(['bg-white', 'text-blue'])
  })

  it('should generate CSS rule for a simple class', () => {
    const cssRule = generator.parseClass('bg-red')
    expect(cssRule).toBe('.bg-red { background-color: red; }')
  })

  it('should generate CSS rule with custom value', () => {
    const cssRule = generator.parseClass('bg-primary')
    expect(cssRule).toBe('.bg-primary { background-color: #ccf654; }')
  })

  it('should generate CSS rule with multiple properties', () => {
    const cssRule = generator.parseClass('size-100px')
    expect(cssRule).toBe('.size-100px { width: 100px; height: 100px; }')
  })

  it('should generate CSS rule for custom class', () => {
    const cssRule = generator.parseClass('center')
    expect(cssRule).toBe('.center { display: flex; align-items: center; justify-content: center; }')
  })

  it('should generate CSS from multiple class names', () => {
    const css = generator.create(['bg-primary', 'text-white', 'p-[calc(1rem_+_10px)]'])
    expect(css).toContain('.bg-primary { background-color: #ccf654; }')
    expect(css).toContain('.text-white { color: white; }')
    expect(css).toContain('.p-\\[calc\\(1rem_\\+_10px\\)\\] { padding: calc(1rem + 10px); }')
  })

  it('should generate CSS file from input files', () => {
    const mockReadFileSync = vi
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('<div class="bg-blue text-white"></div>')
    const mockWriteFileSync = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {})

    generator.generateFromFiles()

    expect(mockReadFileSync).toHaveBeenCalled()
    expect(mockWriteFileSync).toHaveBeenCalled()
    expect(mockWriteFileSync.mock.calls[0][1]).toContain('.bg-blue { background-color: blue; }')
    expect(mockWriteFileSync.mock.calls[0][1]).toContain('.text-white { color: white; }')

    // Restore the original functions
    mockReadFileSync.mockRestore()
    mockWriteFileSync.mockRestore()
  })
})
