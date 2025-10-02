import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Effect', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Box Shadow', () => {
    const classNames = [
      // sizes
      'shadow',
      'shadow-xl',
      'shadow-[0_35px_35px_rgba(0,0,0,0.25)]',
      'inset-shadow-xs',
      'inset-shadow-2xs',
      'ring',
      'ring-2',
      'inset-ring-2',
      // colors
      'shadow-red',
      'shadow-red-500',
      'shadow-red-500/40',
      'inset-shadow-amber-500/40',
      'shadow-#ccf654/40',
      'ring-red',
      'ring-red-500',
      'ring-red-500/40',
      'inset-ring-red-500/40'
    ]
    expect(css.render(classNames)).toBe(
      `.shadow {
  --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.shadow-\\[0_35px_35px_rgba\\(0\\,0\\,0\\,0\\.25\\)\\] {
  --tw-shadow: 0 35px 35px rgba(0,0,0,0.25);
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.inset-shadow-xs {
  --tw-inset-shadow: inset 0 1px 1px var(--tw-inset-shadow-color, rgb(0 0 0 / 0.05));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.inset-shadow-2xs {
  --tw-inset-shadow: inset 0 1px var(--tw-inset-shadow-color, rgb(0 0 0 / 0.05));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.ring {
  --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.ring-2 {
  --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.inset-ring-2 {
  --tw-inset-ring-shadow: inset 0 0 0 2px var(--tw-inset-ring-color, currentcolor);
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
.shadow-red {
  --tw-shadow-color: red;
}
.shadow-red-500 {
  --tw-shadow-color: oklch(63.7% 0.237 25.331);
}
.shadow-red-500\\/40 {
  --tw-shadow-color: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-shadow-color: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
}
.inset-shadow-amber-500\\/40 {
  --tw-inset-shadow-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-inset-shadow-color: color-mix(in oklab, oklch(76.9% 0.188 70.08) 40%, transparent);
  }
}
.shadow-\\#ccf654\\/40 {
  --tw-shadow-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-shadow-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}
.ring-red {
  --tw-ring-color: red;
}
.ring-red-500 {
  --tw-ring-color: oklch(63.7% 0.237 25.331);
}
.ring-red-500\\/40 {
  --tw-ring-color: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-ring-color: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
}
.inset-ring-red-500\\/40 {
  --tw-inset-ring-color: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-inset-ring-color: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
}`
    )
  })
  test('Text Shadow', () => {
    const classNames = [
      'text-shadow-sm',
      'text-shadow-2xs',
      'text-shadow-red-500',
      'text-shadow-red-500/40',
      'text-shadow-#ccf654',
      'text-shadow-#ccf654/40'
    ]

    expect(css.render(classNames)).toBe(
      `.text-shadow-sm {
  text-shadow: 0px 1px 0px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075)), 0px 1px 1px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075)), 0px 2px 2px var(--tw-text-shadow-color, rgb(0 0 0 / 0.075));
}
.text-shadow-2xs {
  text-shadow: 0px 1px 0px var(--tw-text-shadow-color, rgb(0 0 0 / 0.15));
}
.text-shadow-red-500 {
  --tw-text-shadow-color: oklch(63.7% 0.237 25.331);
}
.text-shadow-red-500\\/40 {
  --tw-text-shadow-color: color-mix(in srgb, oklch(63.7% 0.237 25.331) 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-text-shadow-color: color-mix(in oklab, oklch(63.7% 0.237 25.331) 40%, transparent);
  }
}
.text-shadow-\\#ccf654 {
  --tw-text-shadow-color: #ccf654;
}
.text-shadow-\\#ccf654\\/40 {
  --tw-text-shadow-color: color-mix(in srgb, #ccf654 40%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    --tw-text-shadow-color: color-mix(in oklab, #ccf654 40%, transparent);
  }
}`
    )
  })
  test('Mix Blend Mode Utilities', () => {
    const classNames = [
      'mix-blend-normal',
      'mix-blend-multiply',
      'mix-blend-screen',
      'mix-blend-overlay',
      'mix-blend-darken',
      'mix-blend-lighten',
      'mix-blend-color-dodge'
    ]
    expect(css.render(classNames)).toBe(
      `.mix-blend-normal {
  mix-blend-mode: normal;
}
.mix-blend-multiply {
  mix-blend-mode: multiply;
}
.mix-blend-screen {
  mix-blend-mode: screen;
}
.mix-blend-overlay {
  mix-blend-mode: overlay;
}
.mix-blend-darken {
  mix-blend-mode: darken;
}
.mix-blend-lighten {
  mix-blend-mode: lighten;
}
.mix-blend-color-dodge {
  mix-blend-mode: color-dodge;
}`
    )
  })
  test('Background Blend Mode Utilities', () => {
    const classNames = [
      'bg-blend-normal',
      'bg-blend-multiply',
      'bg-blend-screen',
      'bg-blend-overlay',
      'bg-blend-darken',
      'bg-blend-lighten',
      'bg-blend-color-dodge',
      'bg-blend-color-burn'
    ]
    expect(css.render(classNames)).toBe(
      `.bg-blend-normal {
  background-blend-mode: normal;
}
.bg-blend-multiply {
  background-blend-mode: multiply;
}
.bg-blend-screen {
  background-blend-mode: screen;
}
.bg-blend-overlay {
  background-blend-mode: overlay;
}
.bg-blend-darken {
  background-blend-mode: darken;
}
.bg-blend-lighten {
  background-blend-mode: lighten;
}
.bg-blend-color-dodge {
  background-blend-mode: color-dodge;
}
.bg-blend-color-burn {
  background-blend-mode: color-burn;
}`
    )
  })
})
