import type {
	Property,
	Values,
	Aliases,
	Classes,
	Breakpoint,
	CSSPropertyOrVariable
} from '@tenoxui/types'

type StyleValue = string | NestedStyles
type NestedStyles = {
	[selector: string]: StyleValue
}

export interface TenoxUIParams {
	property: Property
	values: Values
	classes: Classes
	aliases: Aliases
	breakpoints: Breakpoint[]
	reserveClass: string[]
	apply?: Record<string, StyleValue>
}

type ProcessedStyle = {
	className: string
	cssRules: string | string[]
	value: string | null
	prefix?: string
}

type MediaQueryRule = {
	mediaKey: string
	ruleSet: string
}

export class TenoxUI {
	private property: Property
	private values: Values
	private classes: Classes
	private aliases: Aliases
	private breakpoints: Breakpoint[]
	private reserveClass: string[]
	private styleMap: Map<string, Set<string>>
	private apply: Record<string, StyleValue>

	constructor({
		property = {},
		values = {},
		classes = {},
		aliases = {},
		breakpoints = [],
		reserveClass = [],
		apply = {}
	}: Partial<TenoxUIParams> = {}) {
		this.property = property
		this.values = values
		this.classes = classes
		this.aliases = aliases
		this.breakpoints = breakpoints
		this.reserveClass = reserveClass
		this.styleMap = new Map()
		this.apply = apply

		if (this.reserveClass.length > 0) {
			this.processReservedClasses()
		}

		this.initializeApplyStyles()
	}

	processReservedClasses() {
		this.reserveClass.forEach(className => {
			this.processClassNames(className)
		})
	}

	toCamelCase(str: string): string {
		return str.replace(/-([a-z])/g, g => g[1].toUpperCase())
	}

	toKebabCase(str: string): string {
		if (/^(webkit|moz|ms|o)[A-Z]/.test(str)) {
			const match = str.match(/^(webkit|moz|ms|o)/)
			if (match) {
				const prefix = match[0]
				return `-${prefix}${str
					.slice(prefix.length)
					.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`
			}
		}

		return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
	}

	escapeCSSSelector(str: string): string {
		return str.replace(/([ #.;?%&,@+*~'"!^$[\]()=>|])/g, '\\$1')
	}

	private generateClassNameRegEx(): RegExp {
		const typePrefixes = Object.keys(this.property)
			.sort((a, b) => b.length - a.length)
			.join('|')

		return new RegExp(
			`(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`
		)
	}

	private parseClassName(
		className: string
	):
		| [
				prefix: string | undefined,
				type: string,
				value: string | undefined,
				unit: string | undefined,
				secValue: string | undefined,
				secUnit: string | undefined
		  ]
		| null {
		const classNameRegEx = this.generateClassNameRegEx()
		const match = className.match(classNameRegEx)
		if (!match) return null

		const [, prefix, type, value, unit, secValue, secUnit] = match
		return [prefix, type, value, unit, secValue, secUnit]
	}

	private processValue(type: string, value?: string, unit?: string): string {
		if (!value) return ''

		const valueRegistry = this.values[value]

		const replaceWithValueRegistry = (text: string): string => {
			return text.replace(/\{([^}]+)\}/g, (match, key) => {
				const val = this.values[key]
				return typeof val === 'string' ? val : match
			})
		}

		if (valueRegistry) {
			return typeof valueRegistry === 'string' ? valueRegistry : valueRegistry[type] || ''
		} else if (value.startsWith('$')) {
			return `var(--${value.slice(1)})`
		} else if (value.startsWith('[') && value.endsWith(']')) {
			const cleanValue = value.slice(1, -1).replace(/_/g, ' ')

			if (cleanValue.includes('{')) {
				return replaceWithValueRegistry(cleanValue)
			}
			return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue
		}

		return value + (unit || '')
	}

	private processShorthand(
		type: string,
		value: string,
		unit: string = '',
		prefix?: string,
		secondValue?: string,
		secondUnit?: string
	): ProcessedStyle | null {
		const properties = this.property[type]
		const finalValue = this.processValue(type, value, unit)

		if (type.startsWith('[') && type.endsWith(']')) {
			const items = type
				.slice(1, -1)
				.split(',')
				.map(item => item.trim())

			const cssRules = items
				.map(item => {
					const prop = this.property[item] || item
					const finalProperty =
						typeof prop === 'string' && prop.startsWith('--')
							? String(prop)
							: this.toKebabCase(String(prop))
					return `${finalProperty}: ${finalValue}`
				})
				.join('; ')

			return {
				className: `${`[${type.slice(1, -1)}]-${value}${unit}`}`,
				cssRules,
				value: null,
				prefix
			}
		}

		if (properties) {
			if (typeof properties === 'object' && 'property' in properties && 'value' in properties) {
				const property = properties.property
				const template = properties.value
				const processedValue = template
					? template.replace(/\{0}/g, finalValue).replace(/\{1}/g, secondValue || '')
					: finalValue

				return {
					className: `${type}-${value}${unit}`,
					cssRules: Array.isArray(property)
						? (property as string[])
						: (this.toKebabCase(String(property)) as string),
					value: processedValue,
					prefix
				}
			}
			// if (Array.isArray(properties)) console.log(properties)

			return {
				className: `${type}-${value}${unit}`,
				cssRules: Array.isArray(properties)
					? (properties as string[])
					: (this.toKebabCase(String(properties)) as string),
				value: finalValue,
				prefix
			}
		}

		return null
	}

	private getParentClass(className: string): CSSPropertyOrVariable[] {
		return Object.keys(this.classes).filter(cssProperty =>
			Object.prototype.hasOwnProperty.call(
				this.classes[cssProperty as CSSPropertyOrVariable],
				className
			)
		) as CSSPropertyOrVariable[]
	}

	private processCustomClass(prefix: string | undefined, className: string): ProcessedStyle | null {
		const properties = this.getParentClass(className)
		if (properties.length > 0) {
			const rules = properties
				.map(prop => {
					const classObj = this.classes[prop]
					return classObj ? `${this.toKebabCase(String(prop))}: ${classObj[className]}` : ''
				})
				.filter(Boolean)
				.join('; ')

			return {
				className: this.escapeCSSSelector(className),
				cssRules: rules,
				value: null,
				prefix
			}
		}

		return null
	}

	private addStyle(
		className: string,
		cssRules: string | string[],
		value?: string | null,
		prefix?: string | null
	): void {
		const key = prefix ? `${prefix}\\:${className}:${prefix}` : className

		if (!this.styleMap.has(key)) {
			this.styleMap.set(key, new Set())
		}

		const styleSet = this.styleMap.get(key)!

		if (Array.isArray(cssRules)) {
			const combinedRule = cssRules
				.map((prop: string) =>
					value ? `${this.toKebabCase(prop)}: ${value}` : this.toKebabCase(prop)
				)
				.join('; ')
			styleSet.add(combinedRule)
		} else {
			styleSet.add(value ? `${cssRules}: ${value}` : cssRules)
		}
	}

	private processAlias(className: string): ProcessedStyle | null {
		const alias = this.aliases[className]
		if (!alias) return null

		const aliasClasses = alias.split(' ')
		const combinedRules: string[] = []

		aliasClasses.forEach(aliasClass => {
			const parsed = this.parseClassName(aliasClass)
			if (!parsed) return

			const [prefix, type, value, unit, secValue, secUnit] = parsed
			const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

			if (result) {
				const value = result.value !== null ? `: ${result.value}` : ''
				if (Array.isArray(result.cssRules)) {
					result.cssRules.forEach(rule => {
						combinedRules.push(`${this.toKebabCase(rule)}${value}`)
					})
				} else {
					combinedRules.push(`${result.cssRules}${value}`)
				}
			}
		})

		return {
			className,
			cssRules: combinedRules.join('; '),
			value: null,
			prefix: undefined
		}
	}

	public processClassNames(classNames: string): void {
		classNames.split(/\s+/).forEach(className => {
			if (!className) return

			const aliasResult = this.processAlias(className)
			if (aliasResult) {
				const { className: aliasClassName, cssRules } = aliasResult
				this.addStyle(aliasClassName, cssRules, null, undefined)
				return
			}

			const [rprefix, rtype] = className.split(':')
			const getType = rtype || rprefix
			const getPrefix = rtype ? rprefix : undefined

			const breakpoint = this.breakpoints.find(bp => bp.name === getPrefix)

			const shouldClasses = this.processCustomClass(getPrefix, getType)

			if (shouldClasses) {
				const { className, cssRules, prefix } = shouldClasses

				if (breakpoint) {
					const { mediaKey, ruleSet } = this.generateMediaQuery(
						breakpoint,
						className,
						cssRules as string
					)
					this.addStyle(mediaKey, ruleSet, null, null)
				} else {
					this.addStyle(className, cssRules, null, prefix)
				}
				return
			}

			const parsed = this.parseClassName(className)
			if (!parsed) return

			const [prefix, type, value, unit, secValue, secUnit] = parsed
			const result = this.processShorthand(type, value!, unit, prefix, secValue, secUnit)

			if (result) {
				const { className, cssRules, value: ruleValue, prefix: rulePrefix } = result
				const processedClass = this.escapeCSSSelector(className)
				if (breakpoint) {
					const rules = Array.isArray(cssRules)
						? cssRules.map(rule => `${this.toKebabCase(rule)}: ${ruleValue}`).join('; ')
						: `${cssRules}: ${ruleValue}`

					const { mediaKey, ruleSet } = this.generateMediaQuery(breakpoint, processedClass, rules)
					this.addStyle(mediaKey, ruleSet, null, null)
				} else {
					this.addStyle(processedClass, cssRules, ruleValue, rulePrefix)
				}
			}
		})
	}

	private initializeApplyStyles() {
		this.processApplyObject(this.apply)
	}

	private processApplyObject(styles: Record<string, StyleValue>, parentSelector: string = '') {
		Object.entries(styles).forEach(([selector, value]) => {
			if (typeof value === 'string') {
				this.processApplyStyles(selector, value, parentSelector)
			} else if (typeof value === 'object') {
				const fullSelector = this.combineSelectors(parentSelector, selector)
				Object.entries(value).forEach(([nestedSelector, nestedValue]) => {
					if (typeof nestedValue === 'string') {
						const finalSelector =
							nestedSelector === ''
								? fullSelector
								: this.combineSelectors(fullSelector, nestedSelector)

						this.processApplyStyles(finalSelector, nestedValue, '')
					}
				})
			}
		})
	}

	private combineSelectors(parent: string, child: string): string {
		if (!parent) return child
		if (child.includes('&')) {
			return child.replace(/&/g, parent)
		}
		if (parent.startsWith('@')) {
			return parent
		}
		return `${parent} ${child}`
	}

	private processApplyStyles(selector: string, classNames: string, parentSelector: string = '') {
		const fullSelector = parentSelector ? this.combineSelectors(parentSelector, selector) : selector
		const processedStyles = new Set<string>()

		classNames.split(/\s+/).forEach(className => {
			if (!className) return

			const parsed = this.parseClassName(className)
			if (!parsed) return

			const [, type, value, unit, secValue, secUnit] = parsed
			const result = this.processShorthand(type, value!, unit, undefined, secValue, secUnit)

			if (result) {
				const { cssRules, value: ruleValue } = result
				// console.log(ruleValue)
				const finalValue = ruleValue !== null ? `: ${ruleValue}` : ''
				if (Array.isArray(cssRules)) {
					cssRules.forEach(rule => {
						processedStyles.add(`${this.toKebabCase(rule)}${finalValue}`)
					})
				} else {
					processedStyles.add(`${cssRules}${finalValue}`)
				}
			}
		})

		if (processedStyles.size > 0) {
			const styleRule = Array.from(processedStyles).join('; ')
			if (selector.startsWith('@media')) {
				if (!this.styleMap.has(selector)) {
					this.styleMap.set(selector, new Set())
				}
				this.styleMap.get(selector)!.add(`${parentSelector} { ${styleRule} }`)
			} else {
				this.addStyle(fullSelector, styleRule, null, null)
			}
		}
	}

	private generateMediaQuery(
		breakpoint: Breakpoint,
		className: string,
		rules: string
	): MediaQueryRule {
		const { name, min, max } = breakpoint
		let mediaQuery = ''

		if (min !== undefined && max !== undefined) {
			mediaQuery = `(min-width: ${min}px) and (max-width: ${max}px)`
		} else if (min !== undefined) {
			mediaQuery = `(min-width: ${min}px)`
		} else if (max !== undefined) {
			mediaQuery = `(max-width: ${max}px)`
		}

		return {
			mediaKey: `@media ${mediaQuery}`,
			ruleSet: `.${name}\\:${className} { ${rules} }`
		}
	}

	generateStylesheet() {
		this.processReservedClasses()
		let stylesheet = ''
		const mediaQueries = new Map()

		this.styleMap.forEach((rules, selector) => {
			if (selector.startsWith('@media')) {
				const mediaQuery = selector.startsWith('@media ')
					? selector
					: selector.replace('@media-', '@media ')
				if (!mediaQueries.has(mediaQuery)) {
					mediaQueries.set(mediaQuery, new Set())
				}
				rules.forEach(rule => {
					mediaQueries.get(mediaQuery).add(rule)
				})
			} else {
				const styles = Array.from(rules).join('; ')
				const [type, prefix] = selector.split(':')
				if (this.apply[selector] || this.apply[type]) {
					stylesheet += `${selector} { ${styles}; }\n`
				} else {
					stylesheet += `.${selector} { ${styles}; }\n`
				}
			}
		})

		mediaQueries.forEach((rules, query) => {
			stylesheet += `${query} {\n`
			rules.forEach((rule: string) => {
				stylesheet += `  ${rule}\n`
			})
			stylesheet += '}\n'
		})

		return stylesheet
	}
}
