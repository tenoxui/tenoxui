import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TenoxUI } from '../src/index'
import type {
  Plugin,
  Utilities,
  Variants,
  ProcessResult,
  PluginFactory,
  PluginLike
} from '../src/types'

describe('TenoxUI Plugin Ecosystem', () => {
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

  describe('Plugin Method Interactions', () => {
    it('should call plugins in correct priority order for regexp', () => {
      const calls: string[] = []

      const plugins = [
        {
          name: 'low-priority',
          priority: 1,
          regexp: () => {
            calls.push('low')
            return { patterns: { value: 'low' } }
          }
        },
        {
          name: 'high-priority',
          priority: 3,
          regexp: () => {
            calls.push('high')
            return { patterns: { value: 'high' } }
          }
        },
        {
          name: 'medium-priority',
          priority: 2,
          regexp: () => {
            calls.push('medium')
            return { patterns: { value: 'medium' } }
          }
        }
      ]

      tx.use(...plugins)
      tx.regexp()

      expect(calls).toEqual(['high', 'medium', 'low'])
    })

    it("should allow plugins to modify each other's patterns", () => {
      const plugin1: Plugin = {
        name: 'plugin1',
        priority: 2,
        regexp: ({ patterns }) => ({
          patterns: { property: patterns.property + '|custom1' }
        })
      }

      const plugin2: Plugin = {
        name: 'plugin2',
        priority: 1,
        regexp: ({ patterns }) => ({
          patterns: { property: patterns.property + '|custom2' }
        })
      }

      tx.use(plugin1, plugin2)
      const result = tx.regexp()

      // plugin1 runs first (higher priority), then plugin2
      expect(result.patterns.property).toBe('m|p|bg|text|w|h|custom1|custom2')
    })

    it('should allow plugins to provide custom matchers', () => {
      const customMatcher = /^custom-(.+)$/

      const plugin: Plugin = {
        name: 'custom-matcher',
        regexp: () => ({
          matcher: customMatcher
        })
      }

      tx.use(plugin)
      const result = tx.regexp()

      expect(result.matcher).toBe(customMatcher)
    })

    it('should allow plugins to provide custom matchers 2', () => {
      const defaultMatcher = '[\\w.-]+'

      const plugin: Plugin = {
        name: 'custom-matcher',
        regexp: ({ patterns }) => {
          const { variant, property, value } = patterns

          return {
            matcher: new RegExp(
              `^(?:(?<variant>${variant}):)?(?<property>${property})(?:-)((?<value>${value}?))?$`
            )
          }
        }
      }

      tx.use(plugin)
      const result = tx.regexp()

      expect(result.matcher).toStrictEqual(
        /^(?:(?<variant>hover|focus|sm|md):)?(?<property>m|p|bg|text|w|h)(?:-)((?<value>[\w.-]+?))?$/
      )
    })
  })

  describe('Complex Plugin Workflows', () => {
    it('should handle a complete custom utility plugin', () => {
      const flexPlugin: Plugin = {
        name: 'flex-plugin',
        priority: 5,
        regexp: ({ patterns }) => ({
          patterns: {
            property: patterns.property + '|flex|items|justify'
          }
        }),
        processUtilities: (context) => {
          const { className } = context

          if (className.startsWith('flex-')) {
            return {
              className,
              property: 'display',
              value: 'flex',
              variant: null,
              raw: null
            }
          }

          if (className.startsWith('items-')) {
            const value = className.replace('items-', '')
            return {
              className,
              property: 'align-items',
              value,
              variant: null,
              raw: null
            }
          }

          return null
        }
      }

      tx.use(flexPlugin)

      const flexResult = tx.processUtilities({
        property: 'flex',
        value: 'row',
        className: 'flex-row'
      })

      const itemsResult = tx.processUtilities({
        property: 'items',
        value: 'center',
        className: 'items-center'
      })

      expect(flexResult).toEqual({
        className: 'flex-row',
        property: 'display',
        value: 'flex',
        variant: null,
        raw: null
      })

      expect(itemsResult).toEqual({
        className: 'items-center',
        property: 'align-items',
        value: 'center',
        variant: null,
        raw: null
      })
    })

    it('should handle value transformation plugins', () => {
      const spacingPlugin: Plugin = {
        name: 'spacing-plugin',
        priority: 3,
        processValue: (value, utilities) => {
          // Transform numeric values to rem units
          if (/^\d+$/.test(value)) {
            return `${parseInt(value) * 0.25}rem`
          }
          return null
        }
      }

      tx.use(spacingPlugin)

      const result = tx.processUtilities({
        property: 'm',
        value: '4',
        className: 'm-4'
      })

      expect(result?.value).toBe('1rem')
    })

    it('should handle custom variant plugins', () => {
      const darkModePlugin: Plugin = {
        name: 'dark-mode-plugin',
        priority: 2,
        regexp: ({ patterns }) => ({
          patterns: {
            variant: patterns.variant + '|dark'
          }
        }),
        processVariant: (variant, variants) => {
          if (variant === 'dark') {
            return '@media (prefers-color-scheme: dark)'
          }
          return null
        }
      }

      tx.use(darkModePlugin)

      const result = tx.processUtilities({
        variant: 'dark',
        property: 'bg',
        value: 'black',
        className: 'dark:bg-black'
      })

      expect(result?.variant).toBe('@media (prefers-color-scheme: dark)')
    })
  })

  describe('Plugin Transform Method', () => {
    it('should call transform plugins after processing', () => {
      const transformPlugin: Plugin = {
        name: 'transform-plugin',
        transform: (results) => {
          // Add a prefix to all properties
          return results.map((result) => ({
            ...result,
            property: `--tw-${result.property}`
          }))
        }
      }

      tx.use(transformPlugin)

      const results = tx.process(['m-4', 'p-2'])

      expect(results).toHaveLength(2)
      expect(results![0].property).toBe('--tw-margin')
      expect(results![1].property).toBe('--tw-padding')
    })

    it('should handle transform plugins that return single result', () => {
      const combinerPlugin: Plugin = {
        name: 'combiner-plugin',
        transform: (results) => {
          if (results.length > 1) {
            return {
              combined: true,
              properties: results.map((r) => r.property),
              values: results.map((r) => r.value)
            }
          }
          return results
        }
      }

      tx.use(combinerPlugin)

      const result = tx.process(['m-4', 'p-2'])

      expect(result).toEqual({
        combined: true,
        properties: ['margin', 'padding'],
        values: ['4', '2']
      })
    })
  })

  describe('processWithPlugin Method', () => {
    it('should process className with specific plugin', () => {
      const specialPlugin: Plugin = {
        name: 'special-plugin',
        process: (className) => {
          if (className.startsWith('special-')) {
            return {
              className,
              type: 'special',
              value: className.replace('special-', '')
            }
          }
          return null
        }
      }

      tx.use(specialPlugin)

      const result = tx.processWithPlugin('special-test', 'special-plugin')
      expect(result).toEqual({
        className: 'special-test',
        type: 'special',
        value: 'test'
      })
    })

    it('should return null for non-existent plugin', () => {
      const result = tx.processWithPlugin('test-class', 'non-existent')
      expect(result).toBeNull()
    })

    it('should return null for plugin without process method', () => {
      const plugin: Plugin = { name: 'no-process' }
      tx.use(plugin)

      const result = tx.processWithPlugin('test-class', 'no-process')
      expect(result).toBeNull()
    })

    it('should handle plugin process errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorPlugin: Plugin = {
        name: 'error-plugin',
        process: () => {
          throw new Error('Process failed')
        }
      }

      tx.use(errorPlugin)

      const result = tx.processWithPlugin('test', 'error-plugin')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin "error-plugin" process failed:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Plugin Context Objects', () => {
    it('should provide complete context to regexp plugins', () => {
      let receivedContext: any

      const contextPlugin: Plugin = {
        name: 'context-plugin',
        regexp: (context) => {
          receivedContext = context
          return null
        }
      }

      tx.use(contextPlugin)
      tx.regexp()

      expect(receivedContext).toHaveProperty('patterns')
      expect(receivedContext).toHaveProperty('matcher')
      expect(receivedContext).toHaveProperty('utilities')
      expect(receivedContext).toHaveProperty('variants')
      expect(receivedContext.utilities).toBe(mockUtilities)
      expect(receivedContext.variants).toBe(mockVariants)
    })

    it('should provide complete context to processUtilities plugins', () => {
      let receivedContext: any

      const contextPlugin: Plugin = {
        name: 'context-plugin',
        processUtilities: (context) => {
          receivedContext = context
          return null
        }
      }

      tx.use(contextPlugin)
      tx.processUtilities({
        property: 'm',
        value: '4',
        className: 'm-4'
      })

      expect(receivedContext).toHaveProperty('className')
      expect(receivedContext).toHaveProperty('property')
      expect(receivedContext).toHaveProperty('value')
      expect(receivedContext).toHaveProperty('variant')
      expect(receivedContext).toHaveProperty('raw')
      expect(receivedContext).toHaveProperty('utilities')
      expect(receivedContext).toHaveProperty('variants')
      expect(receivedContext).toHaveProperty('parser')
      expect(receivedContext).toHaveProperty('regexp')

      expect(typeof receivedContext.parser).toBe('function')
      expect(typeof receivedContext.regexp).toBe('function')
    })

    it('should provide complete context to process plugins', () => {
      let receivedContext: any

      const contextPlugin: Plugin = {
        name: 'context-plugin',
        process: (className, context) => {
          receivedContext = context
          return null
        }
      }

      tx.use(contextPlugin)
      tx.process('m-4')

      expect(receivedContext).toHaveProperty('regexp')
      expect(receivedContext).toHaveProperty('parser')
      expect(receivedContext).toHaveProperty('processUtility')
      expect(receivedContext).toHaveProperty('processValue')
      expect(receivedContext).toHaveProperty('processVariant')
      expect(receivedContext).toHaveProperty('utilities')
      expect(receivedContext).toHaveProperty('variants')

      expect(typeof receivedContext.regexp).toBe('function')
      expect(typeof receivedContext.parser).toBe('function')
      expect(typeof receivedContext.processUtility).toBe('function')
      expect(typeof receivedContext.processValue).toBe('function')
      expect(typeof receivedContext.processVariant).toBe('function')
    })
  })

  describe('Plugin Error Recovery', () => {
    it('should continue processing other plugins when one fails', () => {
      const workingPlugin: Plugin = {
        name: 'working-plugin',
        parse: () => ['working-result']
      }

      const errorPlugin: Plugin = {
        name: 'error-plugin',
        parse: () => {
          throw new Error('Plugin error')
        }
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      tx.use(errorPlugin, workingPlugin) // error plugin has higher default priority (0)

      const result = tx.parse('test-class')

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toEqual(['working-result'])

      consoleSpy.mockRestore()
    })

    it('should maintain plugin order after errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const errorPlugin: Plugin = {
        name: 'error-plugin',
        regexp: () => {
          throw new Error('Regexp error')
        }
      }

      tx.use(errorPlugin)

      // Should not crash and should still work
      const result = tx.regexp()
      expect(result).toBeDefined()
      expect(result.matcher).toBeInstanceOf(RegExp)

      consoleSpy.mockRestore()
    })
  })

  describe('Real-world Plugin Examples', () => {
    it('should handle a responsive design plugin', () => {
      const responsivePlugin: Plugin = {
        name: 'responsive-plugin',
        regexp: ({ patterns }) => ({
          patterns: {
            variant: patterns.variant + '|xs|xl|2xl'
          }
        }),
        processVariant: (variant) => {
          const breakpoints = {
            xs: '@media (min-width: 475px)',
            xl: '@media (min-width: 1280px)',
            '2xl': '@media (min-width: 1536px)'
          }
          return breakpoints[variant as keyof typeof breakpoints] || null
        }
      }

      tx.use(responsivePlugin)

      const result = tx.processUtilities({
        variant: 'xl',
        property: 'w',
        value: 'full',
        className: 'xl:w-full'
      })

      expect(result?.variant).toBe('@media (min-width: 1280px)')
    })

    it('should handle a color system plugin', () => {
      const colorPlugin: Plugin = {
        name: 'color-plugin',
        processValue: (value) => {
          const colors = {
            primary: '#3b82f6',
            secondary: '#64748b',
            danger: '#ef4444'
          }
          return colors[value as keyof typeof colors] || null
        }
      }

      tx.use(colorPlugin)

      const result = tx.processUtilities({
        property: 'bg',
        value: 'primary',
        className: 'bg-primary'
      })

      expect(result?.value).toBe('#3b82f6')
    })

    it('should handle a typography plugin with multiple utilities', () => {
      const typographyPlugin: Plugin = {
        name: 'typography-plugin',
        regexp: ({ patterns }) => ({
          patterns: {
            property: patterns.property + '|text-xs|text-sm|text-lg|text-xl'
          }
        }),
        process: (className) => {
          const typography = {
            'text-xs': { fontSize: '0.75rem', lineHeight: '1rem' },
            'text-sm': { fontSize: '0.875rem', lineHeight: '1.25rem' },
            'text-lg': { fontSize: '1.125rem', lineHeight: '1.75rem' },
            'text-xl': { fontSize: '1.25rem', lineHeight: '1.75rem' }
          }

          const config = typography[className as keyof typeof typography]
          if (config) {
            return {
              className,
              properties: config,
              type: 'typography'
            }
          }
          return null
        }
      }

      tx.use(typographyPlugin)

      const result = tx.processWithPlugin('text-lg', 'typography-plugin')

      expect(result).toEqual({
        className: 'text-lg',
        properties: { fontSize: '1.125rem', lineHeight: '1.75rem' },
        type: 'typography'
      })
    })
  })
})
