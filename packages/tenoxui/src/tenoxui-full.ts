import { MakeTenoxUI, MakeTenoxUIParams } from '@tenoxui/core/full'
import { merge } from '@nousantx/someutils'

type CoreConfig = Omit<MakeTenoxUIParams, 'element'>

const baseIgnoreAttributes: string[] = ['style', 'class', 'id', 'src']
let config: CoreConfig = {
  property: {},
  values: {},
  classes: {},
  aliases: {},
  breakpoints: [],
  attributify: false,
  attributifyPrefix: 'tui-',
  attributifyIgnore: [...baseIgnoreAttributes]
}

export function use(customConfig: Partial<CoreConfig>): CoreConfig {
  config = {
    ...config,
    ...customConfig,
    property: { ...config.property, ...(customConfig.property || {}) },
    values: merge(config.values ?? {}, customConfig.values ?? {}) as CoreConfig['values'],
    classes: merge(config.classes ?? {}, customConfig.classes ?? {}) as CoreConfig['classes'],
    aliases: { ...config.aliases, ...(customConfig.aliases || {}) },
    breakpoints: [...(config.breakpoints ?? []), ...(customConfig.breakpoints ?? [])],
    attributify: customConfig.attributify ?? config.attributify,
    attributifyPrefix: customConfig.attributifyPrefix ?? config.attributifyPrefix,
    attributifyIgnore: Array.from(
      new Set([...baseIgnoreAttributes, ...(customConfig.attributifyIgnore ?? [])])
    )
  }

  return config
}
type EngineConstructor = new (params: MakeTenoxUIParams) => InstanceType<typeof MakeTenoxUI>

export interface TenoxUIConfig {
  property?: CoreConfig['property']
  values?: CoreConfig['values']
  classes?: CoreConfig['classes']
  aliases?: CoreConfig['aliases']
  breakpoints?: CoreConfig['breakpoints']
  selector?: string
  useDom?: boolean
  useClass?: boolean
  attributify?: boolean
  attributifyPrefix?: string
  attributifyIgnore?: string[]
  customEngine?: EngineConstructor
}

export function tenoxui(options: TenoxUIConfig = {}): void {
  const {
    property = {},
    values = {},
    classes = {},
    aliases = {},
    breakpoints = [],
    selector = '*[class]',
    useDom = true,
    useClass = false,
    attributify = false,
    attributifyPrefix = 'tui-',
    attributifyIgnore = [],
    customEngine = MakeTenoxUI
  } = options

  config = {
    ...config,
    property: { ...config.property, ...property },
    values: merge(config.values ?? {}, values) as CoreConfig['values'],
    classes: merge(config.classes ?? {}, classes) as CoreConfig['classes'],
    aliases: { ...config.aliases, ...aliases },
    breakpoints: [...(config.breakpoints ?? []), ...breakpoints],
    attributify,
    attributifyPrefix,
    attributifyIgnore: Array.from(
      new Set([
        ...baseIgnoreAttributes,
        ...(config.attributifyIgnore || []),
        ...(attributifyIgnore || [])
      ])
    )
  }

  if (property) {
    config.property = { ...config.property, ...property }
  }
  if (values) {
    config.values = merge(config.values as object, values) as CoreConfig['values']
  }
  if (classes) {
    config.classes = merge(config.classes as object, classes as object) as CoreConfig['classes']
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

export * from '@tenoxui/core/full'
export default { MakeTenoxUI, use, tenoxui }
