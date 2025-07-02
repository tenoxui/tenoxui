import { describe, test, expect } from 'vitest'
import { TenoxUI } from 'tenoxui'
import { preset } from '../src/index.ts'

describe('Flexbox and Grid', () => {
  let css = new TenoxUI(preset({ order: false }))
  test('Flex Basis', () => {
    expect(
      css.render([
        'basis-1/4',
        'basis-full',
        'basis-5xl',
        'basis-30',
        'basis-30px',
        'basis-30%',
        'basis-30rem'
      ])
    ).toBe(
      `.basis-1\\/4 {
  flex-basis: 25%;
}
.basis-full {
  flex-basis: 100%;
}
.basis-5xl {
  flex-basis: 64rem;
}
.basis-30 {
  flex-basis: 7.5rem;
}
.basis-30px {
  flex-basis: 30px;
}
.basis-30\\% {
  flex-basis: 30%;
}
.basis-30rem {
  flex-basis: 30rem;
}`
    )
  })
  test('Flex Direction', () => {
    expect(css.render(['flex-col', 'flex-row', 'flex-col-reverse'])).toBe(
      `.flex-col {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}
.flex-col-reverse {
  flex-direction: column-reverse;
}`
    )
  })
  test('Flex Wrap', () => {
    expect(css.render(['flex-nowrap', 'flex-wrap', 'flex-wrap-reverse'])).toBe(
      `.flex-nowrap {
  flex-wrap: nowrap;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-wrap-reverse {
  flex-wrap: wrap-reverse;
}`
    )
  })
  test('Flex', () => {
    expect(css.render(['flex-1', 'flex-3/4', 'flex-auto', 'flex-initial', 'flex-none'])).toBe(
      `.flex-1 {
  flex: 1;
}
.flex-3\\/4 {
  flex: 75%;
}
.flex-auto {
  flex: 1 1 auto;
}
.flex-initial {
  flex: 0 1 auto;
}
.flex-none {
  flex: none;
}`
    )
  })
  test('Flex Grow', () => {
    expect(css.render(['grow', 'grow-4'])).toBe(
      `.grow {
  flex-grow: 1;
}
.grow-4 {
  flex-grow: 4;
}`
    )
  })
  test('Flex Shrink', () => {
    expect(css.render(['shrink', 'shrink-4'])).toBe(
      `.shrink {
  flex-shrink: 1;
}
.shrink-4 {
  flex-shrink: 4;
}`
    )
  })
  test('Order', () => {
    const classNames = ['order-4', 'order--5', 'order-first', 'order-last', 'order-none']
    expect(css.render(classNames)).toBe(
      `.order-4 {
  order: 4;
}
.order--5 {
  order: -5;
}
.order-first {
  order: calc(-infinity);
}
.order-last {
  order: calc(infinity);
}
.order-none {
  order: 0;
}`
    )
  })
  test('Grid Template Columns', () => {
    const classNames = [
      'grid-cols-none',
      'grid-cols-4',
      'grid-cols-[200px_minmax(900px,_1fr)_100px]'
    ]
    expect(css.render(classNames)).toBe(
      `.grid-cols-none {
  grid-template-columns: none;
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid-cols-\\[200px_minmax\\(900px\\,_1fr\\)_100px\\] {
  grid-template-columns: 200px minmax(900px, 1fr) 100px;
}`
    )
  })
  test('Grid Column', () => {
    const classNames = [
      'col-span-full',
      'col-span-3',
      'col-start-3',
      'col-start--3',
      'col-start-auto',
      'col-end-5',
      'col-auto',
      'col-6'
    ]
    expect(css.render(classNames)).toBe(
      `.col-span-full {
  grid-column: 1 / -1;
}
.col-span-3 {
  grid-column: span 3 / span 3;
}
.col-start-3 {
  grid-column-start: 3;
}
.col-start--3 {
  grid-column-start: -3;
}
.col-start-auto {
  grid-column-start: auto;
}
.col-end-5 {
  grid-column-end: 5;
}
.col-auto {
  grid-column: auto;
}
.col-6 {
  grid-column: 6;
}`
    )
  })
  test('Grid Template Rows', () => {
    const classNames = [
      'grid-rows-none',
      'grid-rows-4',
      'grid-rows-[200px_minmax(900px,_1fr)_100px]'
    ]
    expect(css.render(classNames)).toBe(
      `.grid-rows-none {
  grid-template-rows: none;
}
.grid-rows-4 {
  grid-template-rows: repeat(4, minmax(0, 1fr));
}
.grid-rows-\\[200px_minmax\\(900px\\,_1fr\\)_100px\\] {
  grid-template-rows: 200px minmax(900px, 1fr) 100px;
}`
    )
  })
  test('Grid Row', () => {
    const classNames = [
      'row-span-full',
      'row-span-3',
      'row-start-3',
      'row-start--3',
      'row-start-auto',
      'row-end-5',
      'row-auto',
      'row-6'
    ]
    expect(css.render(classNames)).toBe(
      `.row-span-full {
  grid-row: 1 / -1;
}
.row-span-3 {
  grid-row: span 3 / span 3;
}
.row-start-3 {
  grid-row-start: 3;
}
.row-start--3 {
  grid-row-start: -3;
}
.row-start-auto {
  grid-row-start: auto;
}
.row-end-5 {
  grid-row-end: 5;
}
.row-auto {
  grid-row: auto;
}
.row-6 {
  grid-row: 6;
}`
    )
  })
  test('Grid Auto Flow', () => {
    const classNames = ['grid-flow-row', 'grid-flow-col', 'grid-flow-col-dense']
    expect(css.render(classNames)).toBe(
      `.grid-flow-row {
  grid-auto-flow: row;
}
.grid-flow-col {
  grid-auto-flow: column;
}
.grid-flow-col-dense {
  grid-auto-flow: column dense;
}`
    )
  })
  test('Grid Auto Columns', () => {
    const classNames = [
      'auto-cols-auto',
      'auto-cols-min',
      'auto-cols-max',
      'auto-cols-fr',
      'auto-cols-[minmax(0,2fr)]'
    ]
    expect(css.render(classNames)).toBe(
      `.auto-cols-auto {
  grid-auto-columns: auto;
}
.auto-cols-min {
  grid-auto-columns: min-content;
}
.auto-cols-max {
  grid-auto-columns: max-content;
}
.auto-cols-fr {
  grid-auto-columns: minmax(0, 1fr);
}
.auto-cols-\\[minmax\\(0\\,2fr\\)\\] {
  grid-auto-columns: minmax(0,2fr);
}`
    )
  })
  test('Grid Auto Rows', () => {
    const classNames = [
      'auto-rows-auto',
      'auto-rows-min',
      'auto-rows-max',
      'auto-rows-fr',
      'auto-rows-[minmax(0,2fr)]'
    ]
    expect(css.render(classNames)).toBe(
      `.auto-rows-auto {
  grid-auto-rows: auto;
}
.auto-rows-min {
  grid-auto-rows: min-content;
}
.auto-rows-max {
  grid-auto-rows: max-content;
}
.auto-rows-fr {
  grid-auto-rows: minmax(0, 1fr);
}
.auto-rows-\\[minmax\\(0\\,2fr\\)\\] {
  grid-auto-rows: minmax(0,2fr);
}`
    )
  })
  test('Gap', () => {
    const classNames = [
      'gap-4',
      'gap-4px',
      'gap-4rem',
      'gap-x-4',
      'gap-x-4px',
      'gap-x-4rem',
      'gap-y-4',
      'gap-y-4px',
      'gap-y-4rem'
    ]
    expect(css.render(classNames)).toBe(
      `.gap-4 {
  gap: 1rem;
}
.gap-4px {
  gap: 4px;
}
.gap-4rem {
  gap: 4rem;
}
.gap-x-4 {
  column-gap: 1rem;
}
.gap-x-4px {
  column-gap: 4px;
}
.gap-x-4rem {
  column-gap: 4rem;
}
.gap-y-4 {
  row-gap: 1rem;
}
.gap-y-4px {
  row-gap: 4px;
}
.gap-y-4rem {
  row-gap: 4rem;
}`
    )
  })
  test('Justify Content', () => {
    const classNames = [
      'justify-center',
      'justify-center-safe',
      'justify-start',
      'justify-end-safe',
      'justify-between'
    ]
    expect(css.render(classNames)).toBe(
      `.justify-center {
  justify-content: center;
}
.justify-center-safe {
  justify-content: safe center;
}
.justify-start {
  justify-content: flex-start;
}
.justify-end-safe {
  justify-content: safe flex-end;
}
.justify-between {
  justify-content: space-between;
}`
    )
  })
  test('Justify Items', () => {
    const classNames = [
      'justify-items-center',
      'justify-items-center-safe',
      'justify-items-start',
      'justify-items-end-safe',
      'justify-items-normal'
    ]
    expect(css.render(classNames)).toBe(
      `.justify-items-center {
  justify-items: center;
}
.justify-items-center-safe {
  justify-items: safe center;
}
.justify-items-start {
  justify-items: start;
}
.justify-items-end-safe {
  justify-items: safe end;
}
.justify-items-normal {
  justify-items: normal;
}`
    )
  })
  test('Justify Self', () => {
    const classNames = [
      'justify-self-center',
      'justify-self-center-safe',
      'justify-self-start',
      'justify-self-end-safe',
      'justify-self-stretch'
    ]

    expect(css.render(classNames)).toBe(
      `.justify-self-center {
  justify-self: center;
}
.justify-self-center-safe {
  justify-self: safe center;
}
.justify-self-start {
  justify-self: start;
}
.justify-self-end-safe {
  justify-self: safe end;
}
.justify-self-stretch {
  justify-self: stretch;
}`
    )
  })
  test('Align Content', () => {
    const classNames = [
      'content-normal',
      'content-start',
      'content-end',
      'content-center',
      'content-between',
      'content-around',
      'content-evenly',
      'content-stretch',
      'content-baseline'
    ]
    expect(css.render(classNames)).toBe(
      `.content-normal {
  align-content: normal;
}
.content-start {
  align-content: flex-start;
}
.content-end {
  align-content: flex-end;
}
.content-center {
  align-content: center;
}
.content-between {
  align-content: space-between;
}
.content-around {
  align-content: space-around;
}
.content-evenly {
  align-content: space-evenly;
}
.content-stretch {
  align-content: stretch;
}
.content-baseline {
  align-content: baseline;
}`
    )
  })
  test('Align Items', () => {
    const classNames = [
      'items-start',
      'items-end',
      'items-end-safe',
      'items-center',
      'items-center-safe',
      'items-stretch',
      'items-baseline',
      'items-baseline-last'
    ]
    expect(css.render(classNames)).toBe(
      `.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.items-end-safe {
  align-items: safe flex-end;
}
.items-center {
  align-items: center;
}
.items-center-safe {
  align-items: safe center;
}
.items-stretch {
  align-items: stretch;
}
.items-baseline {
  align-items: baseline;
}
.items-baseline-last {
  align-items: last baseline;
}`
    )
  })
  test('Align Self', () => {
    const classNames = [
      'self-start',
      'self-end',
      'self-end-safe',
      'self-center',
      'self-center-safe',
      'self-stretch',
      'self-baseline',
      'self-baseline-last',
      'self-auto'
    ]
    expect(css.render(classNames)).toBe(
      `.self-start {
  align-self: flex-start;
}
.self-end {
  align-self: flex-end;
}
.self-end-safe {
  align-self: safe flex-end;
}
.self-center {
  align-self: center;
}
.self-center-safe {
  align-self: safe center;
}
.self-stretch {
  align-self: stretch;
}
.self-baseline {
  align-self: baseline;
}
.self-baseline-last {
  align-self: last baseline;
}
.self-auto {
  align-self: auto;
}`
    )
  })
  test('Place Content', () => {
    const classNames = [
      'place-content-start',
      'place-content-end',
      'place-content-end-safe',
      'place-content-center',
      'place-content-center-safe',
      'place-content-between',
      'place-content-around',
      'place-content-evenly',
      'place-content-stretch',
      'place-content-baseline'
    ]
    expect(css.render(classNames)).toBe(
      `.place-content-start {
  place-content: start;
}
.place-content-end {
  place-content: end;
}
.place-content-end-safe {
  place-content: safe end;
}
.place-content-center {
  place-content: center;
}
.place-content-center-safe {
  place-content: safe center;
}
.place-content-between {
  place-content: space-between;
}
.place-content-around {
  place-content: space-around;
}
.place-content-evenly {
  place-content: space-evenly;
}
.place-content-stretch {
  place-content: stretch;
}
.place-content-baseline {
  place-content: baseline;
}`
    )
  })
  test('Place Items', () => {
    const classNames = [
      'place-items-start',
      'place-items-end',
      'place-items-end-safe',
      'place-items-center',
      'place-items-center-safe',
      'place-items-stretch',
      'place-items-baseline'
    ]
    expect(css.render(classNames)).toBe(
      `.place-items-start {
  place-items: start;
}
.place-items-end {
  place-items: end;
}
.place-items-end-safe {
  place-items: safe end;
}
.place-items-center {
  place-items: center;
}
.place-items-center-safe {
  place-items: safe center;
}
.place-items-stretch {
  place-items: stretch;
}
.place-items-baseline {
  place-items: baseline;
}`
    )
  })
  test('Place Self', () => {
    const classNames = [
      'place-self-start',
      'place-self-end',
      'place-self-end-safe',
      'place-self-center',
      'place-self-center-safe',
      'place-self-stretch',
      'place-self-auto'
    ]
    expect(css.render(classNames)).toBe(
      `.place-self-start {
  place-self: start;
}
.place-self-end {
  place-self: end;
}
.place-self-end-safe {
  place-self: safe end;
}
.place-self-center {
  place-self: center;
}
.place-self-center-safe {
  place-self: safe center;
}
.place-self-stretch {
  place-self: stretch;
}
.place-self-auto {
  place-self: auto;
}`
    )
  })
})
