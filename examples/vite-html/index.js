import { TenoxUI } from '@tenoxui/static'

const ui = new TenoxUI({
  property: {
    bg: 'background',
    bgx: ({ value }) => `value:background-color: ${value}`
  }
})

console.log(ui.generate(['bg-red', 'bgx-red']))
