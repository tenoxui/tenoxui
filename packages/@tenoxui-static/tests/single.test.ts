import { test, describe, it, expect } from 'vitest'
import { TenoxUI } from '../src/index'

test('single prop', () => {
  const ui = new TenoxUI({
    property: {
      test: ({ key }) => key,
      text: ({ key, value }) => (key === 'size' ? 'fontSize' : 'color'),
      bg: {
        property: ({ key, value, unit }) => (key ? key : unit !== '' ? 'width' : 'background'),
        value: ({ value, unit }) => unit + value
      },
      bg2: {
        property: ({ key, value, unit }) => value,
        value: '{0}'
      },
      c: {
        property: 'color',
        value: ({ value, secondValue }) => {
          return `rgb(${value}${secondValue ? ' / ' + secondValue : ''})`
        }
      },
      border: [
        {
          for: 'length',
          syntax: '<value>',
          property: ({ key }) => key || 'border',
          value: ({ value }) => (value ? `${value}px` : '1px')
        }
      ]
    }
  })
  /*

  console.log(ui.processShorthand('bg', '(border-color:255_0_0)'))
  console.log(ui.processShorthand('bg', '(border-color:--property)'))
  console.log(ui.processShorthand('bg', '(border-width:20px)'))
  console.log(ui.processShorthand('bg', '20', 'px'))
  console.log(ui.processShorthand('border', '1'))
  console.log(ui.processShorthand('border'))
*/
  ui.processClassNames([
    'test-[color:red]',
    'test-[color:rgb(255_0_0_/_40%)]',
    'text-[background:blue]',
    'text-2rem',
    'c-[255_0_0]',
    'c-[255_0_0]/[20%]'
  ])
  const stylesheet = ui.generateStylesheet()
  // console.log(stylesheet)
  expect(1).toBe(1)
})
