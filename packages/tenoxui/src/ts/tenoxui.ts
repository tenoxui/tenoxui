import { makeTenoxUI, MakeTenoxUIParams } from '@tenoxui/core'
import { merge } from '@nousantx/someutils'

type TenoxUIConfig = Omit<MakeTenoxUIParams, 'element'>

let config: TenoxUIConfig = {
  property: {},
  values: {},
  classes: {},
  breakpoints: []
}

export function use(customConfig: Partial<TenoxUIConfig>): TenoxUIConfig {
  config = {
    ...config,
    ...customConfig,
    property: { ...config.property, ...customConfig.property },
    values: merge(
      config.values as object,
      (customConfig.values || {}) as object
    ) as TenoxUIConfig['values'],
    classes: merge(
      config.classes as object,
      (customConfig.classes || {}) as object
    ) as TenoxUIConfig['classes'],
    breakpoints: [
      ...(config.breakpoints || []),
      ...(customConfig.breakpoints || [])
    ] as TenoxUIConfig['breakpoints']
  }

  return config
}

interface StylesObject {
  [selector: string]: string
}

/**
 * Apply direct styles with selector and tenoxui styles. Example:
 * {
 *   // selector: classNames
 *   body: 'bg-black text-white',
 *   'header > h1': 'fs-3rem fw-600'
 * }
 */
export function applyStyles(styledElement: StylesObject): void {
  Object.entries(styledElement).forEach(([selector, styles]) => {
    const elements = document.querySelectorAll(selector)

    elements.forEach((element) => {
      new makeTenoxUI({ ...config, element: element as HTMLElement }).applyMultiStyles(styles)
    })
  })
}

type EngineConstructor = new (params: MakeTenoxUIParams) => InstanceType<typeof makeTenoxUI>

interface TenoxUIOptions {
  property?: TenoxUIConfig['property']
  values?: TenoxUIConfig['values']
  classes?: TenoxUIConfig['classes']
  breakpoints?: TenoxUIConfig['breakpoints']
  selector?: string
  useDom?: boolean
  useClass?: boolean
  customEngine?: EngineConstructor
}

export function tenoxui(options: TenoxUIOptions = {}): void {
  const {
    property = {},
    values = {},
    classes = {},
    breakpoints = [],
    selector = '*[class]',
    useDom = true,
    useClass = false,
    customEngine = makeTenoxUI
  } = options

  if (property) {
    config.property = { ...config.property, ...property }
  }
  if (values) {
    config.values = merge(config.values as object, values) as TenoxUIConfig['values']
  }
  if (classes) {
    config.classes = merge(config.classes as object, classes as object) as TenoxUIConfig['classes']
  }
  if (breakpoints) {
    config.breakpoints = [...(config.breakpoints || []), ...breakpoints]
  }
  if (useDom && useClass)
    console.warn('Both `useDom` and `useClass` options are set to `true`. Please enable only one.')
  if (!useDom && !useClass)
    console.warn(
      'No styling method used! Both `useDom` and `useClass` options are disabled. Please enable one.'
    )

  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector)

  elements.forEach((element: HTMLElement) => {
    const styler = new customEngine({
      ...config,
      element
    })

    /**
     * Default option is useDom, it's benefical if you want to add DOM compability. Such as:
     * element.classList.add
     * element.classList.toggle
     * element.setAttribute
     * And so on.
     *
     * And it also has functionality to scan the element's className directly, -
     * just like useClass, but better.
     */
    if (useDom) styler.useDOM()

    /**
     * If you prefer only element's className scanning, use useClass option instead.
     *
     * This option will disabling DOM compability!
     */
    if (useClass)
      element.classList.forEach((className) => {
        styler.applyMultiStyles(className)
      })
  })
}

export * from '@tenoxui/core'
export default { makeTenoxUI, use, applyStyles, tenoxui }
