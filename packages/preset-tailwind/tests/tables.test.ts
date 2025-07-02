import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Tables', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Border Collapse', () => {
    const classNames = ['border-collapse', 'border-separate']
    expect(css.render(classNames)).toBe(
      `.border-collapse {
  border-collapse: collapse;
}
.border-separate {
  border-collapse: separate;
}`
    )
  })
  test('Border Spacing', () => {
    const classNames = [
      'border-spacing-4',
      'border-spacing-10',
      'border-spacing-x-4',
      'border-spacing-x-10',
      'border-spacing-y-4',
      'border-spacing-y-10'
    ]
    expect(css.render(classNames)).toBe(
      `.border-spacing-4 {
  border-spacing: 1rem;
}
.border-spacing-10 {
  border-spacing: 2.5rem;
}
.border-spacing-x-4 {
  --tw-border-spacing-x: 1rem;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
.border-spacing-x-10 {
  --tw-border-spacing-x: 2.5rem;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
.border-spacing-y-4 {
  --tw-border-spacing-y: 1rem;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
.border-spacing-y-10 {
  --tw-border-spacing-y: 2.5rem;
  border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}`
    )
  })
  test('Table Layout', () => {
    const classNames = ['table-auto', 'table-fixed']
    expect(css.render(classNames)).toBe(
      `.table-auto {
  table-layout: auto;
}
.table-fixed {
  table-layout: fixed;
}`
    )
  })
  test('Caption Side', () => {
    const classNames = ['caption-top', 'caption-bottom']
    expect(css.render(classNames)).toBe(
      `.caption-top {
  caption-side: top;
}
.caption-bottom {
  caption-side: bottom;
}`
    )
  })
})
