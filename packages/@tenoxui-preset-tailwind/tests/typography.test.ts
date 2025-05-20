import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Typography', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Font Family', () => {
    const classNames = [
      'font-sans',
      'font-serif',
      'font-mono',
      'font-(family-name:Inter,_sans-serif)',
      'font-(family:Inter,_sans-serif)'
    ]
    expect(css.render(classNames)).toBe(
      `.font-sans {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.font-serif {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}
.font-mono {
  font-family: FMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.font-\\(family-name\\:Inter\\,_sans-serif\\) {
  font-family: Inter, sans-serif;
}
.font-\\(family\\:Inter\\,_sans-serif\\) {
  font-family: Inter, sans-serif;
}`
    )
  })
  test('Font Size', () => {
    const classNames = [
      'text-xs',
      'text-xs/7',
      'text-4',
      'text-4/7',
      'text-1.6rem',
      'text-1.6rem/7',
      'text-1.6rem/[1.5]',
      'text-(length:inherit)',
      'text-(length:--my-font-size)'
    ]

    expect(css.render(classNames)).toBe(
      `.text-xs {
  font-size: 0.75rem;
  line-height: calc(1 / 0.75);
}
.text-xs\\/7 {
  font-size: 0.75rem;
  line-height: 1.75rem;
}
.text-4 {
  font-size: 1rem;
}
.text-4\\/7 {
  font-size: 1rem;
  line-height: 1.75rem;
}
.text-1\\.6rem {
  font-size: 1.6rem;
}
.text-1\\.6rem\\/7 {
  font-size: 1.6rem;
  line-height: 1.75rem;
}
.text-1\\.6rem\\/\\[1\\.5\\] {
  font-size: 1.6rem;
  line-height: 1.5;
}
.text-\\(length\\:inherit\\) {
  font-size: inherit;
}
.text-\\(length\\:--my-font-size\\) {
  font-size: var(--my-font-size);
}`
    )
  })
  test('Font Smoothing', () => {
    const classNames = ['antialiased', 'subpixel-antialiased']
    expect(css.render(classNames)).toBe(
      `.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.subpixel-antialiased {
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}`
    )
  })
  test('Font Style', () => {
    const classNames = ['italic', 'not-italic']
    expect(css.render(classNames)).toBe(
      `.italic {
  font-style: italic;
}
.not-italic {
  font-style: normal;
}`
    )
  })
  test('Font Weight', () => {
    const classNames = ['font-medium', 'font-600', 'font-bold', 'font-(weight:--my-font-weight)']
    expect(css.render(classNames)).toBe(
      `.font-medium {
  font-weight: 500;
}
.font-600 {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.font-\\(weight\\:--my-font-weight\\) {
  font-weight: var(--my-font-weight);
}`
    )
  })
  test('Font Stretch', () => {
    const classNames = [
      'font-extra-condensed',
      'font-50%',
      'font-(stretch:normal)',
      'font-stretch-extra-condensed',
      'font-stretch-50%',
      'font-stretch-normal'
    ]
    expect(css.render(classNames)).toBe(
      `.font-extra-condensed {
  font-stretch: extra-condensed;
}
.font-50\\% {
  font-stretch: 50%;
}
.font-\\(stretch\\:normal\\) {
  font-stretch: normal;
}
.font-stretch-extra-condensed {
  font-stretch: extra-condensed;
}
.font-stretch-50\\% {
  font-stretch: 50%;
}
.font-stretch-normal {
  font-stretch: normal;
}`
    )
  })
  test('Font Variant Numeric', () => {
    const classNames = [
      'normal-nums',
      'ordinal',
      'slashed-zero',
      'lining-nums',
      'oldstyle-nums',
      'proportional-nums',
      'tabular-nums',
      'diagonal-fractions',
      'stacked-fractions'
    ]
    expect(css.render(classNames)).toBe(
      `.normal-nums {
  font-variant-numeric: normal;
}
.ordinal {
  font-variant-numeric: ordinal;
}
.slashed-zero {
  font-variant-numeric: slashed-zero;
}
.lining-nums {
  font-variant-numeric: lining-nums;
}
.oldstyle-nums {
  font-variant-numeric: oldstyle-nums;
}
.proportional-nums {
  font-variant-numeric: proportional-nums;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
.diagonal-fractions {
  font-variant-numeric: diagonal-fractions;
}
.stacked-fractions {
  font-variant-numeric: stacked-fractions;
}`
    )
  })
  test('Letter Spacing', () => {
    const classNames = [
      'tracking-wide',
      'tracking-wider',
      'tracking-tighter',
      'tracking-0.025rem',
      'tracking--0.025rem',
      'tracking-(--my-size)'
    ]
    expect(css.render(classNames)).toBe(
      `.tracking-wide {
  letter-spacing: 0.025em;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.tracking-tighter {
  letter-spacing: -0.05em;
}
.tracking-0\\.025rem {
  letter-spacing: 0.025rem;
}
.tracking--0\\.025rem {
  letter-spacing: -0.025rem;
}
.tracking-\\(--my-size\\) {
  letter-spacing: var(--my-size);
}`
    )
  })
  test('Line Clamp', () => {
    const classNames = ['line-clamp-4', 'line-clamp-none']
    expect(css.render(classNames)).toBe(
      `.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.line-clamp-none {
  overflow: visible;
  display: block;
  -webkit-box-orient: horizontal;
  -webkit-line-clamp: unset;
}`
    )
  })
  test('Line Height', () => {
    const classNames = [
      'text-sm/7',
      'text-sm/loose',
      'text-sm/tight',
      'text-sm/1.5rem',
      'text-sm/[1.6]',
      'leading-7',
      'leading-loose',
      'leading-none',
      'leading-tight',
      'leading-1.5rem',
      'leading-[1.6]'
    ]
    expect(css.render(classNames)).toBe(
      `.text-sm\\/7 {
  font-size: 0.875rem;
  line-height: 1.75rem;
}
.text-sm\\/loose {
  font-size: 0.875rem;
  line-height: 2;
}
.text-sm\\/tight {
  font-size: 0.875rem;
  line-height: 1.25;
}
.text-sm\\/1\\.5rem {
  font-size: 0.875rem;
  line-height: calc(1.25 / 0.875);
}
.text-sm\\/\\[1\\.6\\] {
  font-size: 0.875rem;
  line-height: 1.6;
}
.leading-7 {
  line-height: 1.75rem;
}
.leading-loose {
  line-height: 2;
}
.leading-none {
  line-height: 1;
}
.leading-tight {
  line-height: 1.25;
}
.leading-1\\.5rem {
  line-height: 1.5rem;
}
.leading-\\[1\\.6\\] {
  line-height: 1.6;
}`
    )
  })
  test('List Style Image', () => {
    const classNames = [
      'list-image-[url(/img/banner.png)]',
      'list-image-(--my-image)',
      'list-image-none'
    ]
    expect(css.render(classNames)).toBe(
      `.list-image-\\[url\\(\\/img\\/banner\\.png\\)\\] {
  list-style-image: url(/img/banner.png);
}
.list-image-\\(--my-image\\) {
  list-style-image: var(--my-image);
}
.list-image-none {
  list-style-image: none;
}`
    )
  })
  test('List Style Position', () => {
    const classNames = ['list-inside', 'list-outside']
    expect(css.render(classNames)).toBe(
      `.list-inside {
  list-style-position: inside;
}
.list-outside {
  list-style-position: outside;
}`
    )
  })
  test('List Style Type', () => {
    const classNames = ['list-disc', 'list-none', 'list-decimal', 'list-(--my-marker)']
    expect(css.render(classNames)).toBe(
      `.list-disc {
  list-style-type: disc;
}
.list-none {
  list-style-type: none;
}
.list-decimal {
  list-style-type: decimal;
}
.list-\\(--my-marker\\) {
  list-style-type: var(--my-marker);
}`
    )
  })
  test('Tetx Align', () => {
    const classNames = ['text-left', 'text-right', 'text-start', 'text-justify']
    expect(css.render(classNames)).toBe(
      `.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.text-start {
  text-align: start;
}
.text-justify {
  text-align: justify;
}`
    )
  })
  test('Color', () => {
    const classNames = [
      'text-rebeccapurple',
      'text-red-500',
      'text-red-400/40',
      'text-#ccf654',
      'text-#ccf654/40',
      'text-#ccf654',
      'text-[rgb(255_0_0_/_40%)]',
      'text-(rgb(255_0_0))/40',
      'text-current',
      'text-current/40',
      'text-blue',
      'text-red',
      'text-red/40',
      'text-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.text-rebeccapurple {
  color: rebeccapurple;
}
.text-red-500 {
  color: oklch(63.7% 0.237 25.331);
}
.text-red-400\\/40 {
  color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.text-\\#ccf654 {
  color: #ccf654;
}
.text-\\#ccf654\\/40 {
  color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.text-\\#ccf654 {
  color: #ccf654;
}
.text-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  color: rgb(255 0 0 / 40%);
}
.text-\\(rgb\\(255_0_0\\)\\)\\/40 {
  color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.text-current {
  color: currentColor;
}
.text-current\\/40 {
  color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.text-blue {
  color: blue;
}
.text-red {
  color: red;
}
.text-red\\/40 {
  color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    color: color-mix(in oklab, red 40%, transparent);
  }
}
.text-transparent {
  color: transparent;
}`
    )
  })
  test('Text Decoration Line', () => {
    const classNames = ['underline', 'overline', 'line-through', 'no-underline']
    expect(css.render(classNames)).toBe(
      `.underline {
  text-decoration-line: underline;
}
.overline {
  text-decoration-line: overline;
}
.line-through {
  text-decoration-line: line-through;
}
.no-underline {
  text-decoration-line: none;
}`
    )
  })
  test('Text Decoration Color', () => {
    const classNames = [
      'decoration-rebeccapurple',
      'decoration-red-500',
      'decoration-red-400/40',
      'decoration-#ccf654',
      'decoration-#ccf654/40',
      'decoration-#ccf654',
      'decoration-[rgb(255_0_0_/_40%)]',
      'decoration-(rgb(255_0_0))/40',
      'decoration-current',
      'decoration-current/40',
      'decoration-blue',
      'decoration-red',
      'decoration-red/40',
      'decoration-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.decoration-rebeccapurple {
  text-decoration-color: rebeccapurple;
}
.decoration-red-500 {
  text-decoration-color: oklch(63.7% 0.237 25.331);
}
.decoration-red-400\\/40 {
  text-decoration-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    text-decoration-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.decoration-\\#ccf654 {
  text-decoration-color: #ccf654;
}
.decoration-\\#ccf654\\/40 {
  text-decoration-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    text-decoration-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.decoration-\\#ccf654 {
  text-decoration-color: #ccf654;
}
.decoration-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  text-decoration-color: rgb(255 0 0 / 40%);
}
.decoration-\\(rgb\\(255_0_0\\)\\)\\/40 {
  text-decoration-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    text-decoration-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.decoration-current {
  text-decoration-color: currentColor;
}
.decoration-current\\/40 {
  text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    text-decoration-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.decoration-blue {
  text-decoration-color: blue;
}
.decoration-red {
  text-decoration-color: red;
}
.decoration-red\\/40 {
  text-decoration-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    text-decoration-color: color-mix(in oklab, red 40%, transparent);
  }
}
.decoration-transparent {
  text-decoration-color: transparent;
}`
    )
  })
  test('Text Decoration Thickness', () => {
    const classNames = [
      'decoration-5',
      'decoration-5px',
      'decoration-5rem',
      'decoration-from-font',
      'decoration-auto',
      'decoration-(length:--my-size)',
      'decoration-[length:10rem]'
    ]
    expect(css.render(classNames)).toBe(
      `.decoration-5 {
  text-decoration-thickness: 5px;
}
.decoration-5px {
  text-decoration-thickness: 5px;
}
.decoration-5rem {
  text-decoration-thickness: 5rem;
}
.decoration-from-font {
  text-decoration-thickness: from-font;
}
.decoration-auto {
  text-decoration-thickness: auto;
}
.decoration-\\(length\\:--my-size\\) {
  text-decoration-thickness: var(--my-size);
}
.decoration-\\[length\\:10rem\\] {
  text-decoration-thickness: 10rem;
}`
    )
  })
  test('Text Decoration Offset', () => {
    const classNames = [
      'underline-offset-4',
      'underline-offset--4',
      'underline-offset--4px',
      'underline-offset--4rem',
      'underline-offset-auto'
    ]
    expect(css.render(classNames)).toBe(
      `.underline-offset-4 {
  text-underline-offset: 4px;
}
.underline-offset--4 {
  text-underline-offset: -4px;
}
.underline-offset--4px {
  text-underline-offset: -4px;
}
.underline-offset--4rem {
  text-underline-offset: -4rem;
}
.underline-offset-auto {
  text-underline-offset: auto;
}`
    )
  })
  test('Text Transform', () => {
    const classNames = ['uppercase', 'lowercase', 'capitalize', 'normal-case']
    expect(css.render(classNames)).toBe(
      `.uppercase {
  text-transform: uppercase;
}
.lowercase {
  text-transform: lowercase;
}
.capitalize {
  text-transform: capitalize;
}
.normal-case {
  text-transform: none;
}`
    )
  })
  test('Text Overflow', () => {
    const classNames = ['truncate', 'text-ellipsis', 'text-clip']
    expect(css.render(classNames)).toBe(
      `.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-ellipsis {
  text-overflow: ellipsis;
}
.text-clip {
  text-overflow: clip;
}`
    )
  })
  test('Text Wrap', () => {
    const classNames = ['text-wrap', 'text-nowrap', 'text-balance', 'text-pretty']
    expect(css.render(classNames)).toBe(
      `.text-wrap {
  text-wrap: wrap;
}
.text-nowrap {
  text-wrap: nowrap;
}
.text-balance {
  text-wrap: balance;
}
.text-pretty {
  text-wrap: pretty;
}`
    )
  })
  test('Text Indent', () => {
    const classNames = [
      'indent-4',
      'indent-4px',
      'indent-4rem',
      'indent--4',
      'indent--4px',
      'indent--4rem'
    ]
    expect(css.render(classNames)).toBe(
      `.indent-4 {
  text-indent: 1rem;
}
.indent-4px {
  text-indent: 4px;
}
.indent-4rem {
  text-indent: 4rem;
}
.indent--4 {
  text-indent: -1rem;
}
.indent--4px {
  text-indent: -4px;
}
.indent--4rem {
  text-indent: -4rem;
}`
    )
  })
  test('Vertical Align', () => {
    const classNames = [
      'align-baseline',
      'align-top',
      'align-middle',
      'align-bottom',
      'align-text-top',
      'align-text-bottom',
      'align-sub',
      'align-super'
    ]
    expect(css.render(classNames)).toBe(
      `.align-baseline {
  vertical-align: baseline;
}
.align-top {
  vertical-align: top;
}
.align-middle {
  vertical-align: middle;
}
.align-bottom {
  vertical-align: bottom;
}
.align-text-top {
  vertical-align: text-top;
}
.align-text-bottom {
  vertical-align: text-bottom;
}
.align-sub {
  vertical-align: sub;
}
.align-super {
  vertical-align: super;
}`
    )
  })
  test('White Space', () => {
    const classNames = [
      'whitespace-normal',
      'whitespace-nowrap',
      'whitespace-pre',
      'whitespace-pre-line',
      'whitespace-pre-wrap',
      'whitespace-break-spaces'
    ]
    expect(css.render(classNames)).toBe(
      `.whitespace-normal {
  white-space: normal;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre {
  white-space: pre;
}
.whitespace-pre-line {
  white-space: pre-line;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.whitespace-break-spaces {
  white-space: break-spaces;
}`
    )
  })
  test('Word Break', () => {
    const classNames = ['break-normal', 'break-all', 'break-keep']
    expect(css.render(classNames)).toBe(
      `.break-normal {
  word-break: normal;
}
.break-all {
  word-break: break-all;
}
.break-keep {
  word-break: keep-all;
}`
    )
  })
  test('Overflow Wrap', () => {
    const classNames = ['wrap-break-word', 'wrap-anywhere', 'wrap-normal']
    expect(css.render(classNames)).toBe(
      `.wrap-break-word {
  overflow-wrap: break-word;
}
.wrap-anywhere {
  overflow-wrap: anywhere;
}
.wrap-normal {
  overflow-wrap: normal;
}`
    )
  })
  test('Hyphens', () => {
    const classNames = ['hyphens-none', 'hyphens-manual', 'hyphens-auto']
    expect(css.render(classNames)).toBe(
      `.hyphens-none {
  hyphens: none;
}
.hyphens-manual {
  hyphens: manual;
}
.hyphens-auto {
  hyphens: auto;
}`
    )
  })
  test('Content', () => {
    const classNames = ['before:content-["hello_world!"]', 'after:content-["hello\\_world!"]']
    expect(css.render(classNames)).toBe(
      `.before\\:content-\\[\\"hello_world\\!\\"\\]::before {
  content: "hello world!";
}
.after\\:content-\\[\\"hello\\_world\\!\\"\\]::after {
  content: "hello_world!";
}`
    )
  })
})
