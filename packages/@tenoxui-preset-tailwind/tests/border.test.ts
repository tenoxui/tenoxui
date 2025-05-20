import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Border', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Border Radius', () => {
    const classNames = [
      'rounded-xs',
      'rounded-xl',
      'rounded-full',
      'rounded-none',
      'rounded-4',
      'rounded-4px',
      'rounded-4rem',
      'rounded-4%',

      'rounded-s-xs',
      'rounded-e-xl',
      'rounded-t-full',
      'rounded-r-none',
      'rounded-b-4',
      'rounded-l-4px',
      'rounded-ss-4rem',
      'rounded-ee-4%',

      'rounded-se-xs',
      'rounded-es-xl',
      'rounded-tr-full',
      'rounded-br-none',
      'rounded-bl-4',
      'rounded-br-4px'
    ]
    expect(css.render(classNames)).toBe(
      `.rounded-xs {
  border-radius: 0.125rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-full {
  border-radius: calc(infinity * 1px);
}
.rounded-none {
  border-radius: 0;
}
.rounded-4 {
  border-radius: 1rem;
}
.rounded-4px {
  border-radius: 4px;
}
.rounded-4rem {
  border-radius: 4rem;
}
.rounded-4\\% {
  border-radius: 4%;
}
.rounded-s-xs {
  border-start-start-radius: 0.125rem;
  border-end-start-radius: 0.125rem;
}
.rounded-e-xl {
  border-start-end-radius: 0.75rem;
  border-end-end-radius: 0.75rem;
}
.rounded-t-full {
  border-top-left-radius: calc(infinity * 1px);
  border-top-right-radius: calc(infinity * 1px);
}
.rounded-r-none {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.rounded-b-4 {
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
.rounded-l-4px {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.rounded-ss-4rem {
  border-start-start-radius: 4rem;
}
.rounded-ee-4\\% {
  border-end-end-radius: 4%;
}
.rounded-se-xs {
  border-start-end-radius: 0.125rem;
}
.rounded-es-xl {
  border-end-start-radius: 0.75rem;
}
.rounded-tr-full {
  border-top-right-radius: calc(infinity * 1px);
}
.rounded-br-none {
  border-bottom-right-radius: 0;
}
.rounded-bl-4 {
  border-bottom-left-radius: 1rem;
}
.rounded-br-4px {
  border-bottom-right-radius: 4px;
}`
    )
  })
  test('Border Width', () => {
    const classNames = [
      'border',
      'border-x',
      'border-y',
      'border-t',
      'border-b',

      'border-4',
      'border-4px',
      'border-4rem',
      'border-(length:--my-size)',

      'divide-x-4',
      'divide-x-4rem',
      'divide-x-4px'
    ]
    expect(css.render(classNames)).toBe(
      `.border {
  border-width: 1px;
}
.border-x {
  border-inline-width: 1px;
}
.border-y {
  border-block-width: 1px;
}
.border-t {
  border-inline-top-width: 1px;
}
.border-b {
  border-inline-bottom-width: 1px;
}
.border-4 {
  border-width: 4px;
}
.border-4px {
  border-width: 4px;
}
.border-4rem {
  border-width: 4rem;
}
.border-\\(length\\:--my-size\\) {
  border-width: var(--my-size)px;
}
.divide-x-4 > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: 4px;
}
.divide-x-4rem > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: 4rem;
}
.divide-x-4px > :not(:last-child) {
  border-inline-start-width: 0px;
  border-inline-end-width: 4px;
}`
    )
  })
  test('Border Color', () => {
    const classNames = [
      'border-rebeccapurple',
      'border-red-500',
      'border-red-400/40',
      'border-#ccf654',
      'border-#ccf654/40',
      'border-#ccf654',
      'border-[rgb(255_0_0_/_40%)]',
      'border-(rgb(255_0_0))/40',
      'border-current',
      'border-current/40',
      'border-blue',
      'border-red',
      'border-red/40',
      'border-transparent',
      'border-x-rebeccapurple',
      'border-y-red-500',
      'border-t-red-400/40',
      'border-r-#ccf654',
      'border-l-#ccf654/40',
      'border-b-#ccf654',
      'divide-[rgb(255_0_0_/_40%)]',
      'divide-(rgb(255_0_0))/40',
      'divide-current',
      'divide-current/40'
    ]
    expect(css.render(classNames)).toBe(
      `.border-rebeccapurple {
  border-color: rebeccapurple;
}
.border-red-500 {
  border-color: oklch(63.7% 0.237 25.331);
}
.border-red-400\\/40 {
  border-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.border-\\#ccf654 {
  border-color: #ccf654;
}
.border-\\#ccf654\\/40 {
  border-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.border-\\#ccf654 {
  border-color: #ccf654;
}
.border-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  border-color: rgb(255 0 0 / 40%);
}
.border-\\(rgb\\(255_0_0\\)\\)\\/40 {
  border-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.border-current {
  border-color: currentColor;
}
.border-current\\/40 {
  border-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.border-blue {
  border-color: blue;
}
.border-red {
  border-color: red;
}
.border-red\\/40 {
  border-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, red 40%, transparent);
  }
}
.border-transparent {
  border-color: transparent;
}
.border-x-rebeccapurple {
  border-inline-color: rebeccapurple;
}
.border-y-red-500 {
  border-block-color: oklch(63.7% 0.237 25.331);
}
.border-t-red-400\\/40 {
  border-top-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-top-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.border-r-\\#ccf654 {
  border-right-color: #ccf654;
}
.border-l-\\#ccf654\\/40 {
  border-left-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-left-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.border-b-\\#ccf654 {
  border-bottom-color: #ccf654;
}
.divide-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] > :not(:last-child) {
  border-color: rgb(255 0 0 / 40%);
}
.divide-\\(rgb\\(255_0_0\\)\\)\\/40 > :not(:last-child) {
  border-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.divide-current > :not(:last-child) {
  border-color: currentColor;
}
.divide-current\\/40 > :not(:last-child) {
  border-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    border-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}`
    )
  })
  test('Border Style', () => {
    const classNames = ['border-solid', 'border-dashed', 'divide-dashed', 'divide-solid']
    expect(css.render(classNames)).toBe(
      `.border-solid {
  border-style: solid;
}
.border-dashed {
  border-style: dashed;
}
.divide-dashed > :not(:last-child) {
  border-style: dashed;
}
.divide-solid > :not(:last-child) {
  border-style: solid;
}`
    )
  })
  test('Outline Width', () => {
    const classNames = ['outline', 'outline-4', 'outline-(length:--my-size)', 'outline-[10rem]']
    expect(css.render(classNames)).toBe(
      `.outline {
  outline-width: 1px;
}
.outline-4 {
  outline-width: 4px;
}
.outline-\\(length\\:--my-size\\) {
  outline-width: var(--my-size)px;
}
.outline-\\[10rem\\] {
  outline: 10rem;
}`
    )
  })
  test('Outline Color', () => {
    const classNames = [
      'outline-rebeccapurple',
      'outline-red-500',
      'outline-red-400/40',
      'outline-#ccf654',
      'outline-#ccf654/40',
      'outline-#ccf654',
      'outline-[rgb(255_0_0_/_40%)]',
      'outline-(rgb(255_0_0))/40',
      'outline-current',
      'outline-current/40',
      'outline-blue',
      'outline-red',
      'outline-red/40',
      'outline-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.outline-rebeccapurple {
  outline-color: rebeccapurple;
}
.outline-red-500 {
  outline-color: oklch(63.7% 0.237 25.331);
}
.outline-red-400\\/40 {
  outline-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    outline-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.outline-\\#ccf654 {
  outline-color: #ccf654;
}
.outline-\\#ccf654\\/40 {
  outline-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    outline-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.outline-\\#ccf654 {
  outline-color: #ccf654;
}
.outline-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  outline-color: rgb(255 0 0 / 40%);
}
.outline-\\(rgb\\(255_0_0\\)\\)\\/40 {
  outline-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    outline-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.outline-current {
  outline-color: currentColor;
}
.outline-current\\/40 {
  outline-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    outline-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.outline-blue {
  outline-color: blue;
}
.outline-red {
  outline-color: red;
}
.outline-red\\/40 {
  outline-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    outline-color: color-mix(in oklab, red 40%, transparent);
  }
}
.outline-transparent {
  outline-color: transparent;
}`
    )
  })
  test('Outline Style', () => {
    const classNames = ['outline-none', 'outline-hidden', 'outline-solid']
    expect(css.render(classNames)).toBe(
      `.outline-none {
  outline-style: none;
}
.outline-hidden {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline-solid {
  outline-style: solid;
}`
    )
  })
  test('Outline Offset', () => {
    const classNames = [
      'outline-offset-4',
      'outline-offset--4',
      'outline-offset-4px',
      'outline-offset-4rem'
    ]
    expect(css.render(classNames)).toBe(
      `.outline-offset-4 {
  outline-offset: 4px;
}
.outline-offset--4 {
  outline-offset: -4px;
}
.outline-offset-4px {
  outline-offset: 4px;
}
.outline-offset-4rem {
  outline-offset: 4rem;
}`
    )
  })
})
