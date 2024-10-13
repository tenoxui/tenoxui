import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { parse } from 'node-html-parser'

export class GenerateCSS {
  constructor(config) {
    this.validateConfig(config)
    this.config = config
    this.generatedCSS = new Set()
    this.responsiveCSS = new Map()
  }

  validateConfig(config) {
    const requiredFields = ['input', 'output', 'property']
    requiredFields.forEach((field) => {
      if (!config[field]) {
        console.error(`Missing required configuration field: ${field}`)
      }
    })

    config.values = config.values || {}
    config.classes = config.classes || {}
    config.breakpoints = config.breakpoints || []
  }

  static toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  static toKebabCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  }

  static escapeCSSSelector(str) {
    return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, '\\$1')
  }

  matchClass(className) {
    const regex =
      /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/
    return className.match(regex)?.slice(1) || null
  }

  extractClassNames(root) {
    return Array.from(
      new Set(
        root
          .querySelectorAll('*')
          .flatMap((element) => element.getAttribute('class')?.split(/\s+/) || [])
      )
    )
  }
  extractClassNamesFromMethodCall(content) {
    const classNames = new Set()
    const parts = content.split(',').map((part) => part.trim())
    parts.forEach((part) => {
      if (part.startsWith("'") || part.startsWith('"')) {
        const className = part.slice(1, -1)
        if (className) classNames.add(className)
      }
    })
    return Array.from(classNames)
  }
  extractClassNamesFromAssignment(content) {
    const classNames = new Set()
    const match = content.match(/["'`]([^"'`]+)["'`]/)
    if (match) {
      match[1].split(/\s+/).forEach((className) => classNames.add(className))
    }
    return Array.from(classNames)
  }
  extractClassNamesFromTemplateLiteral(content) {
    const classNames = new Set()
    const parts = content.split(/\${[^}]+}/)
    parts.forEach((part) => {
      part.split(/\s+/).forEach((className) => {
        if (className) classNames.add(className)
      })
    })
    return Array.from(classNames)
  }
  extractClassNamesFromConditional(content) {
    const classNames = new Set()
    const parts = content.split(/[?:]/)
    parts.forEach((part) => {
      const match = part.match(/["'`]([^"'`]+)["'`]/)
      if (match) {
        match[1].split(/\s+/).forEach((className) => classNames.add(className))
      }
    })
    return Array.from(classNames)
  }

  parseHTML(content) {
    const root = parse(content)
    return this.extractClassNames(root)
  }

  parseJSX(content) {
    return this.parseJSLike(content)
  }

  parseTSX(content) {
    return this.parseJSLike(content)
  }

  parseJS(content) {
    return this.parseJSLike(content)
  }

  parseTS(content) {
    return this.parseJSLike(content)
  }

  parseJSLike(content) {
    const classNames = new Set()

    // Regular className
    const classNameRegex = /className\s*=\s*{?["'`]([^"'`]+)["'`]?}?/g
    let match
    while ((match = classNameRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach((className) => classNames.add(className))
    }

    // Template literals
    const templateLiteralRegex = /className\s*=\s*{?`([^`]+)`}?/g
    while ((match = templateLiteralRegex.exec(content)) !== null) {
      this.extractClassNamesFromTemplateLiteral(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // Conditional class names
    const conditionalRegex = /className\s*=\s*{([^}]+)}/g
    while ((match = conditionalRegex.exec(content)) !== null) {
      this.extractClassNamesFromConditional(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // classList.add
    const classListAddRegex = /classList\.add\(([^)]+)\)/g
    while ((match = classListAddRegex.exec(content)) !== null) {
      this.extractClassNamesFromMethodCall(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // classList.toggle
    const classListToggleRegex = /classList\.toggle\(([^)]+)\)/g
    while ((match = classListToggleRegex.exec(content)) !== null) {
      this.extractClassNamesFromMethodCall(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // setAttribute for class
    const setAttributeRegex = /setAttribute\(\s*["']class["']\s*,\s*([^)]+)\)/g
    while ((match = setAttributeRegex.exec(content)) !== null) {
      console.log(match)
      this.extractClassNamesFromMethodCall(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // className assignment
    const classNameAssignmentRegex = /\.className\s*=\s*([^;]+)/g
    while ((match = classNameAssignmentRegex.exec(content)) !== null) {
      this.extractClassNamesFromAssignment(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    return Array.from(classNames)
  }

  parseVue(content) {
    const classNames = new Set()

    // Template section
    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/)
    if (templateMatch) {
      const templateContent = templateMatch[1]
      this.parseHTML(templateContent).forEach((className) => classNames.add(className))
    }

    // Script section
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      this.parseJSLike(scriptContent).forEach((className) => classNames.add(className))
    }

    return Array.from(classNames)
  }

  parseSvelte(content) {
    const classNames = new Set()

    // Regular class attributes
    const classRegex = /class\s*=\s*["'`]([^"'`]+)["'`]/g
    let match
    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach((className) => classNames.add(className))
    }

    // class: directives
    const classDirectiveRegex = /class:(\S+)\s*=\s*{[^}]+}/g
    while ((match = classDirectiveRegex.exec(content)) !== null) {
      classNames.add(match[1])
    }

    // JavaScript-like class handling in script tags
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      this.parseJSLike(scriptContent).forEach((className) => classNames.add(className))
    }

    return Array.from(classNames)
  }

  parseAstro(content) {
    const classNames = new Set()
    const classRegex = /class\s*=\s*["'`]([^"'`]+)["'`]/g
    let match

    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach((className) => classNames.add(className))
    }

    // Astro's class:list directive
    const classListRegex = /class:list\s*=\s*{([^}]+)}/g
    while ((match = classListRegex.exec(content)) !== null) {
      this.extractClassNamesFromConditional(match[1]).forEach((className) =>
        classNames.add(className)
      )
    }

    // JavaScript-like class handling in script tags
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      this.parseJSLike(scriptContent).forEach((className) => classNames.add(className))
    }

    return Array.from(classNames)
  }

  parseMDX(content) {
    return [...new Set([...this.parseHTML(content), ...this.parseJSLike(content)])]
  }

  parseFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const extension = path.extname(filePath)
      const parsers = {
        '.html': this.parseHTML,
        '.jsx': this.parseJSX,
        '.tsx': this.parseTSX,
        '.js': this.parseJS,
        '.ts': this.parseTS,
        '.vue': this.parseVue,
        '.svelte': this.parseSvelte,
        '.astro': this.parseAstro,
        '.mdx': this.parseMDX
      }
      const parser = parsers[extension]

      if (parser) {
        return parser.call(this, content)
      } else {
        console.warn(`Unsupported file type: ${extension}`)
        return []
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
      return []
    }
  }

  isBreakpoint(prefix) {
    return this.config.breakpoints.some((bp) => bp.name === prefix)
  }

  generateMediaQuery(breakpoint) {
    const bp = this.config.breakpoints.find((b) => b.name === breakpoint)

    if (!bp) return ''

    let query = '@media screen and'

    if (bp.min !== undefined) query += ` (min-width: ${bp.min}px)`
    if (bp.min !== undefined && bp.max !== undefined) query += ' and'
    if (bp.max !== undefined) query += ` (max-width: ${bp.max}px)`

    return query
  }

  generateCSSRule(selector, property, value, prefix) {
    const rule = value ? `${property}: ${value}` : property
    const escapedSelector = GenerateCSS.escapeCSSSelector(selector)

    if (prefix) {
      if (this.isBreakpoint(prefix)) {
        // For breakpoint prefixes, don't add the prefix at the end
        return `.${prefix}\\:${escapedSelector} { ${rule}; }`
      } else {
        // For other prefixes (like hover, focus), keep the original behavior
        return `.${prefix}\\:${escapedSelector}:${prefix} { ${rule}; }`
      }
    } else {
      return `.${escapedSelector} { ${rule}; }`
    }
  }

  generateCSSRuleFromProperties(type, value, properties, finalValue, prefix) {
    if (Array.isArray(properties)) {
      const rules = properties
        .map((prop) => `${GenerateCSS.toKebabCase(prop)}: ${finalValue}`)
        .join('; ')
      return this.generateCSSRule(`${type}-${value}`, rules, null, prefix)
    }

    if (type.startsWith('[--') && type.endsWith(']')) {
      const variable = type.slice(1, -1).replace(/\\_/g, ' ')
      return this.generateCSSRule(`[${variable}]-${value}`, variable, finalValue, prefix)
    }
    if (typeof properties === 'string') {
      return this.generateCSSRule(
        `${type}-${value}`,
        GenerateCSS.toKebabCase(properties),
        finalValue,
        prefix
      )
    }
    return null
  }

  processCustomValue(type, prefix) {
    const properties = this.config.property[type]

    if (typeof properties === 'object' && properties !== null) {
      if (properties.property && properties.value) {
        const propValue = properties.value

        if (Array.isArray(properties.property)) {
          const rules = properties.property
            .map((prop) => `${GenerateCSS.toKebabCase(prop)}: ${propValue}`)
            .join('; ')

          return this.generateCSSRule(`${type}`, rules, null, prefix)
        }
        return this.generateCSSRule(
          `${type}`,
          GenerateCSS.toKebabCase(properties.property),
          properties.value,
          prefix
        )
      }
      return this.generateCSSRule(`${type}`, properties, properties.value, prefix)
    }
  }

  processCustomClass(prefix, className) {
    const properties = Object.entries(this.config.classes)
      .filter(([, classObj]) => classObj.hasOwnProperty(className))
      .reduce((acc, [propKey, classObj]) => {
        acc[GenerateCSS.toKebabCase(propKey)] = classObj[className]
        return acc
      }, {})

    if (Object.keys(properties).length > 0) {
      const rules = Object.entries(properties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ')
      return this.generateCSSRule(className, rules, null, prefix)
    }

    return null
  }

  processFinalValue(value, unit) {
    const customValue = this.config.values[value]
    if (customValue) return customValue
    if (value.startsWith('$')) {
      return `var(--${value.slice(1)})`
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      const solidValue = value.slice(1, -1).replace(/\\_/g, ' ')
      return solidValue.startsWith('--') ? `var(${solidValue})` : solidValue
    }
    return value + (unit || '')
  }

  addCSSRule(rule, prefix) {
    if (this.isBreakpoint(prefix)) {
      if (!this.responsiveCSS.has(prefix)) {
        this.responsiveCSS.set(prefix, new Set())
      }
      this.responsiveCSS.get(prefix).add(rule)
    } else {
      this.generatedCSS.add(rule)
    }
  }

  parseClass(className) {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined

    const customValueProperty = this.processCustomValue(getType, getPrefix)

    if (customValueProperty) {
      this.addCSSRule(customValueProperty, getPrefix)
      return customValueProperty
    }

    const customCSSClass = this.processCustomClass(getPrefix, getType)

    if (customCSSClass) {
      this.addCSSRule(customCSSClass, getPrefix)
      return customCSSClass
    }

    const matcher = this.matchClass(className)
    if (!matcher) return null

    const [parsedPrefix, parsedType, parsedValue, , unit] = matcher
    const properties = this.config.property[parsedType]
    const finalValue = this.processFinalValue(parsedValue, unit)
    const cssRule = this.generateCSSRuleFromProperties(
      parsedType,
      parsedValue + unit,
      properties,
      finalValue,
      parsedPrefix
    )
    if (cssRule) {
      this.addCSSRule(cssRule, parsedPrefix)
    }
    return cssRule
  }

  create(classNames) {
    ;(Array.isArray(classNames) ? classNames : classNames.split(/\s+/)).forEach((className) =>
      this.parseClass(className)
    )

    let cssContent = Array.from(this.generatedCSS).join('\n')

    this.responsiveCSS.forEach((rules, breakpoint) => {
      const mediaQuery = this.generateMediaQuery(breakpoint)
      cssContent += `\n${mediaQuery} {\n  ${Array.from(rules).join('\n  ')}\n}`
    })

    return cssContent
  }

  generateFromFiles() {
    const classNames = new Set()

    if (this.config.input) {
      this.config.input.forEach((pattern) => {
        glob.sync(pattern).forEach((file) => {
          this.parseFile(file).forEach((className) => classNames.add(className))
        })
      })

      const cssContent = this.create(Array.from(classNames))
      try {
        fs.writeFileSync(this.config.output, cssContent)
        console.log(`CSS file generated at: ${this.config.output}`)
      } catch (error) {
        console.error(`Error writing CSS file ${this.config.output}:`, error)
      }
      return cssContent
    }
  }
}
