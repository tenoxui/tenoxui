import { Plugin, PluginFactory, PluginLike } from '../types'

export function flattenPlugins(plugins: (Plugin | PluginFactory | PluginLike)[]): Plugin[] {
  const flattened: Plugin[] = []

  for (const plugin of plugins) {
    if (typeof plugin === 'function') {
      const result = plugin()
      if (Array.isArray(result)) {
        flattened.push(...result)
      } else {
        flattened.push(result)
      }
    } else if (Array.isArray(plugin)) {
      flattened.push(...plugin)
    } else {
      flattened.push(plugin as Plugin)
    }
  }

  return flattened
}

export function createPluginError(pluginName: string, hooksName: string, err: any): void {
  console.error(`Plugin "${hooksName}" ${pluginName} failed:`, err)
}
