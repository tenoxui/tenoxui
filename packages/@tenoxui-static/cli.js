import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import { fileURLToPath } from 'url'
import { load } from 'cheerio'
import { glob } from 'glob'
import { TenoxUI } from './dist/index.esm.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class TenoxUICLI {
  constructor(config = {}) {
    this.tenoxui = new TenoxUI(config)
    this.watchMode = false
    this.outputPath = ''
    this.inputPatterns = []
    this.options = {
      minify: false,
      sourceMap: false,
      purge: false,
      prefix: ''
    }
  }

  // Helper to resolve glob patterns to file paths
  resolveFiles(patterns) {
    const files = new Set()

    patterns.forEach((pattern) => {
      if (glob.hasMagic(pattern)) {
        // Handle glob patterns
        glob.sync(pattern).forEach((file) => files.add(path.resolve(file)))
      } else {
        // Handle direct file paths
        files.add(path.resolve(pattern))
      }
    })

    return Array.from(files)
  }

  extractClassesFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const classes = new Set()

    switch (path.extname(filePath)) {
      case '.html': {
        const $ = load(content)
        $('[class]').each((_, element) => {
          const classNames = $(element).attr('class').split(/\s+/)
          classNames.forEach((className) => classes.add(className))
        })
        break
      }
      case '.jsx':
      case '.tsx':
      case '.vue': {
        // handle className and class attributes
        const classRegex = /class(?:Name)?=["'`]([^"'`]+)["'`]/g
        let match
        while ((match = classRegex.exec(content)) !== null) {
          match[1].split(/\s+/).forEach((className) => classes.add(className))
        }
        // handle template literals
        const templateRegex = /class(?:Name)?={\s*`([^`]+)`\s*}/g
        while ((match = templateRegex.exec(content)) !== null) {
          match[1].split(/\s+/).forEach((className) => classes.add(className))
        }
        // handle dynamic classes with conditional operators
        const conditionalRegex = /class(?:Name)?={\s*(?:[^}]+?\?[^:]+?:[^}]+?|\{[^}]+\})\s*}/g
        while ((match = conditionalRegex.exec(content)) !== null) {
          // extract potential class names from conditional expressions
          const classString = match[0]
          const potentialClasses = classString.match(/['"`][^'"`]+['"`]/g) || []
          potentialClasses.forEach((cls) => {
            cls
              .replace(/['"`]/g, '')
              .split(/\s+/)
              .forEach((className) => classes.add(className))
          })
        }
        break
      }
    }

    return Array.from(classes)
  }

  async generate(options = {}) {
    const {
      input = ['src/**/*.{html,jsx,tsx,vue}'],
      output = 'dist/styles.css',
      watch = false,
      minify = false,
      sourceMap = false,
      purge = false,
      prefix = ''
    } = options

    this.watchMode = watch
    this.outputPath = output
    this.inputPatterns = Array.isArray(input) ? input : [input]
    this.options = {
      minify,
      sourceMap,
      purge,
      prefix
    }

    console.log('🔍 Scanning input files...')
    await this.buildCSS()

    if (watch) {
      console.log('👀 Watching for changes...')
      this.watchFiles()
    }
  }

  async buildCSS() {
    try {
      // create output directory if it doesn't exist
      const outputDir = path.dirname(this.outputPath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // resolve and scan files
      const files = this.resolveFiles(this.inputPatterns)
      const allClasses = new Set()

      console.log('\nProcessing files:')
      files.forEach((file) => {
        const relativePath = path.relative(process.cwd(), file)
        console.log(`  → ${relativePath}`)
        const classes = this.extractClassesFromFile(file)
        classes.forEach((className) => allClasses.add(className))
      })

      // generate CSS
      console.log(`\nFound ${allClasses.size} unique classes`)
      this.tenoxui.processClassNames(Array.from(allClasses).join(' '))
      let css = this.tenoxui.generateStylesheet()

      // apply prefix if specified
      if (this.options.prefix) {
        css = this.applyPrefix(css, this.options.prefix)
      }

      // minify if requested
      if (this.options.minify) {
        css = this.minifyCSS(css)
      }

      // generate source map if requested
      if (this.options.sourceMap) {
        const sourceMap = this.generateSourceMap(css)
        css += `\n/*# sourceMappingURL=${path.basename(this.outputPath)}.map */`
        fs.writeFileSync(`${this.outputPath}.map`, JSON.stringify(sourceMap))
      }

      // write CSS file
      fs.writeFileSync(this.outputPath, css)
      console.log(`\n✨ Generated CSS file at ${this.outputPath}`)

      if (this.options.minify) {
        const stats = {
          original: css.length,
          minified: css.length,
          saved: ((1 - css.length / css.length) * 100).toFixed(1)
        }
        console.log(`   Minified size: ${stats.minified} bytes (${stats.saved}% savings)`)
      }

      return true
    } catch (error) {
      console.error('Error building CSS:', error)
      return false
    }
  }

  applyPrefix(css, prefix) {
    return css.replace(/\.[\w-]+/g, (match) => `.${prefix}${match.slice(1)}`)
  }

  minifyCSS(css) {
    return css
      .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '') // Remove comments and whitespace
      .replace(/ {2,}/g, ' ') // Remove multiple spaces
      .replace(/ ([{:}]) /g, '$1') // Remove spaces around brackets and colons
      .replace(/([;,]) /g, '$1') // Remove spaces after semicolons and commas
      .trim()
  }

  generateSourceMap(css) {
    // Basic source map generation
    return {
      version: 3,
      file: path.basename(this.outputPath),
      sources: [path.basename(this.outputPath)],
      mappings: '',
      names: []
    }
  }

  watchFiles() {
    const watcher = chokidar.watch(this.inputPatterns, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    })

    let debounceTimer

    watcher
      .on('change', (file) => {
        const relativePath = path.relative(process.cwd(), file)
        console.log(`\nFile changed: ${relativePath}`)
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => this.buildCSS(), 500)
      })
      .on('error', (error) => console.error(`Watcher error: ${error}`))
  }
}

// CLI command handler
async function cli() {
  const args = process.argv.slice(2)
  const options = {
    input: ['src/**/*.{html,jsx,tsx,vue}'],
    output: 'dist/styles.css',
    watch: false,
    minify: false,
    sourceMap: false,
    purge: false,
    prefix: '',
    config: null
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--input':
      case '-i':
        options.input = args[++i].split(',')
        break
      case '--output':
      case '-o':
        options.output = args[++i]
        break
      case '--watch':
      case '-w':
        options.watch = true
        break
      case '--minify':
      case '-m':
        options.minify = true
        break
      case '--source-map':
      case '-s':
        options.sourceMap = true
        break
      case '--prefix':
      case '-p':
        options.prefix = args[++i]
        break
      case '--config':
      case '-c':
        try {
          const configPath = path.resolve(args[++i])
          const configModule = await import(configPath)
          options.config = configModule.default
        } catch (error) {
          console.error('Error loading config file:', error)
          process.exit(1)
        }
        break
      case '--help':
      case '-h':
        console.log(`
TenoxUI CLI - Generate static CSS from your HTML/JSX files

Options:
  --input, -i      Input files (glob patterns supported, comma-separated)
                   default: "src/**/*.{html,jsx,tsx,vue}"
  --output, -o     Output CSS file (default: "dist/styles.css")
  --watch, -w      Watch mode (default: false)
  --minify, -m     Minify output CSS (default: false)
  --source-map, -s Generate source maps (default: false)
  --prefix, -p     Add prefix to all class names (default: "")
  --config, -c     Path to config file
  --help, -h       Show this help message

Examples:
  tenoxui-cli --input "index.html,src/**/*.jsx" --output dist/styles.css --watch
  tenoxui-cli -i "components/*.tsx" -o styles.css -m -s
`)
        process.exit(0)
    }
  }

  const cliInstance = new TenoxUICLI(options.config)
  await cliInstance.generate(options)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cli()
}

export default TenoxUICLI
