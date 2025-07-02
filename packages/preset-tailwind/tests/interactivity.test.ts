import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Interactivity', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Accent Color', () => {
    const classNames = [
      'accent-rebeccapurple',
      'accent-red-500',
      'accent-red-400/40',
      'accent-#ccf654',
      'accent-#ccf654/40',
      'accent-#ccf654',
      'accent-[rgb(255_0_0_/_40%)]',
      'accent-(rgb(255_0_0))/40',
      'accent-current',
      'accent-current/40',
      'accent-blue',
      'accent-red',
      'accent-red/40',
      'accent-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.accent-rebeccapurple {
  accent-color: rebeccapurple;
}
.accent-red-500 {
  accent-color: oklch(63.7% 0.237 25.331);
}
.accent-red-400\\/40 {
  accent-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    accent-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.accent-\\#ccf654 {
  accent-color: #ccf654;
}
.accent-\\#ccf654\\/40 {
  accent-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    accent-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.accent-\\#ccf654 {
  accent-color: #ccf654;
}
.accent-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  accent-color: rgb(255 0 0 / 40%);
}
.accent-\\(rgb\\(255_0_0\\)\\)\\/40 {
  accent-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    accent-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.accent-current {
  accent-color: currentColor;
}
.accent-current\\/40 {
  accent-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    accent-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.accent-blue {
  accent-color: blue;
}
.accent-red {
  accent-color: red;
}
.accent-red\\/40 {
  accent-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    accent-color: color-mix(in oklab, red 40%, transparent);
  }
}
.accent-transparent {
  accent-color: transparent;
}`
    )
  })
  test('Apearance', () => {
    const classNames = ['appearance-none', 'appearance-auto']
    expect(css.render(classNames)).toBe(
      `.appearance-none {
  appearance: none;
}
.appearance-auto {
  appearance: auto;
}`
    )
  })
  test('Caret Color', () => {
    const classNames = [
      'caret-rebeccapurple',
      'caret-red-500',
      'caret-red-400/40',
      'caret-#ccf654',
      'caret-#ccf654/40',
      'caret-#ccf654',
      'caret-[rgb(255_0_0_/_40%)]',
      'caret-(rgb(255_0_0))/40',
      'caret-current',
      'caret-current/40',
      'caret-blue',
      'caret-red',
      'caret-red/40',
      'caret-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.caret-rebeccapurple {
  caret-color: rebeccapurple;
}
.caret-red-500 {
  caret-color: oklch(63.7% 0.237 25.331);
}
.caret-red-400\\/40 {
  caret-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    caret-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.caret-\\#ccf654 {
  caret-color: #ccf654;
}
.caret-\\#ccf654\\/40 {
  caret-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    caret-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.caret-\\#ccf654 {
  caret-color: #ccf654;
}
.caret-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  caret-color: rgb(255 0 0 / 40%);
}
.caret-\\(rgb\\(255_0_0\\)\\)\\/40 {
  caret-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    caret-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.caret-current {
  caret-color: currentColor;
}
.caret-current\\/40 {
  caret-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    caret-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.caret-blue {
  caret-color: blue;
}
.caret-red {
  caret-color: red;
}
.caret-red\\/40 {
  caret-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    caret-color: color-mix(in oklab, red 40%, transparent);
  }
}
.caret-transparent {
  caret-color: transparent;
}`
    )
  })
  test('Color Scheme', () => {
    const classNames = [
      'scheme-normal',
      'scheme-dark',
      'scheme-light',
      'scheme-light-dark',
      'scheme-only-dark',
      'scheme-only-light'
    ]
    expect(css.render(classNames)).toBe(
      `.scheme-normal {
  color-scheme: normal;
}
.scheme-dark {
  color-scheme: dark;
}
.scheme-light {
  color-scheme: light;
}
.scheme-light-dark {
  color-scheme: light dark;
}
.scheme-only-dark {
  color-scheme: only dark;
}
.scheme-only-light {
  color-scheme: only light;
}`
    )
  })
  test('Cursor', () => {
    const classNames = [
      'cursor-auto',
      'cursor-default',
      'cursor-pointer',
      'cursor-wait',
      'cursor-text',
      'cursor-move',
      'cursor-help',
      'cursor-not-allowed',
      'cursor-none',
      'cursor-context-menu',
      'cursor-progress',
      'cursor-cell',
      'cursor-crosshair',
      'cursor-vertical-text',
      'cursor-alias',
      'cursor-copy',
      'cursor-no-drop',
      'cursor-grab',
      'cursor-grabbing',
      'cursor-all-scroll'
    ]
    expect(css.render(classNames)).toBe(
      `.cursor-auto {
  cursor: auto;
}
.cursor-default {
  cursor: default;
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-wait {
  cursor: wait;
}
.cursor-text {
  cursor: text;
}
.cursor-move {
  cursor: move;
}
.cursor-help {
  cursor: help;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-none {
  cursor: none;
}
.cursor-context-menu {
  cursor: context-menu;
}
.cursor-progress {
  cursor: progress;
}
.cursor-cell {
  cursor: cell;
}
.cursor-crosshair {
  cursor: crosshair;
}
.cursor-vertical-text {
  cursor: vertical-text;
}
.cursor-alias {
  cursor: alias;
}
.cursor-copy {
  cursor: copy;
}
.cursor-no-drop {
  cursor: no-drop;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}
.cursor-all-scroll {
  cursor: all-scroll;
}`
    )
  })
  test('Field Sizing', () => {
    const classNames = ['field-sizing-fixed', 'field-sizing-content']
    expect(css.render(classNames)).toBe(
      `.field-sizing-fixed {
  field-sizing: fixed;
}
.field-sizing-content {
  field-sizing: content;
}`
    )
  })
  test('Pointer Events', () => {
    const classNames = ['pointer-events-auto', 'pointer-events-none']
    expect(css.render(classNames)).toBe(
      `.pointer-events-auto {
  pointer-events: auto;
}
.pointer-events-none {
  pointer-events: none;
}`
    )
  })
  test('Resize', () => {
    const classNames = ['resize-none', 'resize', 'resize-y', 'resize-x']
    expect(css.render(classNames)).toBe(
      `.resize-none {
  resize: none;
}
.resize {
  resize: both;
}
.resize-y {
  resize: vertical;
}
.resize-x {
  resize: horizontal;
}`
    )
  })
  test('Scroll Behavior', () => {
    const classNames = ['scroll-auto', 'scroll-smooth']
    expect(css.render(classNames)).toBe(
      `.scroll-auto {
  scroll-behavior: auto;
}
.scroll-smooth {
  scroll-behavior: smooth;
}`
    )
  })
  test('Scroll Margin', () => {
    const classNames = [
      'scroll-m-4',
      'scroll-m-4px',
      'scroll-m-4rem',
      'scroll-mx-4',
      'scroll-my-4px',
      'scroll-mt-4rem',
      'scroll-mr-4',
      'scroll-me-4',
      'scroll-ms-4',
      'scroll-ml-4px',
      'scroll-mb-4rem'
    ]
    expect(css.render(classNames)).toBe(
      `.scroll-m-4 {
  scroll-margin: 1rem;
}
.scroll-m-4px {
  scroll-margin: 4px;
}
.scroll-m-4rem {
  scroll-margin: 4rem;
}
.scroll-mx-4 {
  scroll-margin-inline: 1rem;
}
.scroll-my-4px {
  scroll-margin-block: 4px;
}
.scroll-mt-4rem {
  scroll-margin-top: 4rem;
}
.scroll-mr-4 {
  scroll-margin-right: 1rem;
}
.scroll-me-4 {
  scroll-margin-inline-end: 1rem;
}
.scroll-ms-4 {
  scroll-margin-inline-start: 1rem;
}
.scroll-ml-4px {
  scroll-margin-left: 4px;
}
.scroll-mb-4rem {
  scroll-margin-bottom: 4rem;
}`
    )
  })
  test('Scroll Padding', () => {
    const classNames = [
      'scroll-p-4',
      'scroll-p-4px',
      'scroll-p-4rem',
      'scroll-px-4',
      'scroll-py-4px',
      'scroll-pt-4rem',
      'scroll-pr-4',
      'scroll-pe-4',
      'scroll-ps-4',
      'scroll-pl-4px',
      'scroll-pb-4rem'
    ]
    expect(css.render(classNames)).toBe(
      `.scroll-p-4 {
  scroll-padding: 1rem;
}
.scroll-p-4px {
  scroll-padding: 4px;
}
.scroll-p-4rem {
  scroll-padding: 4rem;
}
.scroll-px-4 {
  scroll-padding-inline: 1rem;
}
.scroll-py-4px {
  scroll-padding-block: 4px;
}
.scroll-pt-4rem {
  scroll-padding-top: 4rem;
}
.scroll-pr-4 {
  scroll-padding-right: 1rem;
}
.scroll-pe-4 {
  scroll-padding-inline-end: 1rem;
}
.scroll-ps-4 {
  scroll-padding-inline-start: 1rem;
}
.scroll-pl-4px {
  scroll-padding-left: 4px;
}
.scroll-pb-4rem {
  scroll-padding-bottom: 4rem;
}`
    )
  })
  test('Scroll Snap Align', () => {
    const classNames = ['snap-start', 'snap-end', 'snap-center', 'snap-align-none']
    expect(css.render(classNames)).toBe(
      `.snap-start {
  scroll-snap-align: start;
}
.snap-end {
  scroll-snap-align: end;
}
.snap-center {
  scroll-snap-align: center;
}
.snap-align-none {
  scroll-snap-align: none;
}`
    )
  })
  test('Scroll Snap Stop', () => {
    const classNames = ['snap-normal', 'snap-always']
    expect(css.render(classNames)).toBe(
      `.snap-normal {
  scroll-snap-stop: normal;
}
.snap-always {
  scroll-snap-stop: always;
}`
    )
  })
  test('Scroll Snap Type', () => {
    const classNames = [
      'snap-none',
      'snap-x',
      'snap-y',
      'snap-both',
      'snap-mandatory',
      'snap-proximity'
    ]
    expect(css.render(classNames)).toBe(
      `.snap-none {
  scroll-snap-type: none;
}
.snap-x {
  scroll-snap-type: x var(--tw-scroll-snap-strictness);
}
.snap-y {
  scroll-snap-type: y var(--tw-scroll-snap-strictness);
}
.snap-both {
  scroll-snap-type: both var(--tw-scroll-snap-strictness);
}
.snap-mandatory {
  --tw-scroll-snap-strictness: mandatory;
}
.snap-proximity {
  --tw-scroll-snap-strictness: proximity;
}`
    )
  })
  test('Touch Action', () => {
    const classNames = [
      'touch-auto',
      'touch-none',
      'touch-pan-x',
      'touch-pan-left',
      'touch-pan-right',
      'touch-pan-y',
      'touch-pan-up',
      'touch-pan-down',
      'touch-pinch-zoom',
      'touch-manipulation'
    ]
    expect(css.render(classNames)).toBe(
      `.touch-auto {
  touch-action: auto;
}
.touch-none {
  touch-action: none;
}
.touch-pan-x {
  touch-action: pan-x;
}
.touch-pan-left {
  touch-action: pan-left;
}
.touch-pan-right {
  touch-action: pan-right;
}
.touch-pan-y {
  touch-action: pan-y;
}
.touch-pan-up {
  touch-action: pan-up;
}
.touch-pan-down {
  touch-action: pan-down;
}
.touch-pinch-zoom {
  touch-action: pinch-zoom;
}
.touch-manipulation {
  touch-action: manipulation;
}`
    )
  })
})
