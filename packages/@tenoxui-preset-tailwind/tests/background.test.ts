import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Bsckground', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Background Attachment Utilities', () => {
    const classNames = ['bg-fixed', 'bg-local', 'bg-scroll']
    expect(css.render(classNames)).toBe(
      `.bg-fixed {
  background-attachment: fixed;
}
.bg-local {
  background-attachment: local;
}
.bg-scroll {
  background-attachment: scroll;
}`
    )
  })
  test('Background Clip Utilities', () => {
    const classNames = ['bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text']
    expect(css.render(classNames)).toBe(
      `.bg-clip-border {
  background-clip: border-box;
}
.bg-clip-padding {
  background-clip: padding-box;
}
.bg-clip-content {
  background-clip: content-box;
}
.bg-clip-text {
  background-clip: text;
}`
    )
  })

  test('Background Color', () => {
    const classNames = [
      'bg-rebeccapurple',
      'bg-red-500',
      'bg-red-400/40',
      'bg-#ccf654',
      'bg-#ccf654/40',
      'bg-#ccf654',
      'bg-[rgb(255_0_0_/_40%)]',
      'bg-(rgb(255_0_0))/40',
      'bg-current',
      'bg-current/40',
      'bg-blue',
      'bg-red',
      'bg-red/40',
      'bg-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-rebeccapurple {
  background-color: rebeccapurple;
}
.bg-red-500 {
  background-color: oklch(63.7% 0.237 25.331);
}
.bg-red-400\\/40 {
  background-color: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.bg-\\#ccf654 {
  background-color: #ccf654;
}
.bg-\\#ccf654\\/40 {
  background-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.bg-\\#ccf654 {
  background-color: #ccf654;
}
.bg-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  background-color: rgb(255 0 0 / 40%);
}
.bg-\\(rgb\\(255_0_0\\)\\)\\/40 {
  background-color: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.bg-current {
  background-color: currentColor;
}
.bg-current\\/40 {
  background-color: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.bg-blue {
  background-color: blue;
}
.bg-red {
  background-color: red;
}
.bg-red\\/40 {
  background-color: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, red 40%, transparent);
  }
}
.bg-transparent {
  background-color: transparent;
}`
    )
  })
  test('Background Image', () => {
    const classNames = [
      'bg-[image:url(/img/banner.png)]',
      'bg-linear',
      'bg-linear-to-b/increasing',
      'bg-linear-270',
      'bg-linear-60deg',
      'bg-linear-60deg/decreasing',
      'bg-linear-0.5turn',

      'bg-radial',
      'bg-radial/srgb',
      'bg-radial/increasing',
      'bg-conic',
      'bg-conic/oklab',
      'bg-conic-270',
      'bg-conic--270',
      'bg-conic--270/increasing',
      'from-red',
      'from-red-500',
      'from-#ccf654',
      'from-red/40',
      'from-red-500/40',
      'from-#ccf654/40',
      'from-60',
      'from-270%',
      'via-red',
      'via-red-500',
      'via-#ccf654',
      'via-red/40',
      'via-red-500/40',
      'via-#ccf654/40',
      'via-60',
      'via-270%',
      'to-red',
      'to-red-500',
      'to-#ccf654',
      'to-red/40',
      'to-red-500/40',
      'to-#ccf654/40',
      'to-60',
      'to-270%'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-\\[image\\:url\\(\\/img\\/banner\\.png\\)\\] {
  background-image: url(/img/banner.png);
}
.bg-linear {
  background: linear;
}
.bg-linear-to-b\\/increasing {
  --tw-gradient-position: to bottom;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: to bottom in oklch increasing hue;
  }
  background-image: linear-gradient(var(--tw-gradient-stops));
}
.bg-linear-270 {
  --tw-gradient-position: 270deg;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: 270deg in oklab;
  }
  background-image: linear-gradient(var(--tw-gradient-stops));
}
.bg-linear-60deg {
  --tw-gradient-position: 60deg;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: 60deg in oklab;
  }
  background-image: linear-gradient(var(--tw-gradient-stops));
}
.bg-linear-60deg\\/decreasing {
  --tw-gradient-position: 60deg;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: 60deg in oklch decreasing hue;
  }
  background-image: linear-gradient(var(--tw-gradient-stops));
}
.bg-linear-0\\.5turn {
  --tw-gradient-position: 0.5turn;
  @supports (background-image: linear-gradient(in lab, red, red)) {
    --tw-gradient-position: 0.5turn in oklab;
  }
  background-image: linear-gradient(var(--tw-gradient-stops));
}
.bg-radial {
  --tw-gradient-position: in oklab;
  background-image: radial-gradient(var(--tw-gradient-stops));
}
.bg-radial\\/srgb {
  --tw-gradient-position: in srgb;
  background-image: radial-gradient(var(--tw-gradient-stops));
}
.bg-radial\\/increasing {
  --tw-gradient-position: in oklch increasing hue;
  background-image: radial-gradient(var(--tw-gradient-stops));
}
.bg-conic {
  --tw-gradient-position: in oklab;
  background-image: conic-gradient(var(--tw-gradient-stops));
}
.bg-conic\\/oklab {
  --tw-gradient-position: in oklab;
  background-image: conic-gradient(var(--tw-gradient-stops));
}
.bg-conic-270 {
  --tw-gradient-position: from 270deg in oklab;
  background-image: conic-gradient(var(--tw-gradient-stops));
}
.bg-conic--270 {
  --tw-gradient-position: from -270deg in oklab;
  background-image: conic-gradient(var(--tw-gradient-stops));
}
.bg-conic--270\\/increasing {
  --tw-gradient-position: from -270deg in oklch increasing hue;
  background-image: conic-gradient(var(--tw-gradient-stops));
}
.from-red {
  --tw-gradient-from: red;
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-red-500 {
  --tw-gradient-from: oklch(63.7% 0.237 25.331);
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-\\#ccf654 {
  --tw-gradient-from: #ccf654;
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-red\\/40 {
  --tw-gradient-from: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-from: color-mix(in oklab, red 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-red-500\\/40 {
  --tw-gradient-from: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-from: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-\\#ccf654\\/40 {
  --tw-gradient-from: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-from: color-mix(in oklab, #ccf654 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.from-60 {
  --tw-gradient-from-position: 60%;
}
.from-270\\% {
  --tw-gradient-from-position: 270%;
}
.via-red {
  --tw-gradient-via: red;
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-red-500 {
  --tw-gradient-via: oklch(63.7% 0.237 25.331);
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-\\#ccf654 {
  --tw-gradient-via: #ccf654;
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-red\\/40 {
  --tw-gradient-via: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-via: color-mix(in oklab, red 40%, transparent);
  }
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-red-500\\/40 {
  --tw-gradient-via: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-via: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-\\#ccf654\\/40 {
  --tw-gradient-via: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-via: color-mix(in oklab, #ccf654 40%, transparent);
  }
  --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-via-stops);
}
.via-60 {
  --tw-gradient-via-position: 60%;
}
.via-270\\% {
  --tw-gradient-via-position: 270%;
}
.to-red {
  --tw-gradient-to: red;
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-red-500 {
  --tw-gradient-to: oklch(63.7% 0.237 25.331);
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-\\#ccf654 {
  --tw-gradient-to: #ccf654;
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-red\\/40 {
  --tw-gradient-to: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-to: color-mix(in oklab, red 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-red-500\\/40 {
  --tw-gradient-to: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-to: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-\\#ccf654\\/40 {
  --tw-gradient-to: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-gradient-to: color-mix(in oklab, #ccf654 40%, transparent);
  }
  --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
}
.to-60 {
  --tw-gradient-to-position: 60%;
}
.to-270\\% {
  --tw-gradient-to-position: 270%;
}`
    )
  })
  test('Background Position Utilities', () => {
    const classNames = [
      'bg-top-left',
      'bg-top',
      'bg-top-right',
      'bg-left',
      'bg-center',
      'bg-right',
      'bg-bottom-left',
      'bg-bottom',
      'bg-bottom-right'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-top-left {
  background-position: top left;
}
.bg-top {
  background-position: top;
}
.bg-top-right {
  background-position: top right;
}
.bg-left {
  background-position: left;
}
.bg-center {
  background-position: center;
}
.bg-right {
  background-position: right;
}
.bg-bottom-left {
  background-position: bottom left;
}
.bg-bottom {
  background-position: bottom;
}
.bg-bottom-right {
  background-position: bottom right;
}`
    )
  })
  test('Background Repeat Utilities', () => {
    const classNames = [
      'bg-repeat',
      'bg-repeat-x',
      'bg-repeat-y',
      'bg-repeat-space',
      'bg-repeat-round',
      'bg-no-repeat'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-repeat {
  background-repeat: repeat;
}
.bg-repeat-x {
  background-repeat: repeat-x;
}
.bg-repeat-y {
  background-repeat: repeat-y;
}
.bg-repeat-space {
  background-repeat: space;
}
.bg-repeat-round {
  background-repeat: round;
}
.bg-no-repeat {
  background-repeat: no-repeat;
}`
    )
  })
  test('Background Size Utilities', () => {
    const classNames = [
      'bg-auto',
      'bg-cover',
      'bg-contain',
      'bg-[size:10px_10px]',
      'bg-size-[10px_10px]'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-auto {
  background-size: auto;
}
.bg-cover {
  background-size: cover;
}
.bg-contain {
  background-size: contain;
}
.bg-\\[size\\:10px_10px\\] {
  background-size: 10px 10px;
}
.bg-size-\\[10px_10px\\] {
  background-size: 10px 10px;
}`
    )
  })
})
