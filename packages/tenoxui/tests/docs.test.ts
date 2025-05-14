import { test, describe, expect } from 'vitest'
import { TenoxUI } from '../src/index.ts'

describe('TenoxUI Unit Test', () => {
  test('Main Overview', () => {
    const css = new TenoxUI({
      property: {
        bg: 'background',
        m: 'margin'
      },
      variants: {
        hover: '&:hover',
        dark: '@media (prefers-color-scheme: dark)'
      },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(
      css
        .render([
          'bg-red',
          'm-10px',
          'hover:bg-#ccf654',
          'dark:bg-[rgb(255_0_0)]',
          'md:bg-blue',
          'max-md:m-3.5rem'
        ])
        .join('\n')
    ).toBe(`.bg-red {
  background: red;
}
.m-10px {
  margin: 10px;
}
.hover\\:bg-\\#ccf654:hover {
  background: #ccf654;
}
@media (prefers-color-scheme: dark) {
  .dark\\:bg-\\[rgb\\(255_0_0\\)\\] {
    background: rgb(255 0 0);
  }
}
@media (width >= 48rem) {
  .md\\:bg-blue {
    background: blue;
  }
}
@media (width < 48rem) {
  .max-md\\:m-3\\.5rem {
    margin: 3.5rem;
  }
}`)
  })
  test('Overview', () => {
    const css = new TenoxUI({
      property: {
        // basic utility
        bg: 'background',
        size: ['width', 'height'],
        m: {
          property: 'margin',
          value: '{0}px'
        }
      }
    })

    expect(css.render(['bg-red', 'size-40px', 'm-5']).join('\n')).toBe(`.bg-red {
  background: red;
}
.size-40px {
  width: 40px;
  height: 40px;
}
.m-5 {
  margin: 5px;
}`)
  })

  test('pattern: Generating type pattern with configured shorthands', () => {
    const regexp = new TenoxUI({
      property: {
        bg: '...',
        whatever: '...',
        'is-this': '...'
      }
    }).main.regexp()

    expect(regexp.type).toBe('(whatever|is-this|moxie|bg|\\[[^\\]]+\\])')
  })

  test('property: Direct shorthand', () => {
    const css = new TenoxUI()

    expect(css.render(['[background]-red', '[width,height]-100px', '[margin]-1rem']).join('\n'))
      .toBe(`.\\[background\\]-red {
  background: red;
}
.\\[width\\,height\\]-100px {
  width: 100px;
  height: 100px;
}
.\\[margin\\]-1rem {
  margin: 1rem;
}`)
  })
  test('property: Basic shorthand', () => {
    const css = new TenoxUI({
      property: {
        // single property
        bg: 'background',
        p: 'padding',
        // multiple properties, array of properties
        size: ['width', 'height'],
        px: ['paddingTop', 'paddingBottom'],
        // css variable shorthand
        var1: '--my-var',
        var2: ['--my-var', '--my-var2'],
        var3: ['--my-var', 'color']
      }
    })

    expect(
      css
        .render([
          // basic props
          'bg-red',
          'p-4px',
          // multiple props
          'size-100px',
          'px-2rem',
          // variable props
          'var1-blue',
          'var2-20rem',
          // mixed
          'var3-purple'
        ])
        .join('\n')
    ).toBe(`.bg-red {
  background: red;
}
.p-4px {
  padding: 4px;
}
.size-100px {
  width: 100px;
  height: 100px;
}
.px-2rem {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.var1-blue {
  --my-var: blue;
}
.var2-20rem {
  --my-var: 20rem;
  --my-var2: 20rem;
}
.var3-purple {
  --my-var: purple;
  color: purple;
}`)
  })
  test('property: Basic shorthand (custom value) code', () => {
    const css = new TenoxUI({
      property: {
        img: {
          property: 'backgroundImage',
          value: 'url({0})'
        },
        m: {
          property: 'margin',
          value: '{0}px {1 | 5}px {0}px || 1rem'
        },
        p: {
          property: 'padding'
          // defaulting to `value: '{0}'` if `value` field not defined
        }
      }
    })

    expect(css.render(['img-(/image.jpg)', 'm', 'm-10', 'm-15/7', 'p-1rem', 'p-10px']).join('\n'))
      .toBe(`.img-\\(\\/image\\.jpg\\) {
  background-image: url(/image.jpg);
}
.m {
  margin: 1rem;
}
.m-10 {
  margin: 10px 5px 10px;
}
.m-15\\/7 {
  margin: 15px 7px 15px;
}
.p-1rem {
  padding: 1rem;
}
.p-10px {
  padding: 10px;
}`)
  })
})
