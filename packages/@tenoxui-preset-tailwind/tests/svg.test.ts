import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('SVG', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Fill', () => {
    const classNames = [
      'fill-rebeccapurple',
      'fill-red-500',
      'fill-red-400/40',
      'fill-#ccf654',
      'fill-#ccf654/40',
      'fill-#ccf654',
      'fill-[rgb(255_0_0_/_40%)]',
      'fill-(rgb(255_0_0))/40',
      'fill-current',
      'fill-current/40',
      'fill-blue',
      'fill-red',
      'fill-red/40',
      'fill-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.fill-rebeccapurple {
  fill: rebeccapurple;
}
.fill-red-500 {
  fill: oklch(63.7% 0.237 25.331);
}
.fill-red-400\\/40 {
  fill: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    fill: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.fill-\\#ccf654 {
  fill: #ccf654;
}
.fill-\\#ccf654\\/40 {
  fill: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    fill: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.fill-\\#ccf654 {
  fill: #ccf654;
}
.fill-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  fill: rgb(255 0 0 / 40%);
}
.fill-\\(rgb\\(255_0_0\\)\\)\\/40 {
  fill: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    fill: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.fill-current {
  fill: currentColor;
}
.fill-current\\/40 {
  fill: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    fill: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.fill-blue {
  fill: blue;
}
.fill-red {
  fill: red;
}
.fill-red\\/40 {
  fill: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    fill: color-mix(in oklab, red 40%, transparent);
  }
}
.fill-transparent {
  fill: transparent;
}`
    )
  })
  test('Stroke Color', () => {
    const classNames = [
      'stroke-rebeccapurple',
      'stroke-red-500',
      'stroke-red-400/40',
      'stroke-#ccf654',
      'stroke-#ccf654/40',
      'stroke-#ccf654',
      'stroke-[rgb(255_0_0_/_40%)]',
      'stroke-(rgb(255_0_0))/40',
      'stroke-current',
      'stroke-current/40',
      'stroke-blue',
      'stroke-red',
      'stroke-red/40',
      'stroke-transparent'
    ]
    expect(css.render(classNames)).toBe(
      `.stroke-rebeccapurple {
  stroke: rebeccapurple;
}
.stroke-red-500 {
  stroke: oklch(63.7% 0.237 25.331);
}
.stroke-red-400\\/40 {
  stroke: color-mix(in srgb, oklch(70.4% 0.191 22.216) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    stroke: color-mix(in oklab, oklch(70.4% 0.191 22.216) 40%, transparent);
  }
}
.stroke-\\#ccf654 {
  stroke: #ccf654;
}
.stroke-\\#ccf654\\/40 {
  stroke: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    stroke: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.stroke-\\#ccf654 {
  stroke: #ccf654;
}
.stroke-\\[rgb\\(255_0_0_\\/_40\\%\\)\\] {
  stroke: rgb(255 0 0 / 40%);
}
.stroke-\\(rgb\\(255_0_0\\)\\)\\/40 {
  stroke: color-mix(in srgb, rgb(255 0 0) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    stroke: color-mix(in oklab, rgb(255 0 0) 40%, transparent);
  }
}
.stroke-current {
  stroke: currentColor;
}
.stroke-current\\/40 {
  stroke: color-mix(in srgb, currentColor 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    stroke: color-mix(in oklab, currentColor 40%, transparent);
  }
}
.stroke-blue {
  stroke: blue;
}
.stroke-red {
  stroke: red;
}
.stroke-red\\/40 {
  stroke: color-mix(in srgb, red 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    stroke: color-mix(in oklab, red 40%, transparent);
  }
}
.stroke-transparent {
  stroke: transparent;
}`
    )
  })
  test('Stroke Width', () => {
    const classNames = ['stroke-4', 'stroke-4px', 'stroke-4rem']
    expect(css.render(classNames)).toBe(
      `.stroke-4 {
  stroke-width: 4;
}
.stroke-4px {
  stroke-width: 4px;
}
.stroke-4rem {
  stroke-width: 4rem;
}`
    )
  })
})
