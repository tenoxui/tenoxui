import { describe, it, expect, beforeEach } from 'vitest'
import { TenoxUI, type TenoxUIParams } from '../src/index.ts'

describe('TenoxUI', () => {
  let tenoxui: TenoxUI

  describe('Constructor', () => {
    it('should initialize with empty parameters', () => {
      const instance = new TenoxUI()
      expect(instance).toBeInstanceOf(TenoxUI)
    })

    it('should initialize with provided parameters', () => {
      const params: TenoxUIParams = {
        property: { bg: 'backgroundColor' },
        values: { red: '#ff0000' },
        aliases: { btn: 'bg-blue p-2' },
        breakpoints: [{ name: 'sm', min: 640 }],
        reserveClass: ['bg-blue']
      }
      const instance = new TenoxUI(params)
      expect(instance).toBeInstanceOf(TenoxUI)
    })
  })

  describe('Case Conversion', () => {
    beforeEach(() => {
      tenoxui = new TenoxUI()
    })

    it('should convert to camelCase', () => {
      expect(tenoxui.toCamelCase('background-color')).toBe('backgroundColor')
      expect(tenoxui.toCamelCase('border-top-width')).toBe('borderTopWidth')
    })

    it('should convert to kebab-case', () => {
      expect(tenoxui.toKebabCase('backgroundColor')).toBe('background-color')
      expect(tenoxui.toKebabCase('borderTopWidth')).toBe('border-top-width')
    })

    it('should handle vendor prefixes in kebab-case', () => {
      expect(tenoxui.toKebabCase('webkitTransform')).toBe('-webkit-transform')
      expect(tenoxui.toKebabCase('mozBorderRadius')).toBe('-moz-border-radius')
    })
  })

  describe('CSS Selector Escaping', () => {
    beforeEach(() => {
      tenoxui = new TenoxUI()
    })
    it('should escape special characters in CSS selectors', () => {
      expect(tenoxui.escapeCSSSelector('bg#red')).toBe('bg\\#red')
      expect(tenoxui.escapeCSSSelector('margin.2')).toBe('margin\\.2')
      expect(tenoxui.escapeCSSSelector('[rgb(255_255_10_/_0.5)]')).toBe(
        '\\[rgb\\(255_255_10_/_0\\.5\\)\\]'
      )
    })
  })

  describe('Stylesheet Generation', () => {
    it('should generate basic styles', () => {
      const params: TenoxUIParams = {
        property: {
          bg: 'backgroundColor',
          text: 'color',
          box: ['width', 'height']
        },
        values: {
          red: '#ff0000',
          blue: '#0000ff',
          primary: '#ccf654'
        }
      }

      tenoxui = new TenoxUI(params)
      tenoxui.processClassNames('bg-red text-blue bg-primary box-100px hover:box-200px')

      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('.bg-red { background-color: #ff0000; }')
      expect(stylesheet).toContain('.text-blue { color: #0000ff; }')
      expect(stylesheet).toContain('.bg-primary { background-color: #ccf654; }')
      expect(stylesheet).toContain('.box-100px { width: 100px; height: 100px; }')
      expect(stylesheet).toContain('.hover\\:box-200px:hover { width: 200px; height: 200px; }')
    })

    it('should handle media queries', () => {
      const params: TenoxUIParams = {
        property: {
          w: 'width'
        },
        breakpoints: [{ name: 'sm', min: 640 }]
      }

      tenoxui = new TenoxUI(params)
      tenoxui.processClassNames('sm:w-100px')

      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('@media (min-width: 640px)')
      expect(stylesheet).toContain('width: 100px')
    })
  })

  describe('Alias Processing', () => {
    it('should process aliases correctly', () => {
      const params: TenoxUIParams = {
        property: {
          bg: 'backgroundColor',
          p: 'padding'
        },
        aliases: {
          btn: 'bg-blue p-24px'
        }
      }

      tenoxui = new TenoxUI(params)
      tenoxui.processClassNames('btn')

      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('background-color: blue')
      expect(stylesheet).toContain('padding: 24px')
    })
  })

  // Custom value processing tests
  describe('Value Processing', () => {
    it('should handle CSS variables', () => {
      const params: TenoxUIParams = {
        property: {
          text: 'color'
        },
        values: {},
        classes: {},
        aliases: {},
        breakpoints: [],
        reserveClass: []
      }

      tenoxui = new TenoxUI(params)
      tenoxui.processClassNames('text-$primary')

      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('color: var(--primary)')
    })

    it('should handle custom values in brackets', () => {
      const params: TenoxUIParams = {
        property: {
          grid: 'grid-template-columns'
        },
        values: {},
        classes: {},
        aliases: {},
        breakpoints: [],
        reserveClass: []
      }

      tenoxui = new TenoxUI(params)
      tenoxui.processClassNames('grid-[repeat(2,_1fr)]')

      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('grid-template-columns: repeat(2, 1fr)')
    })
  })

  describe('Reserved Classes', () => {
    it('should process reserved classes on initialization', () => {
      const params: TenoxUIParams = {
        property: {
          bg: 'backgroundColor'
        },
        values: {
          primary: '#ccf654'
        },
        reserveClass: ['bg-primary', '[background,--red]-[rgb(var(--color,_255_0_0))]']
      }

      tenoxui = new TenoxUI(params)
      const stylesheet = tenoxui.generateStylesheet()
      expect(stylesheet).toContain('.bg-primary { background-color: #ccf654; }')
      expect(stylesheet).toContain(
        '.\\[background\\,--red\\]-\\[rgb\\(var\\(--color\\,_255_0_0\\)\\)\\] { background: rgb(var(--color, 255 0 0)); --red: rgb(var(--color, 255 0 0)); }'
      )
    })
  })
})
