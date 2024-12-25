/*!
 * @tenoxui/core v1.3.4
 * Licensed under MIT (https://github.com/tenoxui/tenoxui/blob/main/LICENSE)
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.__tenoxui_core = {}));
})(this, (function (exports) { 'use strict';

    class ComputeValue {
        constructor(element, properties, values) {
            this.element = element;
            this.properties = properties;
            this.values = values;
            this.setCustomClass = this.setStyle.bind(this);
        }
        replaceWithValueRegistry(text) {
            return text.replace(/\{([^}]+)\}/g, (match, key) => {
                var _a;
                return ((_a = this.values[key]) === null || _a === void 0 ? void 0 : _a.toString()) || match;
            });
        }
        valueHandler(type, value, unit) {
            const property = this.properties[type];
            const valueRegistry = this.values[value];
            let resolvedValue = valueRegistry || value;
            if ((value + unit).length !== value.toString().length && unit !== '') {
                return value + unit;
            }
            if (typeof property === 'object' &&
                'value' in property &&
                property.value &&
                !property.value.includes('{0}')) {
                return property.value;
            }
            if (resolvedValue.startsWith('$')) {
                return `var(--${resolvedValue.slice(1)})`;
            }
            if (resolvedValue.startsWith('[') && resolvedValue.endsWith(']')) {
                const cleanValue = resolvedValue.slice(1, -1).replace(/_/g, ' ');
                if (cleanValue.includes('{')) {
                    const replacedValue = this.replaceWithValueRegistry(cleanValue);
                    return replacedValue;
                }
                else {
                    return cleanValue.startsWith('--') ? `var(${cleanValue})` : cleanValue;
                }
            }
            const typeRegistry = this.values[type];
            if (typeRegistry && typeof typeRegistry === 'object') {
                resolvedValue = typeRegistry[value] || resolvedValue;
            }
            return resolvedValue + unit;
        }
        setStyle(property, value) {
            property.startsWith('--')
                ? this.element.style.setProperty(property, value)
                : (this.element.style[property] = value);
        }
        setCustomValue({ property, value: template }, value, secondValue = '') {
            const finalValue = template
                ? template.replace(/\{0}/g, value).replace(/\{1}/g, secondValue)
                : value;
            Array.isArray(property)
                ? property.forEach(prop => this.setStyle(prop, finalValue))
                : this.setStyle(property, finalValue);
        }
        setDefaultValue(property, value) {
            Array.isArray(property)
                ? property.forEach(prop => this.setStyle(prop, value))
                : this.setStyle(property, value);
        }
    }

    const isObjectWithValue = (typeAttribute) => {
        return (typeof typeAttribute === 'object' &&
            typeAttribute !== null &&
            'value' in typeAttribute &&
            'property' in typeAttribute);
    };

    class StyleHandler {
        constructor(element, property, values, classes) {
            this.element = element;
            this.property = property;
            this.values = values;
            this.classes = classes;
            this.computeValue = new ComputeValue(element, property, this.values);
            this.isInitialLoad = new WeakMap();
            if (element) {
                this.isInitialLoad.set(element, true);
            }
        }
        handleTransitionProperty(property, value) {
            const isInitial = this.isInitialLoad.get(this.element);
            if (!isInitial) {
                this.element.style[property] = value;
                return;
            }
            this.element.style.transition = 'none';
            this.element.style.transitionDuration = '0s';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.element.style.transition = '';
                    this.element.style.transitionDuration = '';
                    this.element.style[property] = value;
                    this.isInitialLoad.set(this.element, false);
                });
            });
        }
        handleCSSVariables(type, resolvedValue, secondValue) {
            const items = type
                .slice(1, -1)
                .split(',')
                .map((item) => item.trim());
            items.forEach((item) => {
                const propertyDef = this.property[item];
                if (item.startsWith('--')) {
                    this.computeValue.setCustomClass(item, resolvedValue);
                }
                else if (propertyDef) {
                    if (typeof propertyDef === 'object' && 'property' in propertyDef) {
                        this.computeValue.setCustomValue(propertyDef, resolvedValue, secondValue);
                    }
                    else {
                        this.computeValue.setDefaultValue(propertyDef, resolvedValue);
                    }
                }
                else {
                    this.computeValue.setDefaultValue(item, resolvedValue);
                }
            });
        }
        addStyle(type, value, unit, secondValue, secondUnit, classProp) {
            const propertyDef = this.property[type];
            if (classProp && value && this.classes[classProp]) {
                this.computeValue.setCustomClass(classProp, value);
                return;
            }
            if (!value && isObjectWithValue(propertyDef)) {
                value = propertyDef.value;
            }
            if (!value)
                return;
            const resolvedValue = this.computeValue.valueHandler(type, value, unit || '');
            const resolvedSecondValue = secondValue
                ? this.computeValue.valueHandler(type, secondValue, secondUnit || '')
                : '';
            if (propertyDef === 'transition' || propertyDef === 'transitionDuration') {
                this.handleTransitionProperty(propertyDef, resolvedValue);
                return;
            }
            if (type.startsWith('[') && type.endsWith(']')) {
                this.handleCSSVariables(type, resolvedValue, resolvedSecondValue);
                return;
            }
            if (typeof propertyDef === 'object' && 'property' in propertyDef) {
                this.computeValue.setCustomValue(propertyDef, resolvedValue, resolvedSecondValue);
                return;
            }
            if (propertyDef) {
                this.computeValue.setDefaultValue(propertyDef, resolvedValue);
            }
        }
    }

    class Responsive {
        constructor(element, breakpoints, classes, styler) {
            this.element = element;
            this.breakpoints = breakpoints;
            this.classes = classes;
            this.styler = styler;
        }
        matchBreakpoint({ name, min, max }, prefix, width) {
            if (name !== prefix)
                return false;
            if (min !== undefined && max !== undefined)
                return width >= min && width <= max;
            if (min !== undefined)
                return width >= min;
            if (max !== undefined)
                return width <= max;
            return false;
        }
        handleResponsive(breakpointPrefix, type, value, unit, secondValue = '', secondUnit = '', propKey) {
            const applyStyle = () => {
                if (propKey && this.classes[propKey]) {
                    this.styler.addStyle(type, value, unit, secondValue, secondUnit, propKey);
                }
                else {
                    this.styler.addStyle(type, value, unit, secondValue, secondUnit);
                }
            };
            const handleResize = () => {
                var _a;
                const windowWidth = window.innerWidth;
                const matchPoint = this.breakpoints.find((bp) => this.matchBreakpoint(bp, breakpointPrefix, windowWidth));
                matchPoint ? applyStyle() : (_a = this.element) === null || _a === void 0 ? void 0 : _a.style.setProperty(type, '');
            };
            handleResize();
            window.addEventListener('resize', handleResize);
        }
    }

    function camelToKebab(str) {
        return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    }

    class Pseudo {
        constructor(element, property, classes, computeValue, styler) {
            this.element = element;
            this.property = property;
            this.classes = classes;
            this.computeValue = computeValue;
            this.styler = styler;
        }
        getPropName(type, propKey) {
            if (type.startsWith('[') && type.endsWith(']')) {
                const properties = type
                    .slice(1, -1)
                    .split(',')
                    .map((p) => p.trim());
                const processProp = (prop) => {
                    if (prop.startsWith('--'))
                        return prop;
                    const attrProp = this.property[prop];
                    if (!attrProp)
                        return prop;
                    if (typeof attrProp === 'object' && 'property' in attrProp) {
                        return camelToKebab(attrProp.property);
                    }
                    return camelToKebab(attrProp);
                };
                return properties.length === 1 ? processProp(properties[0]) : properties.map(processProp);
            }
            if (propKey && propKey in this.classes) {
                return camelToKebab(propKey);
            }
            const property = this.property[type];
            if (!property)
                return undefined;
            if (typeof property === 'object' && 'property' in property) {
                return camelToKebab(property.property);
            }
            return Array.isArray(property)
                ? property.map((prop) => camelToKebab(prop))
                : camelToKebab(property);
        }
        getInitialValue(propsName) {
            return Array.isArray(propsName)
                ? propsName.reduce((acc, prop) => {
                    acc[prop] = this.element.style.getPropertyValue(prop);
                    return acc;
                }, {})
                : this.element.style.getPropertyValue(propsName);
        }
        revertStyle(propsName, styleInitValue) {
            if (Array.isArray(propsName)) {
                propsName.forEach((prop) => this.computeValue.setStyle(prop, styleInitValue[prop]));
            }
            else {
                this.computeValue.setStyle(propsName, styleInitValue);
            }
        }
        pseudoHandler(type, value, unit, secondValue, secondUnit, pseudoEvent, revertEvent, propKey) {
            const properties = this.property[type];
            const propsName = propKey ? this.getPropName('', propKey) : this.getPropName(type);
            if (!propsName || !pseudoEvent || !revertEvent)
                return;
            const styleInitValue = this.getInitialValue(propsName);
            const applyStyle = () => {
                if (isObjectWithValue(properties)) {
                    properties.value.includes('{0}')
                        ? this.styler.addStyle(type, value, unit, secondValue, secondUnit)
                        : this.styler.addStyle(type);
                }
                else if (propKey &&
                    propKey in this.classes &&
                    typeof this.classes[propKey] === 'object' &&
                    this.classes[propKey] !== null &&
                    type in this.classes[propKey]) {
                    this.styler.addStyle(type, value, '', '', '', propKey);
                }
                else {
                    this.styler.addStyle(type, value, unit);
                }
            };
            this.element.addEventListener(pseudoEvent, applyStyle);
            this.element.addEventListener(revertEvent, () => this.revertStyle(propsName, styleInitValue));
        }
    }
class ParseClassValue {
   parseValuePattern(pattern, inputValue) {
    if (!pattern.includes('{0}')) return pattern;
    
    const [value, defaultValue] = pattern.split('||').map(s => s.trim());
    return inputValue ? value.replace('{0}', inputValue) : (defaultValue || value);
  }

  static processClassWithValue(className, classes) {
    // Split the class name into base and value parts (e.g., "center-flex" -> ["center", "flex"])
    const parts = className.split('-');
    const baseClass = parts[0];
    const inputValue = parts[1];

    return [baseClass, inputValue];
  }

   getClassValue(
    propKey, 
    className, 
    classConfig
  )  {
    const [baseClass, inputValue] = this.processClassWithValue(className, classConfig);
    const classProperty = classConfig[propKey][baseClass];

    if (!classProperty) return undefined;

    if (typeof classProperty === 'string') {
      return this.parseValuePattern(classProperty, inputValue);
    }

    if (typeof classProperty === 'object' && 'value' in classProperty) {
      return this.parseValuePattern(classProperty.value, inputValue);
    }

    return undefined;
  }
}
    class ParseStyles {
        constructor(property, classes, styler, pseudo, responsive) {
            this.property = property;
            this.classes = classes;
            this.styler = styler;
            this.pseudo = pseudo;
            this.responsive = responsive;
        }
        getParentClass(className) {
            return Object.keys(this.classes).filter((cssProperty) => Object.prototype.hasOwnProperty.call(this.classes[cssProperty], className));
        }
        applyPrefixedStyle(prefix, type, value, unit = '', secondValue = '', secondUnit = '', propKey) {
            const pseudoEvents = {
                hover: ['mouseover', 'mouseout'],
                focus: ['focus', 'blur']
            };
            const events = pseudoEvents[prefix];
            if (events) {
                this.pseudo.pseudoHandler(type, value, unit, secondValue, secondUnit, ...events, propKey);
            }
            else {
                this.responsive.handleResponsive(prefix, type, value, unit, secondValue, secondUnit, propKey);
            }
        }
        parseDefaultStyle(prefix, type, value, unit = '', secondValue = '', secondUnit = '') {
            prefix
                ? this.applyPrefixedStyle(prefix, type, value, unit, secondValue, secondUnit)
                : this.styler.addStyle(type, value, unit, secondValue, secondUnit);
        }
        handlePredefinedStyle(type, prefix) {
            const properties = this.property[type];
            if (properties && isObjectWithValue(properties)) {
                const value = properties.value || '';
                prefix ? this.applyPrefixedStyle(prefix, type, value, '') : this.styler.addStyle(type);
                return true;
            }
            return false;
        }
        handleCustomClass(type, prefix?): boolean {
    const propKeys = this.getParentClass(type);
    if (!propKeys.length) return false;

    propKeys.forEach((propKey) => {
      const classValue = this.classes[propKey];
      if (classValue) {
        // Get the processed value using ParseClassValue
        const value = ParseClassValue.getClassValue(propKey, type, this.classes);
        
        if (value) {
          prefix
            ? this.applyPrefixedStyle(prefix, type, value, '', '', '', propKey)
            : this.styler.addStyle(type, value, '', '', '', propKey);
        }
      }
    });
    return true;
  }
    }

    function createTenoxUIComponents(context) {
        const computeValue = new ComputeValue(context.element, context.property, context.values);
        const styler = new StyleHandler(context.element, context.property, context.values, context.classes);
        const pseudo = new Pseudo(context.element, context.property, context.classes, computeValue, styler);
        const responsive = new Responsive(context.element, context.breakpoints, context.classes, styler);
        const parseStyles = new ParseStyles(context.property, context.classes, styler, pseudo, responsive);
        return { computeValue, styler, responsive, pseudo, parseStyles };
    }

    function getTypePrefixes(styleAttribute) {
        return Object.keys(styleAttribute)
            .sort((a, b) => b.length - a.length)
            .join('|');
    }
    function generateClassNameRegEx(styleAttribute) {
        const typePrefixes = getTypePrefixes(styleAttribute);
        return new RegExp(`(?:([a-zA-Z0-9-]+):)?(${typePrefixes}|\\[[^\\]]+\\])-(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*)(?:\\/(-?(?:\\d+(?:\\.\\d+)?)|(?:[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*(?:-[a-zA-Z0-9_]+)*)|(?:#[0-9a-fA-F]+)|(?:\\[[^\\]]+\\])|(?:\\$[^\\s]+))([a-zA-Z%]*))?`);
    }
    function parseClassName(className, styleAttribute) {
        const classNameRegEx = generateClassNameRegEx(styleAttribute);
        const match = className.match(classNameRegEx);
        if (!match)
            return null;
        const [, prefix, type, value, unit, secValue, secUnit] = match;
        return [prefix, type, value, unit, secValue, secUnit];
    }

    function scanAndApplyStyles(applyStylesCallback, htmlElement) {
        const classes = typeof htmlElement.className === 'string' ? htmlElement.className.split(/\s+/) : [];
        classes.forEach((className) => {
            applyStylesCallback(className);
        });
    }
    function setupClassObserver(applyStylesCallback, htmlElement) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    htmlElement.style.cssText = '';
                    scanAndApplyStyles(applyStylesCallback, htmlElement);
                }
            });
        });
        observer.observe(htmlElement, { attributes: true });
    }

    class MakeTenoxUI {
        constructor({ element, property = {}, values = {}, breakpoints = [], classes = {}, aliases = {} }) {
            this.element = element;
            this.property = property;
            this.values = values;
            this.breakpoints = breakpoints;
            this.classes = classes;
            this.aliases = aliases;
            this.create = createTenoxUIComponents({
                element: this.element,
                property: this.property,
                values: this.values,
                classes: this.classes,
                breakpoints: this.breakpoints
            });
        }
        useDOM(element) {
            const targetElement = element || this.element;
            if (!targetElement)
                return;
            const applyStyles = (className) => this.applyStyles(className);
            if (targetElement.className) {
                scanAndApplyStyles(applyStyles, targetElement);
                setupClassObserver(applyStyles, targetElement);
            }
        }
        parseStylePrefix(className) {
            const [prefix, type] = className.split(':');
            return {
                prefix: type ? prefix : undefined,
                type: type || prefix
            };
        }
        applyStyles(className) {
            const { prefix, type } = this.parseStylePrefix(className);
            const processStyle = (style) => {
                if (this.create.parseStyles.handlePredefinedStyle(type, prefix))
                    return;
                if (this.create.parseStyles.handleCustomClass(type, prefix))
                    return;
                const parts = parseClassName(style, this.property);
                if (!parts)
                    return;
                const [parsedPrefix, parsedType, value = '', unit = '', secValue, secUnit] = parts;
                this.create.parseStyles.parseDefaultStyle(parsedPrefix, parsedType, value, unit, secValue, secUnit);
            };
            const resolveAlias = (alias, outerPrefix = '') => {
                const seen = new Set();
                const resolve = (currentAlias, currentPrefix) => {
                    if (!this.aliases[currentAlias]) {
                        return currentPrefix ? `${currentPrefix}:${currentAlias}` : currentAlias;
                    }
                    if (seen.has(currentAlias))
                        return currentAlias;
                    seen.add(currentAlias);
                    const expanded = this.aliases[currentAlias]
                        .split(/\s+/)
                        .map((part) => {
                        const { prefix: innerPrefix, type: innerType } = this.parseStylePrefix(part);
                        const combinedPrefix = currentPrefix || innerPrefix || '';
                        return resolve(innerType, combinedPrefix);
                    })
                        .join(' ');
                    return expanded;
                };
                return resolve(alias, outerPrefix);
            };
            if (this.aliases && this.aliases[type]) {
                const resolvedAlias = resolveAlias(type, prefix);
                const aliasStyles = resolvedAlias.split(/\s+/).map((alias) => {
                    if (prefix && alias.startsWith(`${prefix}:`)) {
                        alias = alias.slice(prefix.length + 1);
                    }
                    return prefix ? `${prefix}:${alias}` : alias;
                });
                aliasStyles.forEach(processStyle);
                return;
            }
            processStyle(className);
        }
        applyMultiStyles(styles) {
            styles.split(/\s+/).forEach((style) => this.applyStyles(style));
        }
    }

    exports.MakeTenoxUI = MakeTenoxUI;

}));
//# sourceMappingURL=tenoxui.js.map
