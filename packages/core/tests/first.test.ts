import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TenoxUI } from '../src/index'
import type { Plugin, Utilities, Variants, ProcessResult } from '../src/types'

describe('TenoxUI', () => {
  let tx: TenoxUI

  const mockUtilities: Utilities = {
    m: 'margin',
    p: 'padding',
    bg: 'background-color',
    text: 'color',
    w: 'width',
    h: 'height'
  }

  const mockVariants: Variants = {
    hover: ':hover',
    focus: ':focus',
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)'
  }

  beforeEach(() => {
    tx = new TenoxUI({
      utilities: mockUtilities,
      variants: mockVariants
    })
  })

  describe('Constructor', () => {
    it('should create instance with default empty config', () => {
      const instance = new TenoxUI()
      expect(instance).toBeInstanceOf(TenoxUI)
      expect(instance.matcher).toBeInstanceOf(RegExp)
    })

    it('should create instance with provided config', () => {
      const instance = new TenoxUI({
        utilities: mockUtilities,
        variants: mockVariants,
        plugins: []
      })
      expect(instance).toBeInstanceOf(TenoxUI)
      expect(instance.matcher).toBeInstanceOf(RegExp)
    })

    it('should sort plugins by priority on initialization', () => {
      const plugin1: Plugin = { name: 'plugin1', priority: 1 }
      const plugin2: Plugin = { name: 'plugin2', priority: 3 }
      const plugin3: Plugin = { name: 'plugin3', priority: 2 }

      const instance = new TenoxUI({
        plugins: [plugin1, plugin2, plugin3]
      })

      const sortedPlugins = instance.getPluginsByPriority()
      expect(sortedPlugins[0].name).toBe('plugin2') // priority 3
      expect(sortedPlugins[1].name).toBe('plugin3') // priority 2
      expect(sortedPlugins[2].name).toBe('plugin1') // priority 1
    })
  })

  describe('Plugin', () => {
    it('should add plugin with use() method', () => {
      const plugin: Plugin = { name: 'test-plugin', priority: 5 }
      const result = tx.use(plugin)

      expect(result).toBe(tx) // should return this for chaining
      expect(tx.getPluginsByPriority()).toContain(plugin)
    })

    it('should maintain plugin priority order when adding new plugins', () => {
      const plugin1: Plugin = { name: 'plugin1', priority: 1 }
      const plugin2: Plugin = { name: 'plugin2', priority: 5 }
      const plugin3: Plugin = { name: 'plugin3', priority: 3 }

      tx.use(plugin1, plugin2, plugin3)

      const plugins = tx.getPluginsByPriority()
      expect(plugins[0].name).toBe('plugin2') // priority 5
      expect(plugins[1].name).toBe('plugin3') // priority 3
      expect(plugins[2].name).toBe('plugin1') // priority 1
    })

    it('should invalidate cache when adding plugins', () => {
      const plugin: Plugin = { name: 'test-plugin' }

      // Get initial cached result
      const initialResult = tx.regexp()

      // Add plugin (should invalidate cache)
      tx.use(plugin)

      // Get result after plugin addition
      const afterPluginResult = tx.regexp()

      // Should be different objects due to cache invalidation
      expect(afterPluginResult).not.toBe(initialResult)
    })
  })

  describe('RegExp', () => {
    it('should generate regex with default patterns', () => {
      const result = tx.regexp()

      expect(result).toHaveProperty('patterns')
      expect(result).toHaveProperty('matcher')
      expect(result.matcher).toBeInstanceOf(RegExp)
      expect(result.patterns.variant).toContain('hover')
      expect(result.patterns.property).toContain('bg')
    })

    it('should cache regex results', () => {
      const result1 = tx.regexp()
      const result2 = tx.regexp()

      expect(result1).toBe(result2) // same reference due to caching
    })

    it('should call plugin regexp methods', () => {
      const regexpSpy = vi.fn(() => ({
        patterns: { custom: 'test' },
        matcher: /test/
      }))

      const plugin: Plugin = {
        name: 'regexp-plugin',
        regexp: regexpSpy
      }

      tx.use(plugin)
      tx.regexp()

      expect(regexpSpy).toHaveBeenCalled()
    })

    it('should use plugin to set new matcher', () => {
      const regexPlugin = {
        name: 'regexp-plugin',
        priority: 1,
        regexp({ patterns }) {
          return {
            patterns: {
              property: patterns.property + '|tenox'
            }
          }
        }
      }
      const regexPlugin2 = {
        name: 'regexp-plugi2n',
        priority: 2,
        regexp({ patterns }) {
          return {
            patterns: {
              property: patterns.property + '|tenox2'
            }
          }
        }
      }

      tx.use(regexPlugin, regexPlugin2)

      expect(tx.matcher.source).toContain('m|p|bg|text|w|h|tenox2|tenox')
    })

    it('should handle plugin regexp errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        regexp: () => {
          throw new Error('Test error')
        }
      }

      tx.use(plugin)
      const result = tx.regexp()

      expect(result).toBeDefined()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" regexp failed:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Parse', () => {
    it('should parse simple class names correctly', () => {
      const result = tx.parse('m-4')
      expect(result).toEqual(['m-4', undefined, 'm', '4'])
    })

    it('should parse class names with variants', () => {
      const result = tx.parse('hover:bg-red')
      expect(result).toEqual(['hover:bg-red', 'hover', 'bg', 'red'])
    })

    it('should return null for invalid class names', () => {
      const result = tx.parse('invalid-class-name')
      expect(result).toBeNull()
    })

    it('should call plugin parse methods first', () => {
      const parseSpy = vi.fn(() => ['plugin-result'])
      const plugin: Plugin = {
        name: 'parse-plugin',
        parse: parseSpy
      }

      tx.use(plugin)
      const result = tx.parse('test-class')

      expect(parseSpy).toHaveBeenCalledWith('test-class', expect.any(Object))
      expect(result).toEqual(['plugin-result'])
    })

    it('should handle plugin parse errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        parse: () => {
          throw new Error('Parse error')
        }
      }

      tx.use(plugin)
      const result = tx.parse('m-4')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" parse failed:',
        expect.any(Error)
      )
      // Should still return default parse result
      expect(result).toEqual(['m-4', undefined, 'm', '4'])

      consoleSpy.mockRestore()
    })
  })

  describe('Process Value', () => {
    it('should return null for empty values', () => {
      const result = tx['processValue']('')
      expect(result).toBeNull()
    })

    it('should return value as-is when no plugins process it', () => {
      const result = tx['processValue']('red')
      expect(result).toBe('red')
    })

    it('should call plugin processValue methods', () => {
      const processValueSpy = vi.fn(() => 'processed-value')
      const plugin: Plugin = {
        name: 'value-plugin',
        processValue: processValueSpy
      }

      tx.use(plugin)
      const result = tx['processValue']('test-value')

      expect(processValueSpy).toHaveBeenCalledWith('test-value', mockUtilities)
      expect(result).toBe('processed-value')
    })

    it('should handle plugin processValue errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        processValue: () => {
          throw new Error('ProcessValue error')
        }
      }

      tx.use(plugin)
      const result = tx['processValue']('test')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" processValue failed:',
        expect.any(Error)
      )
      expect(result).toBe('test') // fallback to original value

      consoleSpy.mockRestore()
    })
  })

  describe('Process Variant', () => {
    it('should return null for empty variants', () => {
      const result = tx['processVariant']('')
      expect(result).toBeNull()
    })

    it('should return variant data from variants config', () => {
      const result = tx['processVariant']('hover')
      expect(result).toBe(':hover')
    })

    it('should call plugin processVariant methods first', () => {
      const processVariantSpy = vi.fn(() => 'processed-variant')
      const plugin: Plugin = {
        name: 'variant-plugin',
        processVariant: processVariantSpy
      }

      tx.use(plugin)
      const result = tx['processVariant']('hover')

      expect(processVariantSpy).toHaveBeenCalledWith('hover', mockVariants)
      expect(result).toBe('processed-variant')
    })

    it('should handle plugin processVariant errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        processVariant: () => {
          throw new Error('ProcessVariant error')
        }
      }

      tx.use(plugin)
      const result = tx['processVariant']('hover')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" processVariant failed:',
        expect.any(Error)
      )
      expect(result).toBe(':hover') // fallback to default processing

      consoleSpy.mockRestore()
    })
  })

  describe('Process Utilities', () => {
    it('should process simple utility correctly', () => {
      const result = tx.processUtilities({
        property: 'm',
        value: '4',
        className: 'm-4'
      })

      expect(result).toEqual({
        className: 'm-4',
        variant: null,
        property: 'margin',
        value: '4',
        raw: ['m-4', undefined, 'm', '4']
      })
    })

    it('should process utility with variant', () => {
      const result = tx.processUtilities({
        variant: 'hover',
        property: 'bg',
        value: 'red',
        className: 'hover:bg-red'
      })
      const result2 = tx.processUtilities({
        variant: 'hover2',
        property: 'bg',
        value: 'red',
        className: 'hover2:bg-red'
      })

      expect(result).toEqual({
        className: 'hover:bg-red',
        variant: ':hover',
        property: 'background-color',
        value: 'red',
        raw: ['hover:bg-red', 'hover', 'bg', 'red']
      })
      expect(result2).toEqual({
        className: 'hover2:bg-red',
        variant: null,
        property: 'background-color',
        value: 'red',
        raw: null
      })
    })

    it('should return null for unknown properties', () => {
      const result = tx.processUtilities({
        property: 'unknown',
        value: 'test',
        className: 'unknown-test'
      })

      expect(result).toBeNull()
    })

    it('should call plugin processUtilities methods first', () => {
      const processUtilitiesSpy = vi.fn(() => ({ test: 'result' }) as ProcessResult)
      const plugin: Plugin = {
        name: 'utilities-plugin',
        processUtilities: processUtilitiesSpy
      }

      tx.use(plugin)
      const result = tx.processUtilities({
        property: 'm',
        value: '4',
        className: 'm-4'
      })

      expect(processUtilitiesSpy).toHaveBeenCalled()
      expect(result).toEqual({ test: 'result' })
    })

    it('should handle plugin processUtilities errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        processUtilities: () => {
          throw new Error('ProcessUtilities error')
        }
      }

      tx.use(plugin)
      const result = tx.processUtilities({
        property: 'm',
        value: '4',
        className: 'm-4'
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" processUtilities failed:',
        expect.any(Error)
      )
      // Should still return default processing result
      expect(result).toBeDefined()

      consoleSpy.mockRestore()
    })
  })

  describe('Process Method', () => {
    it('should process single class name string', () => {
      const result = tx.process('m-4')

      expect(result).toHaveLength(1)
      expect(result![0]).toEqual({
        className: 'm-4',
        variant: null,
        property: 'margin',
        value: '4',
        raw: ['m-4', undefined, 'm', '4']
      })
    })

    it('should process multiple class names in string', () => {
      const result = tx.process('m-4 p-2 hover:bg-red')

      expect(result).toHaveLength(3)
      expect(result![0].className).toBe('m-4')
      expect(result![1].className).toBe('p-2')
      expect(result![2].className).toBe('hover:bg-red')
    })

    it('should process array of class names', () => {
      const result = tx.process(['m-4', 'p-2'])

      expect(result).toHaveLength(2)
      expect(result![0].className).toBe('m-4')
      expect(result![1].className).toBe('p-2')
    })

    it('should skip empty class names', () => {
      const result = tx.process(['m-4', '', '  ', 'p-2'])

      expect(result).toHaveLength(2)
      expect(result![0].className).toBe('m-4')
      expect(result![1].className).toBe('p-2')
    })

    it('should return null for no valid class names', () => {
      const result = tx.process('invalid-class unknown-prop')
      expect(result).toBeNull()
    })

    it('should call plugin process methods first', () => {
      const processSpy = vi.fn(() => ({ test: 'plugin-result' }) as ProcessResult)
      const plugin: Plugin = {
        name: 'process-plugin',
        process: processSpy
      }

      tx.use(plugin)
      const result = tx.process('test-class')

      expect(processSpy).toHaveBeenCalledWith('test-class', expect.any(Object))
      expect(result![0]).toEqual({ test: 'plugin-result' })
    })

    it('should handle plugin process errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const plugin: Plugin = {
        name: 'error-plugin',
        process: () => {
          throw new Error('Process error')
        }
      }

      tx.use(plugin)
      const result = tx.process('m-4')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" process failed:',
        expect.any(Error)
      )
      // Should still process with default parser
      expect(result).toHaveLength(1)
      expect(result![0].className).toBe('m-4')

      consoleSpy.mockRestore()
    })
  })

  describe('Utility Methods', () => {
    it('should return plugins sorted by priority', () => {
      const plugin1: Plugin = { name: 'plugin1', priority: 1 }
      const plugin2: Plugin = { name: 'plugin2', priority: 3 }
      const plugin3: Plugin = { name: 'plugin3' } // no priority = 0

      tx.use(plugin1).use(plugin2).use(plugin3)

      const sorted = tx.getPluginsByPriority()
      expect(sorted[0].name).toBe('plugin2') // priority 3
      expect(sorted[1].name).toBe('plugin1') // priority 1
      expect(sorted[2].name).toBe('plugin3') // priority 0 (default)
    })

    it('should clear cache and reinitialize matcher', () => {
      // Get initial regexp result
      const initial = tx.regexp()

      // Clear cache
      const result = tx.clearCache()

      expect(result).toBe(tx) // should return this for chaining

      // Should generate new regexp (not cached)
      const afterClear = tx.regexp()
      expect(afterClear).not.toBe(initial) // different reference
      expect(afterClear.matcher).toBeInstanceOf(RegExp)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined/null values gracefully', () => {
      expect(() => tx.parse('')).not.toThrow()
      expect(() => tx.process('')).not.toThrow()
      expect(() => tx.processUtilities({})).not.toThrow()
    })

    it('should handle plugins returning null/undefined', () => {
      const plugin: Plugin = {
        name: 'null-plugin',
        parse: () => null,
        processValue: () => null,
        processVariant: () => null,
        processUtilities: () => null,
        process: () => null
      }

      tx.use(plugin)

      expect(() => tx.parse('m-4')).not.toThrow()
      expect(() => tx.process('m-4')).not.toThrow()
    })

    it('should handle empty utilities and variants', () => {
      const emptyTenox = new TenoxUI({
        utilities: {},
        variants: {}
      })

      const result = emptyTenox.process('m-4')
      expect(result).toBeNull()
    })

    it('should handle plugin priority edge cases', () => {
      const plugin1: Plugin = { name: 'plugin1', priority: -1 }
      const plugin2: Plugin = { name: 'plugin2', priority: 0 }
      const plugin3: Plugin = { name: 'plugin3' } // undefined priority

      tx.use(plugin1).use(plugin2).use(plugin3)

      const sorted = tx.getPluginsByPriority()
      expect(sorted[0].priority).toBe(0) // plugin2
      expect(sorted[1].priority).toBeUndefined() // plugin3 (undefined priority)
      expect(sorted[2].priority).toBe(-1) // plugin1
    })
  })
})
