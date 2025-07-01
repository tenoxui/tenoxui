import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Spacing', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Padding', () => {
    const classNames = [
      'p-4',
      'p-4px',
      'p-4rem',
      'p-[calc(1rem_-_10px)]',
      'px-4',
      'px-4px',
      'px-4rem',
      'px-[calc(1rem_-_10px)]',
      'py-4',
      'ps-4px',
      'pe-4rem',
      'pt-[calc(1rem_-_10px)]',
      'pt-4',
      'pr-4px',
      'pb-4rem',
      'pl-[calc(1rem_-_10px)]'
    ]
    expect(css.render(classNames)).toBe(
      `.p-4 {
  padding: 1rem;
}
.p-4px {
  padding: 4px;
}
.p-4rem {
  padding: 4rem;
}
.p-\\[calc\\(1rem_-_10px\\)\\] {
  padding: calc(1rem - 10px);
}
.px-4 {
  padding-inline: 1rem;
}
.px-4px {
  padding-inline: 4px;
}
.px-4rem {
  padding-inline: 4rem;
}
.px-\\[calc\\(1rem_-_10px\\)\\] {
  padding-inline: calc(1rem - 10px);
}
.py-4 {
  padding-block: 1rem;
}
.ps-4px {
  padding-inline-start: 4px;
}
.pe-4rem {
  padding-inline-end: 4rem;
}
.pt-\\[calc\\(1rem_-_10px\\)\\] {
  padding-top: calc(1rem - 10px);
}
.pt-4 {
  padding-top: 1rem;
}
.pr-4px {
  padding-right: 4px;
}
.pb-4rem {
  padding-bottom: 4rem;
}
.pl-\\[calc\\(1rem_-_10px\\)\\] {
  padding-left: calc(1rem - 10px);
}`
    )
  })
  test('Margin', () => {
    const classNames = [
      'm-4',
      'm-4px',
      'm-4rem',
      'm-[calc(1rem_-_10px)]',
      'mx-4',
      'mx-4px',
      'mx-4rem',
      'mx-[calc(1rem_-_10px)]',
      'my-4',
      'ms-4px',
      'me-4rem',
      'mt-[calc(1rem_-_10px)]',
      'mt-4',
      'mr-4px',
      'mb-4rem',
      'ml-[calc(1rem_-_10px)]',
      'space-x-5',
      'space-x-5px',
      'space-x-5rem',
      'space-x-5%',
      'space-y-(--hellow)',
      'space-y-[calc(30%_-_10px)]'
    ]
    expect(css.render(classNames)).toBe(
      `.m-4 {
  margin: 1rem;
}
.m-4px {
  margin: 4px;
}
.m-4rem {
  margin: 4rem;
}
.m-\\[calc\\(1rem_-_10px\\)\\] {
  margin: calc(1rem - 10px);
}
.mx-4 {
  margin-inline: 1rem;
}
.mx-4px {
  margin-inline: 4px;
}
.mx-4rem {
  margin-inline: 4rem;
}
.mx-\\[calc\\(1rem_-_10px\\)\\] {
  margin-inline: calc(1rem - 10px);
}
.my-4 {
  margin-block: 1rem;
}
.ms-4px {
  margin-inline-start: 4px;
}
.me-4rem {
  margin-inline-end: 4rem;
}
.mt-\\[calc\\(1rem_-_10px\\)\\] {
  margin-top: calc(1rem - 10px);
}
.mt-4 {
  margin-top: 1rem;
}
.mr-4px {
  margin-right: 4px;
}
.mb-4rem {
  margin-bottom: 4rem;
}
.ml-\\[calc\\(1rem_-_10px\\)\\] {
  margin-left: calc(1rem - 10px);
}
.space-x-5 > :not(:last-child) {
  --tw-space-x-reverse: 0;
  margin-inline-start: calc(1.25rem * var(--tw-space-x-reverse));
  margin-inline-end: calc(1.25rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-5px > :not(:last-child) {
  --tw-space-x-reverse: 0;
  margin-inline-start: calc(5px * var(--tw-space-x-reverse));
  margin-inline-end: calc(5px * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-5rem > :not(:last-child) {
  --tw-space-x-reverse: 0;
  margin-inline-start: calc(5rem * var(--tw-space-x-reverse));
  margin-inline-end: calc(5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-5\\% > :not(:last-child) {
  --tw-space-x-reverse: 0;
  margin-inline-start: calc(5% * var(--tw-space-x-reverse));
  margin-inline-end: calc(5% * calc(1 - var(--tw-space-x-reverse)));
}
.space-y-\\(--hellow\\) > :not(:last-child) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(var(--hellow) * var(--tw-space-y-reverse));
  margin-block-end: calc(var(--hellow) * calc(1 - var(--tw-space-y-reverse)));
}
.space-y-\\[calc\\(30\\%_-_10px\\)\\] > :not(:last-child) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(30% - 10px) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(30% - 10px) * calc(1 - var(--tw-space-y-reverse)));
}`
    )
  })
})

describe('Sizing', () => {
  let css = new TenoxUI(preset({ order: false }))

  test('Width', () => {
    const classNames = [
      'w-7/8',
      'w-10',
      'w-10rem',
      'w-md',
      'w-7xl',
      'w-screen',
      'w-full',
      'w-auto',
      'w-dvh',
      'w-lvh',
      'w-vh',
      'w-max',
      'size-50',
      'size-max',
      'size-(--my-size)',
      'size-40%',
      'size-4/5',
      'size-[calc(100%_-_72px)]'
    ]
    expect(css.render(classNames)).toBe(
      `.w-7\\/8 {
  width: 87.50%;
}
.w-10 {
  width: 2.5rem;
}
.w-10rem {
  width: 10rem;
}
.w-md {
  width: 28rem;
}
.w-7xl {
  width: 80rem;
}
.w-screen {
  width: 100vw;
}
.w-full {
  width: 100%;
}
.w-auto {
  width: auto;
}
.w-dvh {
  width: 100dvh;
}
.w-lvh {
  width: 100lvh;
}
.w-vh {
  width: 100vh;
}
.w-max {
  width: max-content;
}
.size-50 {
  width: 12.5rem;
  height: 12.5rem;
}
.size-max {
  width: max-content;
  height: max-content;
}
.size-\\(--my-size\\) {
  width: var(--my-size);
  height: var(--my-size);
}
.size-40\\% {
  width: 40%;
  height: 40%;
}
.size-4\\/5 {
  width: 80.00%;
  height: 80.00%;
}
.size-\\[calc\\(100\\%_-_72px\\)\\] {
  width: calc(100% - 72px);
  height: calc(100% - 72px);
}`
    )
  })
  test('Min Width', () => {
    const classNames = [
      'min-w-7/8',
      'min-w-7',
      'min-w-7px',
      'min-w-7rem',
      'min-w-7%',
      'min-w-7xl',
      'min-w-screen',
      'min-w-(--my-size)'
    ]
    expect(css.render(classNames)).toBe(
      `.min-w-7\\/8 {
  min-width: 87.50%;
}
.min-w-7 {
  min-width: 1.75rem;
}
.min-w-7px {
  min-width: 7px;
}
.min-w-7rem {
  min-width: 7rem;
}
.min-w-7\\% {
  min-width: 7%;
}
.min-w-7xl {
  min-width: 80rem;
}
.min-w-screen {
  min-width: 100vw;
}
.min-w-\\(--my-size\\) {
  min-width: var(--my-size);
}`
    )
  })
  test('Max Width', () => {
    const classNames = [
      'max-w-7/8',
      'max-w-7',
      'max-w-7px',
      'max-w-7rem',
      'max-w-7%',
      'max-w-7xl',
      'max-w-screen',
      'max-w-(--my-size)'
    ]
    expect(css.render(classNames)).toBe(
      `.max-w-7\\/8 {
  max-width: 87.50%;
}
.max-w-7 {
  max-width: 1.75rem;
}
.max-w-7px {
  max-width: 7px;
}
.max-w-7rem {
  max-width: 7rem;
}
.max-w-7\\% {
  max-width: 7%;
}
.max-w-7xl {
  max-width: 80rem;
}
.max-w-screen {
  max-width: 100vw;
}
.max-w-\\(--my-size\\) {
  max-width: var(--my-size);
}`
    )
  })
  test('Height', () => {
    const classNames = [
      'h-7/8',
      'h-10',
      'h-10rem',
      'h-screen',
      'h-full',
      'h-auto',
      'h-dvh',
      'h-lvh',
      'h-vh',
      'h-max'
    ]
    expect(css.render(classNames)).toBe(
      `.h-7\\/8 {
  height: 87.50%;
}
.h-10 {
  height: 2.5rem;
}
.h-10rem {
  height: 10rem;
}
.h-screen {
  height: 100vh;
}
.h-full {
  height: 100%;
}
.h-auto {
  height: auto;
}
.h-dvh {
  height: 100dvh;
}
.h-lvh {
  height: 100lvh;
}
.h-vh {
  height: 100vh;
}
.h-max {
  height: max-content;
}`
    )
  })
  test('Min Height', () => {
    const classNames = [
      'min-h-7/8',
      'min-h-7',
      'min-h-7px',
      'min-h-7rem',
      'min-h-7%',
      'min-h-screen',
      'min-h-(--my-size)'
    ]
    expect(css.render(classNames)).toBe(
      `.min-h-7\\/8 {
  min-height: 87.50%;
}
.min-h-7 {
  min-height: 1.75rem;
}
.min-h-7px {
  min-height: 7px;
}
.min-h-7rem {
  min-height: 7rem;
}
.min-h-7\\% {
  min-height: 7%;
}
.min-h-screen {
  min-height: 100vh;
}
.min-h-\\(--my-size\\) {
  min-height: var(--my-size);
}`
    )
  })
  test('Max Height', () => {
    const classNames = [
      'max-h-7/8',
      'max-h-7',
      'max-h-7px',
      'max-h-7rem',
      'max-h-7%',
      'max-h-screen',
      'max-h-(--my-size)'
    ]
    expect(css.render(classNames)).toBe(
      `.max-h-7\\/8 {
  max-height: 87.50%;
}
.max-h-7 {
  max-height: 1.75rem;
}
.max-h-7px {
  max-height: 7px;
}
.max-h-7rem {
  max-height: 7rem;
}
.max-h-7\\% {
  max-height: 7%;
}
.max-h-screen {
  max-height: 100vh;
}
.max-h-\\(--my-size\\) {
  max-height: var(--my-size);
}`
    )
  })
})
