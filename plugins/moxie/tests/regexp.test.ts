import { describe, it, expect } from 'vitest'
import { createPatterns, createMatcher, createRegexp } from '../src/lib/regexp'

describe('RegExp Module', () => {
  describe('createPatterns', () => {
    it('should create default patterns with empty config', () => {
      const patterns = createPatterns()

      expect(patterns.variant).toContain('[a-zA-Z0-9_\\-]+')
      expect(patterns.property).toBe('\\[[^\\]]+\\]+')
      expect(patterns.value).toContain('-?\\d+(?:\\.\\d+)?')
    })

    it('should include utilities in property pattern', () => {
      const patterns = createPatterns({
        utilities: ['bg', 'text', 'padding']
      })

      expect(patterns.property).toContain('padding|text|bg')
    })

    it('should include variants in variant pattern', () => {
      const patterns = createPatterns({
        variants: ['hover', 'focus', 'active', '\\*']
      })

      expect(patterns.variant).toContain('active|hover|focus|\\*')
    })

    it('should sort patterns by length for better matching', () => {
      const patterns = createPatterns({
        utilities: ['bg', 'background', 'text']
      })

      // background should come before bg due to length sorting
      const propertyPattern = patterns.property
      const bgIndex = propertyPattern.indexOf('bg')
      const backgroundIndex = propertyPattern.indexOf('background')
      expect(backgroundIndex).toBeLessThan(bgIndex)
    })

    it('should include safelist items', () => {
      const patterns = createPatterns({
        utilities: ['custom\\-class', 'another']
      })

      expect(patterns.property).toContain('custom\\-class')
      expect(patterns.property).toContain('another')
    })
  })

  describe('createMatcher', () => {
    it('should create valid RegExp from patterns', () => {
      const patterns = createPatterns({
        variants: ['hover'],
        utilities: ['bg']
      })

      const matcher = createMatcher(patterns)
      expect(matcher).toBeInstanceOf(RegExp)

      // Test matching
      const match = 'hover:bg-red'.match(matcher)
      expect(match).not.toBe(null)
      expect(match?.groups?.variant).toBe('hover')
      expect(match?.groups?.property).toBe('bg')
      expect(match?.groups?.value).toBe('red')
    })

    it('should match classes without variants', () => {
      const patterns = createPatterns({ utilities: ['bg'] })
      const matcher = createMatcher(patterns)

      const match = 'bg-blue'.match(matcher)
      expect(match).not.toBe(null)
      expect(match?.groups?.variant).toBeUndefined()
      expect(match?.groups?.property).toBe('bg')
      expect(match?.groups?.value).toBe('blue')
    })

    it('should match classes without values', () => {
      const patterns = createPatterns({ utilities: ['block'] })
      const matcher = createMatcher(patterns)

      const match = 'block'.match(matcher)
      expect(match).not.toBe(null)
      expect(match?.groups?.property).toBe('block')
      expect(match?.groups?.value).toBeUndefined()
    })

    it('should add custom value patterns', () => {
      const patterns = createPatterns({ valuePatterns: ['@moxie'] })
      const matcher = createMatcher(patterns)

      const match = '[hello]-@moxie'.match(matcher)
      expect(match).not.toBe(null)
      expect(match?.groups?.value).toBe('@moxie')
    })

    it('should be null if value patterns is not added', () => {
      expect('[hello]-@moxie'.match(createMatcher(createPatterns()))).toBe(null)
    })

    it('should be match custom pattern', () => {
      const patterns = createPatterns({ valuePatterns: ['\\@[^\\s\\/]+'] })
      const matcher = createMatcher(patterns)

      expect('[hello]-@moxie'.match(matcher).groups.value).toBe('@moxie')
    })
  })

  describe('createRegexp', () => {
    it('should return complete RegExp configuration', () => {
      const config = createRegexp({
        variants: ['hover', 'focus'],
        utilities: ['bg', 'text']
      })

      expect(config).toHaveProperty('patterns')
      expect(config).toHaveProperty('matcher')
    })

    it('should create functional matcher', () => {
      const { matcher } = createRegexp({
        variants: ['hover'],
        utilities: ['bg']
      })

      expect('hover:bg-red'.match(matcher)).not.toBe(null)
      expect('invalid-class'.match(matcher)).toBe(null)
    })
  })

  describe('Complex Pattern Matching', () => {
    it('should match nested brackets', () => {
      const { matcher } = createRegexp({
        utilities: ['bg']
      })

      expect('[&>*:hover]:bg-yellow'.match(matcher)).not.toBe(null)
      expect('bg-[rgb(255,0,0)]'.match(matcher)).not.toBe(null)
    })

    it('should match CSS custom properties', () => {
      const { matcher } = createRegexp({
        utilities: ['bg', 'text'],
        valuePatterns: ['\\$[^\\s\\/]+']
      })

      expect('bg-$primary'.match(matcher)).not.toBe(null)
      expect('text-$custom-color'.match(matcher)).not.toBe(null)
    })

    it('should match fractions', () => {
      const { matcher } = createRegexp({
        utilities: ['w'],
        valuePatterns: [
          '(?:' +
            ['-?\\d+(?:\\.\\d+)?', '\\$[^\\s\\/]+'].join('|') +
            ')' +
            '\\/' +
            '(?:' +
            ['-?\\d+(?:\\.\\d+)?', '\\$[^\\s\\/]+'].join('|') +
            ')'
        ]
      })

      expect('w-1/2'.match(matcher)).not.toBe(null)
      expect('w--1/-2'.match(matcher)).not.toBe(null)
      expect('w-1/-2'.match(matcher)).not.toBe(null)
      expect('w--1/2'.match(matcher)).not.toBe(null)
      expect('w-$width/$height'.match(matcher)).not.toBe(null)
      expect('w-$width/2'.match(matcher)).not.toBe(null)
      expect('w--2/$6'.match(matcher)).not.toBe(null)
    })
  })
})
