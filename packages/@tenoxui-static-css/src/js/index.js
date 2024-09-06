#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");
const glob = require("glob");
const { Command } = require("commander");
const chokidar = require("chokidar");

class GenerateCSS {
  constructor(config) {
    // validate the config at initialization
    this.validateConfig(config);
    // get config
    this.config = config;
    // stored css
    this.generatedCSS = new Set();
  }

  // utility to validate the config
  validateConfig(config) {
    // required fields, config must have certain fields
    const requiredFields = ["input", "output", "property"];
    requiredFields.forEach(field => {
      if (!config[field]) {
        console.error(`Missing required configuration field: ${field}`);
      }
    });

    config.values = config.values || {};
    config.classes = config.classes || {};
  }

  // utility to convert kebab-type to camelCase
  static toCamelCase(str) {
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
  }

  // utility to convert camelCase to kebab-type
  static toKebabCase(str) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  // add \ (backslash) for some cases
  static escapeCSSSelector(str) {
    return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, "\\$1");
  }

  // utilityto break the className into few parts
  matchClass(className) {
    const regex =
      /(?:([a-zA-Z0-9-]+):)?(-?[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*|\[--[a-zA-Z0-9_-]+\])-(-?(?:\d+(\.\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\[[^\]]+\])|(?:\$[^\s]+))([a-zA-Z%]*)/;
    return className.match(regex)?.slice(1) || null;
  }

  // html parser
  parseHTML(content) {
    const root = parse(content);
    return this.extractClassNames(root);
  }

  // react js parser
  parseJSX(content) {
    const classNameRegex = /className\s*=\s*{?["'`]([^"'`]+)["'`]?}?/g;
    const classNames = new Set();
    let match;
    while ((match = classNameRegex.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(className => classNames.add(className));
    }
    return Array.from(classNames);
  }

  // mdx parser
  parseMDX(content) {
    return [...new Set([...this.parseHTML(content), ...this.parseJSX(content)])];
  }

  // file parser
  parseFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const extension = path.extname(filePath);
      const parsers = {
        ".html": this.parseHTML,
        ".jsx": this.parseJSX,
        ".tsx": this.parseJSX,
        ".mdx": this.parseMDX
      };
      const parser = parsers[extension];

      if (parser) {
        return parser.call(this, content);
      } else {
        console.warn(`Unsupported file type: ${extension}`);
        return [];
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return [];
    }
  }

  // classNames extractor
  extractClassNames(root) {
    return Array.from(
      new Set(root.querySelectorAll("*").flatMap(element => element.getAttribute("class")?.split(/\s+/) || []))
    );
  }

  // parsimg the className
  parseClass(className) {
    const [prefix, type] = className.split(":");
    const getType = type || prefix;
    const getPrefix = type ? prefix : undefined;

    const customCSS = this.processCustomClass(getPrefix, getType);
    if (customCSS) {
      this.generatedCSS.add(customCSS);
      return customCSS;
    }

    const matcher = this.matchClass(className);
    if (!matcher) return null;

    const [parsedPrefix, parsedType, parsedValue, , unit] = matcher;
    const properties = this.config.property[parsedType];
    const finalValue = this.processFinalValue(parsedValue, unit);

    const cssRule = this.generateCSSRuleFromProperties(
      parsedType,
      parsedValue + unit,
      properties,
      finalValue,
      parsedPrefix
    );
    if (cssRule) {
      this.generatedCSS.add(cssRule);
    }
    return cssRule;
  }

  // tenoxui value matcher
  processFinalValue(value, unit) {
    const customValue = this.config.values[value];
    if (customValue) return customValue;
    if (value.startsWith("$")) {
      return `var(--${value.slice(1)})`;
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      const solidValue = value.slice(1, -1).replace(/\\_/g, " ");
      return solidValue.startsWith("--") ? `var(${solidValue})` : solidValue;
    }
    return value + (unit || "");
  }

  // rules output
  generateCSSRule(selector, property, value, prefix) {
    const rule = value ? `${property}: ${value}` : property;
    const escapedSelector = GenerateCSS.escapeCSSSelector(selector);
    return prefix ? `.${prefix}\\:${escapedSelector}:${prefix} { ${rule}; }` : `.${escapedSelector} { ${rule}; }`;
  }

  // rules generator logic
  generateCSSRuleFromProperties(type, value, properties, finalValue, prefix) {
    if (Array.isArray(properties)) {
      const rules = properties.map(prop => `${GenerateCSS.toKebabCase(prop)}: ${finalValue}`).join("; ");
      return this.generateCSSRule(`${type}-${value}`, rules, null, prefix);
    }
    if (typeof properties === "object" && properties !== null) {
      if (properties.property && properties.value) {
        const propValue = properties.value.replace(/{value}/g, finalValue);
        if (Array.isArray(properties.property)) {
          const rules = properties.property.map(prop => `${GenerateCSS.toKebabCase(prop)}: ${propValue}`).join("; ");
          return this.generateCSSRule(`${type}-${value}`, rules, null, prefix);
        }
        return this.generateCSSRule(
          `${type}-${value}`,
          GenerateCSS.toKebabCase(properties.property),
          propValue,
          prefix
        );
      }
      return this.generateCSSRule(`${type}-${value}`, properties, finalValue, prefix);
    }
    if (type.startsWith("[--") && type.endsWith("]")) {
      const variable = type.slice(1, -1).replace(/\\_/g, " ");
      return this.generateCSSRule(`[${variable}]-${value}`, variable, finalValue, prefix);
    }
    if (typeof properties === "string") {
      return this.generateCSSRule(`${type}-${value}`, GenerateCSS.toKebabCase(properties), finalValue, prefix);
    }
    return null;
  }

  // tenoxui.classes handler
  processCustomClass(prefix, className) {
    const properties = Object.entries(this.config.classes)
      .filter(([, classObj]) => classObj.hasOwnProperty(className))
      .reduce((acc, [propKey, classObj]) => {
        acc[GenerateCSS.toKebabCase(propKey)] = classObj[className];
        return acc;
      }, {});

    if (Object.keys(properties).length > 0) {
      const rules = Object.entries(properties)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join("; ");
      return this.generateCSSRule(className, rules, null, prefix);
    }

    return null;
  }

  // create rules
  create(classNames) {
    (Array.isArray(classNames) ? classNames : classNames.split(/\s+/)).forEach(className => this.parseClass(className));
    return Array.from(this.generatedCSS).join("\n");
  }

  // create and scan from files
  generateFromFiles() {
    const classNames = new Set();

    if (this.config.input) {
      this.config.input.forEach(pattern => {
        glob.sync(pattern).forEach(file => {
          this.parseFile(file).forEach(className => classNames.add(className));
        });
      });

      const cssContent = this.create(Array.from(classNames));
      try {
        fs.writeFileSync(this.config.output, cssContent);
        console.log(`CSS file generated at: ${this.config.output}`);
      } catch (error) {
        console.error(`Error writing CSS file ${this.config.output}:`, error);
      }
      return cssContent;
    }
  }
}

function main() {
  const program = new Command();

  program
    .version("1.0.0")
    .description("Generate CSS from class names in your project files.")
    .option("-w, --watch", "Watch mode to regenerate CSS on file changes")
    .option("-c, --config <path>", "Path to the configuration file", "tenoxui.config.js")
    .parse(process.argv);

  const options = program.opts();
  const configPath = path.resolve(process.cwd(), options.config);

  if (!fs.existsSync(configPath)) {
    console.error("No configuration file found!");
    process.exit(1);
  }

  let config = require(configPath);
  let generator = new GenerateCSS(config);

  // Measure and display compilation time
  const generateWithTiming = () => {
    console.time("CSS generated in");
    generator.generateFromFiles();
    console.timeEnd("CSS generated in");
  };

  // Initial generation
  generateWithTiming();

  if (options.watch) {
    const watcher = chokidar.watch([...config.input, configPath], { ignoreInitial: true });

    watcher.on("all", (event, filePath) => {
      if (filePath === configPath) {
        console.log(`Config file changed, reloading...`);
        delete require.cache[require.resolve(configPath)];
        config = require(configPath);
        generator = new GenerateCSS(config);
      }
      generateWithTiming();
    });
  }
}

if (require.main === module) {
  main();
}

module.exports = GenerateCSS;
