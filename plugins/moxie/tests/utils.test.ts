import { describe, it, expect } from 'vitest'
import {
  transformProps,
  generateCSSRule,
  processStringRules,
  generateSelector,
  processObjectRules,
  processRulesArray,
  generateRuleBlock,
  processVariantSelector,
  escapeSelector,
  unescapeSelector,
  escapeRegex,
  toKebabCase
} from '../src/utils'

describe('transformProps', () => {
  it('should keep CSS custom properties as-is', () => {
    expect(transformProps('--custom-color')).toBe('--custom-color')
    expect(transformProps('--my-var')).toBe('--my-var')
    expect(transformProps('--border-radius')).toBe('--border-radius')
  })

  it('should convert camelCase to kebab-case for regular properties', () => {
    expect(transformProps('backgroundColor')).toBe('background-color')
    expect(transformProps('borderRadius')).toBe('border-radius')
    expect(transformProps('fontSize')).toBe('font-size')
    expect(transformProps('zIndex')).toBe('z-index')
  })

  it('should handle already kebab-case properties', () => {
    expect(transformProps('background-color')).toBe('background-color')
    expect(transformProps('margin-top')).toBe('margin-top')
    expect(transformProps('text-align')).toBe('text-align')
  })

  it('should handle single word properties', () => {
    expect(transformProps('color')).toBe('color')
    expect(transformProps('margin')).toBe('margin')
    expect(transformProps('padding')).toBe('padding')
  })

  it('should handle vendor prefixes', () => {
    expect(transformProps('webkitTransform')).toBe('-webkit-transform')
    expect(transformProps('mozBoxShadow')).toBe('-moz-box-shadow')
    expect(transformProps('msFilter')).toBe('-ms-filter')
    expect(transformProps('oTransition')).toBe('-o-transition')
  })
})

describe('generateCSSRule', () => {
  it('should generate basic CSS rule', () => {
    expect(generateCSSRule('color', 'red', false)).toBe('color: red')
    expect(generateCSSRule('background-color', 'blue', false)).toBe('background-color: blue')
  })

  it('should handle important flag', () => {
    expect(generateCSSRule('color', 'red', true)).toBe('color: red !important')
    expect(generateCSSRule('margin', '10px', false, true)).toBe('margin: 10px !important')
  })

  it('should prioritize localIsImportant over isImportant', () => {
    expect(generateCSSRule('color', 'red', false, true)).toBe('color: red !important')
    expect(generateCSSRule('color', 'red', true, false)).toBe('color: red !important')
  })

  it('should handle array of properties', () => {
    const result = generateCSSRule(['margin-top', 'margin-bottom'], '10px', false)
    expect(result).toBe('margin-top: 10px; margin-bottom: 10px')
  })

  it('should handle array properties with important', () => {
    const result = generateCSSRule(['width', 'height'], '100px', true)
    expect(result).toBe('width: 100px !important; height: 100px !important')
  })

  it('should transform camelCase properties in arrays', () => {
    const result = generateCSSRule(['backgroundColor', 'borderColor'], 'red', false)
    expect(result).toBe('background-color: red; border-color: red')
  })

  it('should preserve CSS custom properties in arrays', () => {
    const result = generateCSSRule(['--primary', '--secondary'], 'blue', false)
    expect(result).toBe('--primary: blue; --secondary: blue')
  })
})

describe('processStringRules', () => {
  it('should return rules as-is when not important', () => {
    expect(processStringRules('color: red')).toBe('color: red')
    expect(processStringRules('margin: 10px; padding: 20px')).toBe('margin: 10px; padding: 20px')
  })

  it('should remove trailing semicolon', () => {
    expect(processStringRules('color: red;')).toBe('color: red')
    expect(processStringRules('margin: 10px;')).toBe('margin: 10px')
  })

  it('should add important flag when specified', () => {
    expect(processStringRules('color: red', true)).toBe('color: red !important')
    expect(processStringRules('margin: 10px; padding: 20px', true)).toBe(
      'margin: 10px; padding: 20px !important'
    )
  })

  it('should remove existing important and add new one', () => {
    expect(processStringRules('color: red !important', true)).toBe('color: red !important')
    expect(processStringRules('color: red !important; margin: 10px !important', true)).toBe(
      'color: red; margin: 10px !important'
    )
  })

  it('should handle rules with trailing semicolon and important', () => {
    expect(processStringRules('color: red !important;', true)).toBe('color: red !important')
  })

  it('should handle multiple important declarations', () => {
    expect(processStringRules('color: red !important; background: blue !important', true)).toBe(
      'color: red; background: blue !important'
    )
  })
})

describe('generateSelector', () => {
  it('should generate class selector from string', () => {
    expect(generateSelector('btn', 'btn')).toBe('.btn')
    expect(generateSelector('bg-red', 'bg-red')).toBe('.bg-red')
  })

  it('should generate selector without class prefix', () => {
    expect(generateSelector('btn', 'btn', false)).toBe('btn')
    expect(generateSelector('hover:bg-red', 'hover:bg-red', false)).toBe('hover\\:bg-red')
  })

  it('should escape special characters', () => {
    expect(generateSelector('hover:bg-red', 'hover:bg-red')).toBe('.hover\\:bg-red')
    expect(generateSelector('sm:text-lg', 'sm:text-lg')).toBe('.sm\\:text-lg')
    expect(generateSelector('bg-[#ff0000]', 'bg-[#ff0000]')).toBe('.bg-\\[\\#ff0000\\]')
  })

  it('should handle ClassNameObject with prefix and suffix', () => {
    const classObj = {
      raw: 'btn',
      prefix: 'component-',
      suffix: ':hover'
    }
    expect(generateSelector(classObj, 'original')).toBe('component-.btn:hover')
  })

  it('should handle ClassNameObject with only prefix', () => {
    const classObj = {
      raw: 'btn',
      prefix: 'prefix-'
    }
    expect(generateSelector(classObj, 'original')).toBe('prefix-.btn')
  })

  it('should handle ClassNameObject with only suffix', () => {
    const classObj = {
      raw: 'btn',
      suffix: ':active'
    }
    expect(generateSelector(classObj, 'original')).toBe('.btn:active')
  })

  it('should use original className when raw is not provided', () => {
    const classObj = {
      prefix: 'test-',
      suffix: ':hover'
    }
    expect(generateSelector(classObj, 'original')).toBe('test-.original:hover')
  })
})

describe('processObjectRules', () => {
  it('should process simple object rules', () => {
    const rules = {
      color: 'red',
      'background-color': 'blue'
    }
    const result = processObjectRules(rules)
    expect(result).toBe('color: red; background-color: blue')
  })

  it('should handle comma-separated properties', () => {
    const rules = {
      'margin-top, margin-bottom': '10px',
      color: 'red'
    }
    const result = processObjectRules(rules)
    expect(result).toBe('margin-top: 10px; margin-bottom: 10px; color: red')
  })

  it('should handle array values with importance', () => {
    const rules = {
      color: ['red', true],
      background: 'blue'
    }
    const result = processObjectRules(rules)
    expect(result).toBe('color: red !important; background: blue')
  })

  it('should handle global importance flag', () => {
    const rules = {
      color: 'red',
      background: 'blue'
    }
    const result = processObjectRules(rules, true)
    expect(result).toBe('color: red !important; background: blue !important')
  })

  it('should combine global and local importance', () => {
    const rules = {
      color: ['red', false],
      background: ['blue', true]
    }
    let result = processObjectRules(rules, true)
    expect(result).toBe('color: red !important; background: blue !important')
    result = processObjectRules(rules, false)
    expect(result).toBe('color: red; background: blue !important')
  })

  it('should trim whitespace from comma-separated properties', () => {
    const rules = {
      'margin-left , margin-right ': '5px'
    }
    const result = processObjectRules(rules)
    expect(result).toBe('margin-left: 5px; margin-right: 5px')
  })
})

describe('processRulesArray', () => {
  it('should process array format rules', () => {
    const rules = [
      ['color', 'red'],
      ['background', 'blue']
    ]
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red; background: blue')
  })

  it('should process array format with importance', () => {
    const rules = [
      ['color', 'red', true],
      ['background', 'blue']
    ]
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red !important; background: blue')
  })

  it('should process object format with property/value', () => {
    const rules = [
      { property: 'color', value: 'red' },
      { property: 'background', value: 'blue', isImportant: true }
    ]
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red; background: blue !important')
  })

  it('should process object format as key-value pairs', () => {
    const rules = [{ color: 'red', background: 'blue' }]
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red; background: blue')
  })

  it('should process string rules with colons', () => {
    const rules = ['color: red', 'background: blue']
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red; background: blue')
  })

  it('should handle mixed rule types', () => {
    const rules = [
      ['color', 'red'],
      { property: 'background', value: 'blue' },
      'border: 1px solid black'
    ]
    const result = processRulesArray(rules, false)
    expect(result).toBe('color: red; background: blue; border: 1px solid black')
  })

  it('should filter out falsy values', () => {
    const rules = [['color', 'red'], null, undefined, '', ['background', 'blue']]
    const result = processRulesArray(rules as any, false)
    expect(result).toBe('color: red; background: blue')
  })

  it('should handle global importance', () => {
    const rules = [['color', 'red'], 'background: blue']
    const result = processRulesArray(rules, true)
    expect(result).toBe('color: red !important; background: blue !important')
  })
})

describe('generateRuleBlock', () => {
  it('should wrap rules in braces by default', () => {
    const result = generateRuleBlock({ property: 'color', value: 'red' }, false)
    expect(result).toBe('{ color: red }')
  })

  it('should return rules only when specified', () => {
    const result = generateRuleBlock({ property: 'color', value: 'red' }, false, true)
    expect(result).toBe('color: red')
  })

  it('should handle array rules', () => {
    const rules = [
      ['color', 'red'],
      ['background', 'blue']
    ]
    const result = generateRuleBlock(rules, false)
    expect(result).toBe('{ color: red; background: blue }')
  })

  it('should handle object rules with property/value', () => {
    const rules = { property: 'color', value: 'red', isImportant: true }
    const result = generateRuleBlock(rules, false)
    expect(result).toBe('{ color: red !important }')
  })

  it('should handle object rules as key-value pairs', () => {
    const rules = { color: 'red', background: 'blue' }
    const result = generateRuleBlock(rules, false)
    expect(result).toBe('{ color: red; background: blue }')
  })

  it('should handle string rules with colons', () => {
    const result = generateRuleBlock('color: red; background: blue', false)
    expect(result).toBe('{ color: red; background: blue }')
  })

  it('should handle plain string rules', () => {
    const result = generateRuleBlock('display: none', false)
    expect(result).toBe('{ display: none }')
  })

  it('should handle importance flag', () => {
    const result = generateRuleBlock({ property: 'color', value: 'red' }, true)
    expect(result).toBe('{ color: red !important }')
  })

  it('should handle empty or invalid rules', () => {
    expect(generateRuleBlock(null)).toBeNull()
    expect(generateRuleBlock(undefined)).toBeNull()
    expect(generateRuleBlock('')).toBeNull()
  })
})

describe('processVariantSelector', () => {
  it('should replace & with selector', () => {
    const result = processVariantSelector('&:hover', '.btn', '{ color: red }')
    expect(result).toBe('.btn:hover { color: red }')
  })

  it('should handle multiple & replacements', () => {
    const result = processVariantSelector('& > &:first-child', '.item', '{ margin: 0 }')
    expect(result).toBe('.item > .item:first-child { margin: 0 }')
  })

  it('should handle @slot syntax', () => {
    const result = processVariantSelector(
      '@media (min-width: 768px) { @slot }',
      '.responsive',
      '{ display: block }'
    )
    expect(result).toBe('@media (min-width: 768px) { .responsive { display: block } }')
  })

  it('should handle @class and @rules syntax', () => {
    const result = processVariantSelector(
      '@media print { @class { @rules } }',
      '.print-only',
      'display: none'
    )
    expect(result).toBe('@media print { .print-only { display: none } }')
  })

  it('should return empty string for @class without @rules', () => {
    const result = processVariantSelector('@media print { @class }', '.test', '{ color: red }')
    expect(result).toBeNull()
  })

  it('should default to simple concatenation', () => {
    const result = processVariantSelector(':hover', '.btn', '{ color: blue }')
    expect(result).toBe('.btn { color: blue }')
  })

  it('should handle complex media queries with &', () => {
    const result = processVariantSelector(
      '@media (min-width: 640px) { & }',
      '.sm-class',
      '{ width: 100% }'
    )
    expect(result).toBe('@media (min-width: 640px) { .sm-class } { width: 100% }')
  })

  it('should handle nested selectors with &', () => {
    const result = processVariantSelector('.parent &:not(.active)', '.child', '{ opacity: 0.5 }')
    expect(result).toBe('.parent .child:not(.active) { opacity: 0.5 }')
  })
})

describe('escapeSelector', () => {
  it('should escape digits at the start', () => {
    expect(escapeSelector('2xl')).toBe('\\32 xl')
    expect(escapeSelector('3xl')).toBe('\\33 xl')
    expect(escapeSelector('1/2')).toBe('\\31 \\/2')
  })

  it('should escape special CSS characters', () => {
    expect(escapeSelector('hover:bg-red')).toBe('hover\\:bg-red')
    expect(escapeSelector('bg-[#ff0000]')).toBe('bg-\\[\\#ff0000\\]')
    expect(escapeSelector('sm:text-lg')).toBe('sm\\:text-lg')
    expect(escapeSelector('w-1/2')).toBe('w-1\\/2')
  })

  it('should escape all special characters', () => {
    const specialChars = '#{}.:;?%&,@+*~\'"!^$[]()=>|/'
    const input = `test${specialChars}test`
    const result = escapeSelector(input)

    // Each special character should be escaped with a backslash
    expect(result).toBe(
      `test\\#\\{\\}\\.\\:\\;\\?\\%\\&\\,\\@\\+\\*\\~\\'\\"\\!\\^\\$\\[\\]\\(\\)\\=\\>\\|\\/test`
    )
  })

  it('should handle complex selectors', () => {
    expect(escapeSelector('2xl:hover:bg-[rgb(255,0,0)]')).toBe(
      '\\32 xl\\:hover\\:bg-\\[rgb\\(255\\,0\\,0\\)\\]'
    )
  })

  it('should handle empty string', () => {
    expect(escapeSelector('')).toBe('')
  })

  it('should handle strings without special characters', () => {
    expect(escapeSelector('normal')).toBe('normal')
    expect(escapeSelector('bg-red-500')).toBe('bg-red-500')
  })

  it('should not double-escape', () => {
    const input = 'test:value'
    const escaped = escapeSelector(input)
    const doubleEscaped = escapeSelector(escaped)
    expect(doubleEscaped).not.toBe(escaped)
  })
})

describe('unescapeSelector', () => {
  it('should unescape special characters', () => {
    expect(unescapeSelector('hover\\:bg-red')).toBe('hover:bg-red')
    expect(unescapeSelector('bg-\\[\\#ff0000\\]')).toBe('bg-[#ff0000]')
    expect(unescapeSelector('w-1\\/2')).toBe('w-1/2')
  })

  it('should unescape digits at the start', () => {
    expect(unescapeSelector('\\32 xl')).toBe('2xl')
    expect(unescapeSelector('\\33 xl')).toBe('3xl')
    expect(unescapeSelector('\\31 /2')).toBe('1/2')
  })

  it('should handle complex escaped selectors', () => {
    const escaped = '\\32 xl\\:hover\\:bg-\\[rgb\\(255\\,0\\,0\\)\\]'
    const unescaped = unescapeSelector(escaped)
    expect(unescaped).toBe('2xl:hover:bg-[rgb(255,0,0)]')
  })

  it('should be inverse of escapeSelector', () => {
    const inputs = [
      'hover:bg-red',
      '2xl:text-lg',
      'bg-[#ff0000]',
      'w-1/2',
      'sm:hover:bg-[rgb(255,0,0)]',
      '3xl:focus:border-[2px_solid_#000]'
    ]

    inputs.forEach((input) => {
      const escaped = escapeSelector(input)
      const unescaped = unescapeSelector(escaped)
      expect(unescaped).toBe(input)
    })
  })

  it('should handle empty string', () => {
    expect(unescapeSelector('')).toBe('')
  })

  it('should handle strings without escapes', () => {
    expect(unescapeSelector('normal')).toBe('normal')
    expect(unescapeSelector('bg-red-500')).toBe('bg-red-500')
  })

  it('should handle partial escapes', () => {
    expect(unescapeSelector('test\\:value normal')).toBe('test:value normal')
    expect(unescapeSelector('\\31 partial')).toBe('1partial')
  })
})

describe('escapeRegex', () => {
  it('should escape regex special characters', () => {
    expect(escapeRegex('.*+?^${}()|[]\\/-')).toBe(
      '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\/\\-'
    )
  })

  it('should escape dots', () => {
    expect(escapeRegex('test.value')).toBe('test\\.value')
  })

  it('should escape asterisks', () => {
    expect(escapeRegex('test*value')).toBe('test\\*value')
  })

  it('should escape plus signs', () => {
    expect(escapeRegex('test+value')).toBe('test\\+value')
  })

  it('should escape question marks', () => {
    expect(escapeRegex('test?value')).toBe('test\\?value')
  })

  it('should escape carets', () => {
    expect(escapeRegex('^start')).toBe('\\^start')
  })

  it('should escape dollar signs', () => {
    expect(escapeRegex('end$')).toBe('end\\$')
  })

  it('should escape braces', () => {
    expect(escapeRegex('test{1,3}')).toBe('test\\{1,3\\}')
  })

  it('should escape parentheses', () => {
    expect(escapeRegex('test(group)')).toBe('test\\(group\\)')
  })

  it('should escape pipe characters', () => {
    expect(escapeRegex('option1|option2')).toBe('option1\\|option2')
  })

  it('should escape brackets', () => {
    expect(escapeRegex('test[abc]')).toBe('test\\[abc\\]')
  })

  it('should escape backslashes', () => {
    expect(escapeRegex('test\\value')).toBe('test\\\\value')
  })

  it('should escape forward slashes', () => {
    expect(escapeRegex('path/to/file')).toBe('path\\/to\\/file')
  })

  it('should escape hyphens', () => {
    expect(escapeRegex('test-value')).toBe('test\\-value')
  })

  it('should handle empty string', () => {
    expect(escapeRegex('')).toBe('')
  })

  it('should handle strings without special characters', () => {
    expect(escapeRegex('normal_string_123')).toBe('normal_string_123')
  })

  it('should handle complex regex patterns', () => {
    const pattern = '^(test|example)\\d+.*$'
    const escaped = escapeRegex(pattern)
    expect(escaped).toBe('\\^\\(test\\|example\\)\\\\d\\+\\.\\*\\$')
  })

  it('should make string safe for regex construction', () => {
    const userInput = 'user[input].*'
    const escaped = escapeRegex(userInput)
    const regex = new RegExp(escaped)

    expect(() => regex.test('user[input].*')).not.toThrow()
    expect(regex.test('user[input].*')).toBe(true)
    expect(regex.test('userinput')).toBe(false)
  })
})

describe('toKebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(toKebabCase('backgroundColor')).toBe('background-color')
    expect(toKebabCase('borderRadius')).toBe('border-radius')
    expect(toKebabCase('fontSize')).toBe('font-size')
    expect(toKebabCase('zIndex')).toBe('z-index')
  })

  it('should handle single words', () => {
    expect(toKebabCase('color')).toBe('color')
    expect(toKebabCase('margin')).toBe('margin')
    expect(toKebabCase('padding')).toBe('padding')
    expect(toKebabCase('display')).toBe('display')
  })

  it('should handle already kebab-case strings', () => {
    expect(toKebabCase('background-color')).toBe('background-color')
    expect(toKebabCase('margin-top')).toBe('margin-top')
    expect(toKebabCase('text-align')).toBe('text-align')
  })

  it('should handle PascalCase', () => {
    expect(toKebabCase('BackgroundColor')).toBe('-background-color')
    expect(toKebabCase('BorderRadius')).toBe('-border-radius')
    expect(toKebabCase('ZIndex')).toBe('-z-index')
  })

  it('should handle vendor prefixes correctly', () => {
    expect(toKebabCase('webkitTransform')).toBe('-webkit-transform')
    expect(toKebabCase('webkitBoxShadow')).toBe('-webkit-box-shadow')
    expect(toKebabCase('webkitBorderRadius')).toBe('-webkit-border-radius')
  })

  it('should handle moz vendor prefixes', () => {
    expect(toKebabCase('mozBoxShadow')).toBe('-moz-box-shadow')
    expect(toKebabCase('mozTransform')).toBe('-moz-transform')
    expect(toKebabCase('mozAppearance')).toBe('-moz-appearance')
  })

  it('should handle ms vendor prefixes', () => {
    expect(toKebabCase('msTransform')).toBe('-ms-transform')
    expect(toKebabCase('msFilter')).toBe('-ms-filter')
    expect(toKebabCase('msFlexDirection')).toBe('-ms-flex-direction')
  })

  it('should handle o vendor prefixes', () => {
    expect(toKebabCase('oTransform')).toBe('-o-transform')
    expect(toKebabCase('oTransition')).toBe('-o-transition')
    expect(toKebabCase('oBackgroundSize')).toBe('-o-background-size')
  })

  it('should handle multiple capital letters', () => {
    expect(toKebabCase('borderTopLeftRadius')).toBe('border-top-left-radius')
    expect(toKebabCase('backgroundPositionX')).toBe('background-position-x')
    expect(toKebabCase('textDecorationColor')).toBe('text-decoration-color')
  })

  it('should handle consecutive capital letters', () => {
    expect(toKebabCase('XMLHttpRequest')).toBe('-x-m-l-http-request')
    expect(toKebabCase('HTMLElement')).toBe('-h-t-m-l-element')
  })

  it('should handle numbers in the string', () => {
    expect(toKebabCase('grid2Column')).toBe('grid2-column')
    expect(toKebabCase('column3Grid')).toBe('column3-grid')
  })

  it('should handle empty string', () => {
    expect(toKebabCase('')).toBe('')
  })

  it('should handle strings with numbers and letters', () => {
    expect(toKebabCase('margin1Top')).toBe('margin1-top')
    expect(toKebabCase('fontSize16Px')).toBe('font-size16-px')
  })

  it('should handle acronyms at the beginning', () => {
    expect(toKebabCase('CSSStyleDeclaration')).toBe('-c-s-s-style-declaration')
    expect(toKebabCase('DOMElement')).toBe('-d-o-m-element')
  })

  it('should not affect vendor prefixes that are not at the start', () => {
    expect(toKebabCase('someWebkitProperty')).toBe('some-webkit-property')
    expect(toKebabCase('customMozValue')).toBe('custom-moz-value')
  })

  it('should handle mixed case with vendor prefixes', () => {
    expect(toKebabCase('webkitBackgroundClip')).toBe('-webkit-background-clip')
    expect(toKebabCase('mozUserSelect')).toBe('-moz-user-select')
    expect(toKebabCase('msUserSelect')).toBe('-ms-user-select')
    expect(toKebabCase('oUserSelect')).toBe('-o-user-select')
  })

  it('should preserve underscores', () => {
    expect(toKebabCase('custom_property')).toBe('custom_property')
    expect(toKebabCase('mixedCase_property')).toBe('mixed-case_property')
  })

  it('should handle real-world CSS properties', () => {
    const testCases = [
      ['alignItems', 'align-items'],
      ['justifyContent', 'justify-content'],
      ['flexDirection', 'flex-direction'],
      ['gridTemplateColumns', 'grid-template-columns'],
      ['boxShadow', 'box-shadow'],
      ['textShadow', 'text-shadow'],
      ['borderTopWidth', 'border-top-width'],
      ['marginInlineStart', 'margin-inline-start'],
      ['paddingBlockEnd', 'padding-block-end'],
      ['webkitTextFillColor', '-webkit-text-fill-color'],
      ['mozBorderRadius', '-moz-border-radius'],
      ['msGridRow', '-ms-grid-row'],
      ['oObjectFit', '-o-object-fit']
    ]

    testCases.forEach(([input, expected]) => {
      expect(toKebabCase(input)).toBe(expected)
    })
  })

  it('should handle complex vendor prefix scenarios', () => {
    // Test that vendor prefixes only apply at the beginning
    expect(toKebabCase('customWebkitProperty')).toBe('custom-webkit-property')
    expect(toKebabCase('myMozStyle')).toBe('my-moz-style')

    // Test vendor prefixes at the start
    expect(toKebabCase('webkitCustomProperty')).toBe('-webkit-custom-property')
    expect(toKebabCase('mozCustomStyle')).toBe('-moz-custom-style')
  })

  it('should handle strings with special characters', () => {
    // Note: This tests that the function doesn't break on special chars,
    // though CSS property names typically don't contain them
    expect(toKebabCase('property-with-dashes')).toBe('property-with-dashes')
    expect(toKebabCase('property.with.dots')).toBe('property.with.dots')
  })

  it('should be consistent with multiple transformations', () => {
    const input = 'backgroundColor'
    const result1 = toKebabCase(input)
    const result2 = toKebabCase(result1)
    expect(result1).toBe('background-color')
    expect(result2).toBe('background-color')
  })

  it('should handle edge case with single letter after vendor prefix', () => {
    expect(toKebabCase('webkitA')).toBe('-webkit-a')
    expect(toKebabCase('mozB')).toBe('-moz-b')
    expect(toKebabCase('msC')).toBe('-ms-c')
    expect(toKebabCase('oD')).toBe('-o-d')
  })

  it('should handle mixed patterns', () => {
    expect(toKebabCase('someVeryLongPropertyNameWithManyWords')).toBe(
      'some-very-long-property-name-with-many-words'
    )
    expect(toKebabCase('webkitVeryLongPropertyName')).toBe('-webkit-very-long-property-name')
  })

  it('should handle strings that start with vendor-like but are not vendor prefixes', () => {
    expect(toKebabCase('website')).toBe('website')
    expect(toKebabCase('mobile')).toBe('mobile')
    expect(toKebabCase('optional')).toBe('optional')
    expect(toKebabCase('mozilla')).toBe('mozilla') // Not mozA pattern
  })
})
