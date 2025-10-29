import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TenoxUI } from '../src/index'
import type { Plugin, PluginFactory } from '../src/types'

describe('Core', () => {
  let tenox: TenoxUI

  beforeEach(() => {
    tenox = new TenoxUI({
      utilities: {
        p: 'padding',
        m: 'margin',
        w: 'width',
        h: 'height',
        bg: 'background-color',
        text: 'color',
        flex: 'display'
      },
      variants: {
        hover: '&:hover',
        focus: '&:focus',
        sm: '@media (min-width: 640px)',
        md: '@media (min-width: 768px)',
        lg: '@media (min-width: 1024px)'
      }
    })
  })

  describe('Basic Parsing and Processing', () => {
    it('should parse simple utility classes correctly', () => {
      const result = tenox.parse('p-4')
      expect(result).not.toBeNull()
      expect(result).toEqual(
        expect.arrayContaining([
          expect.stringContaining('p-4'),
          undefined, // variant
          'p', // utility
          '4' // value
        ])
      )
    })

    it('should parse variant-prefixed utility classes', () => {
      const result = tenox.parse('hover:bg-red')
      expect(result).not.toBeNull()
      expect(result).toEqual(
        expect.arrayContaining([
          expect.stringContaining('hover:bg-red'),
          'hover', // variant
          'bg', // utility
          'red' // value
        ])
      )
    })

    it('should return null for invalid class names', () => {
      const result = tenox.parse('invalid-class-name-that-doesnt-match')
      expect(result).toBeNull()
    })

    it('should process utilities and return correct structure', () => {
      const result = tenox.processUtility({
        utility: 'p',
        value: '4',
        className: 'p-4'
      })

      expect(result).toEqual({
        className: 'p-4',
        utility: 'padding',
        value: '4',
        variant: null,
        raw: expect.any(Array)
      })
    })

    it('should process utilities with variants', () => {
      const result = tenox.processUtility({
        variant: 'hover',
        utility: 'bg',
        value: 'blue',
        className: 'hover:bg-blue'
      })

      expect(result).toEqual({
        className: 'hover:bg-blue',
        utility: 'background-color',
        value: 'blue',
        variant: '&:hover',
        raw: expect.any(Array)
      })
    })
  })

  describe('Utility and Variant Management', () => {
    it('should add new utilities dynamically', () => {
      const initialParse = tenox.parse('border-2')
      expect(initialParse).toBeNull()

      tenox.addUtility('border', 'border-width')

      const afterAdd = tenox.parse('border-2')
      expect(afterAdd).not.toBeNull()
      expect(afterAdd[2]).toBe('border') // utility should be 'border'
    })

    it('should add multiple utilities at once', () => {
      tenox.addUtilities({
        'border-t': 'border-top-width',
        'border-r': 'border-right-width',
        'border-b': 'border-bottom-width',
        'border-l': 'border-left-width'
      })

      expect(tenox.parse('border-t-1')).not.toBeNull()
      expect(tenox.parse('border-r-2')).not.toBeNull()
      expect(tenox.parse('border-b-3')).not.toBeNull()
      expect(tenox.parse('border-l-4')).not.toBeNull()
    })

    it('should add new variants dynamically', () => {
      tenox.addVariant('dark', '@media (prefers-color-scheme: dark)')

      const result = tenox.processUtility({
        variant: 'dark',
        utility: 'bg',
        value: 'black',
        className: 'dark:bg-black'
      })

      expect(result?.variant).toBe('@media (prefers-color-scheme: dark)')
    })

    it('should remove utilities correctly', () => {
      expect(tenox.parse('p-4')).not.toBeNull()

      tenox.removeUtility('p')

      expect(tenox.parse('p-4')).toBeNull()
    })

    it('should remove variants correctly', () => {
      const beforeRemove = tenox.processUtility({
        variant: 'hover',
        utility: 'bg',
        value: 'red',
        className: 'hover:bg-red'
      })
      expect(beforeRemove?.variant).toBe('&:hover')

      tenox.removeVariant('hover')

      const afterRemove = tenox.processUtility({
        variant: 'hover',
        utility: 'bg',
        value: 'red',
        className: 'hover:bg-red'
      })
      expect(afterRemove?.variant).toBeNull()
    })
  })

  describe('Batch Processing', () => {
    it('should process multiple class names as string', () => {
      const result = tenox.process('p-4 m-2 hover:bg-red')

      expect(result).toHaveLength(3)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ className: 'p-4', utility: 'padding' }),
          expect.objectContaining({ className: 'm-2', utility: 'margin' }),
          expect.objectContaining({
            className: 'hover:bg-red',
            utility: 'background-color',
            variant: '&:hover'
          })
        ])
      )
    })

    it('should process multiple class names as array', () => {
      const result = tenox.process(['w-full', 'h-screen', 'flex'])

      expect(result).toHaveLength(3)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ utility: 'width' }),
          expect.objectContaining({ utility: 'height' }),
          expect.objectContaining({ utility: 'display' })
        ])
      )
    })

    it('should filter out invalid class names in batch processing', () => {
      const result = tenox.process('p-4 invalid-class m-2')

      expect(result).toHaveLength(2)
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ className: 'p-4' }),
          expect.objectContaining({ className: 'm-2' })
        ])
      )
    })

    it('should handle empty strings and whitespace', () => {
      const result = tenox.process('  p-4   m-2  ')
      expect(result).toHaveLength(2)

      const emptyResult = tenox.process('')
      expect(emptyResult).toBeNull()

      const whitespaceResult = tenox.process('   ')
      expect(whitespaceResult).toBeNull()
    })

    it('should return null for empty class lists', () => {
      const result = tenox.process([])
      expect(result).toBeNull()
    })
  })

  describe('Plugin System', () => {
    it('should execute plugin init hooks during construction', () => {
      const initSpy = vi.fn()
      const plugin: Plugin = {
        name: 'test-plugin',
        init: initSpy
      }

      new TenoxUI({
        utilities: { p: 'padding' },
        plugins: [plugin]
      })

      expect(initSpy).toHaveBeenCalledTimes(1)
      expect(initSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          utilities: expect.any(Object),
          variants: expect.any(Object),
          addUtility: expect.any(Function),
          addVariant: expect.any(Function)
        })
      )
    })

    it('should support plugin factories', () => {
      const mockPlugin: Plugin = {
        name: 'factory-plugin',
        init: vi.fn()
      }

      const pluginFactory: PluginFactory = () => mockPlugin

      const instance = new TenoxUI({
        utilities: { p: 'padding' },
        plugins: [pluginFactory]
      })

      expect(mockPlugin.init).toHaveBeenCalled()
    })

    it('should add plugins dynamically with use() method', () => {
      const initSpy = vi.fn()
      const plugin: Plugin = {
        name: 'dynamic-plugin',
        init: initSpy
      }

      tenox.use(plugin)
      expect(initSpy).toHaveBeenCalled()
    })

    it('should respect plugin priority ordering', () => {
      const executionOrder: string[] = []

      const lowPriorityPlugin: Plugin = {
        name: 'low-priority',
        priority: 1,
        value: (value) => {
          executionOrder.push('low')
          return null // Let other plugins handle it
        }
      }

      const highPriorityPlugin: Plugin = {
        name: 'high-priority',
        priority: 10,
        value: (value) => {
          executionOrder.push('high')
          return null // Let other plugins handle it
        }
      }

      const testInstance = new TenoxUI({
        utilities: { p: 'padding' },
        plugins: [lowPriorityPlugin, highPriorityPlugin]
      })

      testInstance.processUtility({ utility: 'p', value: '4' })

      expect(executionOrder[0]).toBe('high')
      expect(executionOrder[1]).toBe('low')
    })

    it('should handle plugin errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const faultyPlugin: Plugin = {
        name: 'faulty-plugin',
        init: () => {
          throw new Error('Plugin initialization failed')
        }
      }

      expect(() => {
        new TenoxUI({
          utilities: { p: 'padding' },
          plugins: [faultyPlugin]
        })
      }).not.toThrow()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Plugin "faulty-plugin" init failed:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('RegExp and Cache Management', () => {
    it('should generate correct regex patterns', () => {
      const regexpResult = tenox.regexp()

      expect(regexpResult.patterns).toEqual({
        variant: expect.stringContaining('hover'),
        utility: expect.stringContaining('p|m|w|h|bg'),
        value: expect.any(String)
      })
      expect(regexpResult.matcher).toBeInstanceOf(RegExp)
    })

    it('should cache regex patterns for performance', () => {
      const firstCall = tenox.regexp()
      const secondCall = tenox.regexp()

      expect(firstCall).toBe(secondCall) // Same object reference
    })

    it('should invalidate cache when utilities are modified', () => {
      const initialRegexp = tenox.regexp()

      tenox.addUtility('border', 'border-width')

      const newRegexp = tenox.regexp()
      expect(newRegexp).not.toBe(initialRegexp)
      expect(newRegexp.patterns.utility).toContain('border')
    })

    it('should update matcher when cache is invalidated', () => {
      const initialMatcher = tenox.matcher

      tenox.addUtility('new-util', 'new-utility')

      expect(tenox.matcher).not.toBe(initialMatcher)
    })

    it('should handle empty utilities and variants gracefully', () => {
      const emptyInstance = new TenoxUI({
        utilities: {},
        variants: {}
      })

      const regexpResult = emptyInstance.regexp()
      expect(regexpResult.patterns.variant).toBe('[\\w.-]+') // DEFAULT_GLOBAL_PATTERN
      expect(regexpResult.patterns.utility).toBe('[\\w.-]+') // DEFAULT_GLOBAL_PATTERN
    })
  })
})
