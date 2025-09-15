import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Renderer } from '../src/lib/renderer'

// Mock the dependencies
const mockProcessor = {
  process: vi.fn()
}

describe('Renderer', () => {
  let renderer: Renderer

  beforeEach(() => {
    renderer = new Renderer({
      main: mockProcessor,
      aliases: {
        btn: 'bg-blue text-white p-2',
        card: ['bg-white', 'shadow-lg', 'rounded']
      },
      apply: {
        '.custom': 'bg-red text-white'
      }
    })

    mockProcessor.process.mockClear()
  })

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const emptyRenderer = new Renderer()
      expect(emptyRenderer.render()).toBe('')
    })

    it('should initialize with provided config', () => {
      expect(renderer).toBeInstanceOf(Renderer)
    })
  })

  describe('processClassesToRules', () => {
    it('should process classes to rules', () => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'bg-red',
          rules: { property: 'background-color', value: 'red' },
          variant: null,
          isImportant: false,
          raw: []
        }
      ])

      const result = renderer.processClassesToRules('.test', 'bg-red')

      expect(result).toHaveLength(1)
      expect(result[0]).toContain('.test')
      expect(result[0]).toContain('background-color: red')
    })

    it('should handle variant rules separately', () => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'hover:bg-red',
          rules: { property: 'background-color', value: 'red' },
          variant: '&:hover',
          isImportant: false,
          raw: []
        }
      ])

      const result = renderer.processClassesToRules('.test', 'hover:bg-red')

      expect(result).toHaveLength(1)
      expect(result[0]).toBe('.test:hover { background-color: red }')
    })

    it('should warn when main processor not provided', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const emptyRenderer = new Renderer()

      const result = emptyRenderer.processClassesToRules('.test', 'bg-red')

      expect(result).toHaveLength(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Main processor not provided')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('processObjectRules', () => {
    it('should process object rules', () => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'bg-red',
          rules: { property: 'background-color', value: 'red' },
          variant: null,
          isImportant: false,
          raw: []
        }
      ])

      const result = renderer.processObjectRules({
        '.button': 'bg-red text-white',
        '.card': 'bg-white shadow'
      })

      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('processAlias', () => {
    it('should process known aliases', () => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'bg-blue',
          rules: { property: 'background-color', value: 'blue' },
          variant: null,
          isImportant: false,
          raw: []
        }
      ])

      const result = renderer.processAlias('btn')

      expect(result.length).toBeGreaterThan(0)
      expect(mockProcessor.process).toHaveBeenCalledWith('bg-blue text-white p-2')
    })

    it('should warn for unknown aliases', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = renderer.processAlias('unknown')

      expect(result).toHaveLength(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith("Alias 'unknown' not found")

      consoleWarnSpy.mockRestore()
    })
  })

  describe('alias management', () => {
    it('should add new alias', () => {
      renderer.addAlias('new-btn', 'bg-green text-white')

      mockProcessor.process.mockReturnValue([])
      renderer.processAlias('new-btn')

      expect(mockProcessor.process).toHaveBeenCalledWith('bg-green text-white')
    })

    it('should remove alias', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      renderer.removeAlias('btn')
      renderer.processAlias('btn')

      expect(consoleWarnSpy).toHaveBeenCalledWith("Alias 'btn' not found")

      consoleWarnSpy.mockRestore()
    })

    it('should handle removing non-existent alias', () => {
      expect(() => renderer.removeAlias('non-existent')).not.toThrow()
    })
  })

  describe('render', () => {
    beforeEach(() => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'bg-red',
          rules: { property: 'background-color', value: 'red' },
          variant: null,
          isImportant: false,
          raw: []
        }
      ])
    })

    it('should render string input', () => {
      const result = renderer.render('bg-red text-white')

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should render array input', () => {
      const result = renderer.render(['bg-red', 'text-white'])

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should render object input', () => {
      const result = renderer.render({
        '.button': 'bg-blue text-white',
        '.card': 'bg-white shadow'
      })

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should render multiple arguments', () => {
      const result = renderer.render('bg-red', ['text-white'], { '.custom': 'p-4' })

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should include apply rules', () => {
      const result = renderer.render('bg-red')

      // Apply rules should be included
      expect(result).toContain('.custom')
    })

    it('should process aliases before regular classes', () => {
      mockProcessor.process.mockReturnValue([
        {
          use: 'moxie',
          className: 'bg-blue',
          rules: { property: 'background-color', value: 'blue' },
          variant: null,
          isImportant: false,
          raw: []
        }
      ])

      const result = renderer.render('btn bg-red')

      // Should contain both alias and regular class rules
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty input gracefully', () => {
      const result = renderer.render('')

      // Should still include apply rules
      expect(result).toContain('.custom')
    })
  })

  describe('clear', () => {
    it('should clear aliases and apply rules', () => {
      renderer.clear()

      const result = renderer.render('btn')

      // Should not contain apply rules or process btn alias
      expect(result).not.toContain('.custom')
    })
  })

  describe('sanitize (private method behavior)', () => {
    it('should handle string class names', () => {
      mockProcessor.process.mockReturnValue([])

      renderer.render('class1   class2   class3')

      // Should split and clean whitespace
      expect(mockProcessor.process).toHaveBeenCalledWith(['class1', 'class2', 'class3'])
    })

    it('should filter empty strings', () => {
      mockProcessor.process.mockReturnValue([])

      renderer.render('class1  ')

      expect(mockProcessor.process).toHaveBeenCalledWith(['class1'])
    })

    it('should separate aliases from regular classes', () => {
      mockProcessor.process.mockReturnValue([])

      const result = renderer.render('btn regular-class')

      // btn should be processed as alias, regular-class as normal
      expect(mockProcessor.process).toHaveBeenCalledWith(['regular-class'])
    })
  })
})
