import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'node-html-parser'
import {
  extractClassNames,
  extractClassNamesFromTemplateLiteral,
  extractClassNamesFromConditional,
  extractClassNamesFromMethodCall,
  extractClassNamesFromAssignment
} from '../utils/extractor'



function parseHTML(content) {
    const root = parse(content)
    return extractClassNames(root)
  }

function parseJSX(content) {
    return parseJSLike(content)
  }

function parseTSX(content) {
    return parseJSLike(content)
  }

function parseJS(content) {
    return parseJSLike(content)
  }

function parseTS(content) {
    return parseJSLike(content)
  }

function parseJSLike(content) {
    const classNames = new Set()

    // Regular className
    const classNameRegex = /className\s*=\s*{?["'`]([^"'`]+)["'`]?}?/g
    let match
    while ((match = classNameRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(className => classNames.add(className))
    }

    // Template literals
    const templateLiteralRegex = /className\s*=\s*{?`([^`]+)`}?/g
    while ((match = templateLiteralRegex.exec(content)) !== null) {
      extractClassNamesFromTemplateLiteral(match[1]).forEach(className => classNames.add(className))
    }

    // Conditional class names
    const conditionalRegex = /className\s*=\s*{([^}]+)}/g
    while ((match = conditionalRegex.exec(content)) !== null) {
      extractClassNamesFromConditional(match[1]).forEach(className => classNames.add(className))
    }

    // classList.add
    const classListAddRegex = /classList\.add\(([^)]+)\)/g
    while ((match = classListAddRegex.exec(content)) !== null) {
      extractClassNamesFromMethodCall(match[1]).forEach(className => classNames.add(className))
    }

    // classList.toggle
    const classListToggleRegex = /classList\.toggle\(([^)]+)\)/g
    while ((match = classListToggleRegex.exec(content)) !== null) {
      extractClassNamesFromMethodCall(match[1]).forEach(className => classNames.add(className))
    }

    // setAttribute for class
    const setAttributeRegex = /setAttribute\(\s*["']class["']\s*,\s*([^)]+)\)/g
    while ((match = setAttributeRegex.exec(content)) !== null) {
      extractClassNamesFromMethodCall(match[1]).forEach(className => classNames.add(className))
    }

    // className assignment
    const classNameAssignmentRegex = /\.className\s*=\s*([^;]+)/g
    while ((match = classNameAssignmentRegex.exec(content)) !== null) {
      extractClassNamesFromAssignment(match[1]).forEach(className => classNames.add(className))
    }

    return Array.from(classNames)
  }

function parseVue(content) {
    const classNames = new Set()

    // Template section
    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/)
    if (templateMatch) {
      const templateContent = templateMatch[1]
      parseHTML(templateContent).forEach(className => classNames.add(className))
    }

    // Script section
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      parseJSLike(scriptContent).forEach(className => classNames.add(className))
    }

    return Array.from(classNames)
  }

function parseSvelte(content) {
    const classNames = new Set()

    // Regular class attributes
    const classRegex = /class\s*=\s*["'`]([^"'`]+)["'`]/g
    let match
    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(className => classNames.add(className))
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
      parseJSLike(scriptContent).forEach(className => classNames.add(className))
    }

    return Array.from(classNames)
  }

function parseAstro(content) {
    const classNames = new Set()
    const classRegex = /class\s*=\s*["'`]([^"'`]+)["'`]/g
    let match

    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(className => classNames.add(className))
    }

    // Astro's class:list directive
    const classListRegex = /class:list\s*=\s*{([^}]+)}/g
    while ((match = classListRegex.exec(content)) !== null) {
      extractClassNamesFromConditional(match[1]).forEach(className => classNames.add(className))
    }

    // JavaScript-like class handling in script tags
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      parseJSLike(scriptContent).forEach(className => classNames.add(className))
    }

    return Array.from(classNames)
  }

function parseMDX(content) {
    return [...new Set([...parseHTML(content), ...parseJSLike(content)])]
  }

export function parseFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const extension = path.extname(filePath)
      const parsers = {
        '.html': parseHTML,
        '.jsx': parseJSX,
        '.tsx': parseTSX,
        '.js': parseJS,
        '.ts': parseTS,
        '.vue': parseVue,
        '.svelte': parseSvelte,
        '.astro': parseAstro,
        '.mdx': parseMDX
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
  

