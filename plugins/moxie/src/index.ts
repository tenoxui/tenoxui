import { TenoxUI } from '@tenoxui/core'
import type { Plugin } from '@/packages/core/src/types'

export const x: Plugin = {
  name: 'b',
  priority: 'c'
}

console.log(TenoxUI)
export { TenoxUI }
export default TenoxUI
