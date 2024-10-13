import { MakeTenoxUIParams } from './lib/types'
import { TenoxUIContext, createTenoxUIComponents } from './utils/assigner'

// makeTenoxUI
class makeTenoxUI {
  private readonly context: TenoxUIContext
  private readonly create: ReturnType<typeof createTenoxUIComponents>

  constructor(params: MakeTenoxUIParams) {
    this.context = new TenoxUIContext(params)
    this.create = createTenoxUIComponents(this.context)
  }

  public useDOM() {
    const applyStyles = (className: string) => this.applyStyles(className)
    this.create.observer.scanAndApplyStyles(applyStyles)
    this.create.observer.setupClassObserver(applyStyles)
  }

  public applyStyles(className: string): void {
    const [prefix, type] = className.split(':')
    const getType = type || prefix
    const getPrefix = type ? prefix : undefined

    if (this.create.parseStyles.handlePredefinedStyle(getType, getPrefix)) return

    if (this.create.parseStyles.handleCustomClass(getType, getPrefix)) return

    const parts = this.create.parser.parseClassName(className)

    if (!parts) return

    const [parsedPrefix, parsedType, value = '', unit = ''] = parts

    this.create.parseStyles.parseDefaultStyle(parsedPrefix, parsedType, value, unit)
  }

  public applyMultiStyles(styles: string): void {
    styles.split(/\s+/).forEach((style) => this.applyStyles(style))
  }
}

export { makeTenoxUI }
export * from './lib/types'
