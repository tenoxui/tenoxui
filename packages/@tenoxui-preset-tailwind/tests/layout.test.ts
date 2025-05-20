import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Layout', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Aspect Ratio', () => {
    expect(
      css.render([
        // defined value
        'aspect-square',
        'aspect-video',
        // custom ratio
        'aspect-1/1'
      ])
    ).toBe(
      `.aspect-square {\n  aspect-ratio: 1 / 1;\n}\n.aspect-video {\n  aspect-ratio: 16 / 9;\n}\n.aspect-1\\/1 {\n  aspect-ratio: 1 / 1;\n}`
    )
  })
  test('Columns', () => {
    expect(
      css.render([
        // defined value
        'columns-4',
        'columns-400px',
        'columns-3xs',
        'columns-7xl',
        'columns-auto'
      ])
    ).toBe(`.columns-4 {
  columns: 4;
}
.columns-400px {
  columns: 400px;
}
.columns-3xs {
  columns: 16rem;
}
.columns-7xl {
  columns: 80rem;
}
.columns-auto {
  columns: auto;
}`)
  })
  test('Break After', () => {
    expect(css.render(['break-after-auto', 'break-after-avoid-page', 'break-after-left']))
      .toBe(`.break-after-auto {
  break-after: auto;
}
.break-after-avoid-page {
  break-after: avoid-page;
}
.break-after-left {
  break-after: left;
}`)
  })
  test('Break Before', () => {
    expect(css.render(['break-before-auto', 'break-before-avoid-page', 'break-before-left']))
      .toBe(`.break-before-auto {
  break-before: auto;
}
.break-before-avoid-page {
  break-before: avoid-page;
}
.break-before-left {
  break-before: left;
}`)
  })
  test('Break Inside', () => {
    expect(css.render(['break-inside-auto', 'break-inside-avoid-page', 'break-inside-avoid']))
      .toBe(`.break-inside-auto {
  break-inside: auto;
}
.break-inside-avoid-page {
  break-inside: avoid-page;
}
.break-inside-avoid {
  break-inside: avoid;
}`)
  })
  test('Box Decoration Clone', () => {
    expect(css.render(['box-decoration-clone', 'box-decoration-slice']))
      .toBe(`.box-decoration-clone {
  box-decoration-break: clone;
}
.box-decoration-slice {
  box-decoration-break: slice;
}`)
  })
  test('Box Sizing', () => {
    expect(css.render(['box-border', 'box-content'])).toBe(`.box-border {
  box-sizing: border-box;
}
.box-content {
  box-sizing: content-box;
}`)
  })
  test('Display', () => {
    expect(css.render(['inline-block', 'hidden', 'flex', 'sr-only'])).toBe(`.inline-block {
  display: inline-block;
}
.hidden {
  display: none;
}
.flex {
  display: flex;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`)
  })
  test('Float', () => {
    expect(css.render(['float-left', 'float-start'])).toBe(`.float-left {
  float: left;
}
.float-start {
  float: inline-start;
}`)
  })
  test('Clear', () => {
    expect(css.render(['clear-left', 'clear-start'])).toBe(`.clear-left {
  clear: left;
}
.clear-start {
  clear: inline-start;
}`)
  })
  test('Isolation', () => {
    expect(css.render(['isolate', 'isolation-auto'])).toBe(`.isolate {
  isolation: isolate;
}
.isolation-auto {
  isolation: auto;
}`)
  })
  test('Object Fit', () => {
    expect(css.render(['object-fill', 'object-cover', 'object-none'])).toBe(`.object-fill {
  object-fit: fill;
}
.object-cover {
  object-fit: cover;
}
.object-none {
  object-fit: none;
}`)
  })
  test('Object Position', () => {
    expect(css.render(['object-left', 'object-top-right', 'object-[position:top_left]']))
      .toBe(`.object-left {
  object-position: left;
}
.object-top-right {
  object-position: top right;
}
.object-\\[position\\:top_left\\] {
  object-position: top left;
}`)
  })
  test('Overflow', () => {
    expect(css.render(['absolute', 'relative', 'sticky'])).toBe(`.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}`)
  })
  test('Inset/Top/Right/Bottom/Left', () => {
    expect(
      css.render([
        'inset-full',
        'inset-4',
        'inset-4px',
        'inset-4rem',
        'inset-3/4',
        'inset-(--my-inset)',
        'top-full',
        'top-4',
        'right-4px',
        'left-4rem',
        'start-3/4',
        'end-(--my-inset)',
        'bottom-[calc(1rem_*_6)]'
      ])
    ).toBe(`.inset-full {
  inset: 100%;
}
.inset-4 {
  inset: 1rem;
}
.inset-4px {
  inset: 4px;
}
.inset-4rem {
  inset: 4rem;
}
.inset-3\\/4 {
  inset: 75.00%;
}
.inset-\\(--my-inset\\) {
  inset: var(--my-inset);
}
.top-full {
  top: 100%;
}
.top-4 {
  top: 1rem;
}
.right-4px {
  right: 4px;
}
.left-4rem {
  left: 4rem;
}
.start-3\\/4 {
  inset-inline-start: 75.00%;
}
.end-\\(--my-inset\\) {
  inset-inline-end: var(--my-inset);
}
.bottom-\\[calc\\(1rem_\\*_6\\)\\] {
  bottom: calc(1rem * 6);
}`)
  })
  test('Visibility', () => {
    expect(css.render(['visible', 'invisible', 'collapse'])).toBe(`.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.collapse {
  visibility: collapse;
}`)
  })
  test('Z Index', () => {
    expect(css.render(['z-1', 'z--999', 'z-auto', 'z-(--my-z-size)'])).toBe(`.z-1 {
  z-index: 1;
}
.z--999 {
  z-index: -999;
}
.z-auto {
  z-index: auto;
}
.z-\\(--my-z-size\\) {
  z-index: var(--my-z-size);
}`)
  })
})
