import { it, describe, expect } from 'vitest'
import { TenoxUI } from '../src/index.ts'

describe('TenoxUI Unit Test', () => {
  it('should generate css from direct properties shorthand', () => {
    const ui = new TenoxUI({
      variants: { hover: '&:hover' },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(ui.render('[background]-red')).toBe('.\\[background\\]-red {\n  background: red;\n}')
    expect(ui.render('md:[background]-blue')).toBe(`@media (width >= 48rem) {
  .md\\:\\[background\\]-blue {
    background: blue;
  }
}`)
    expect(ui.render('[width,height]-100px')).toBe(
      '.\\[width\\,height\\]-100px {\n  width: 100px;\n  height: 100px;\n}'
    )
    expect(ui.render('[--my-var]-red')).toBe('.\\[--my-var\\]-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:[--my-var]-red')).toBe(
      '.hover\\:\\[--my-var\\]-red:hover {\n  --my-var: red;\n}'
    )
  })
  it('should generate css from basic shorthand', () => {
    const ui = new TenoxUI({
      property: {
        bg: 'background',
        size: ['width', 'height'],
        'my-var': '--my-var'
      },
      variants: { hover: '&:hover' },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(ui.render('bg-red')).toBe('.bg-red {\n  background: red;\n}')
    expect(ui.render('md:bg-blue')).toBe(`@media (width >= 48rem) {
  .md\\:bg-blue {
    background: blue;
  }
}`)
    expect(ui.render('size-100px')).toBe('.size-100px {\n  width: 100px;\n  height: 100px;\n}')
    expect(ui.render('my-var-red')).toBe('.my-var-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:my-var-blue')).toBe(
      '.hover\\:my-var-blue:hover {\n  --my-var: blue;\n}'
    )
  })
  it('should generate css from custom value shorthand (basic string)', () => {
    const ui = new TenoxUI({
      property: {
        bg: { property: 'background' },
        size: { property: ['width', 'height'] },
        'my-var': { property: '--my-var' },
        m: { property: 'margin', value: '{0}px' }
      },
      variants: { hover: '&:hover' },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(ui.render('bg-red')).toBe('.bg-red {\n  background: red;\n}')
    expect(ui.render('md:bg-blue')).toBe(`@media (width >= 48rem) {
  .md\\:bg-blue {
    background: blue;
  }
}`)
    expect(ui.render('size-100px')).toBe('.size-100px {\n  width: 100px;\n  height: 100px;\n}')
    expect(ui.render('my-var-red')).toBe('.my-var-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:my-var-blue')).toBe(
      '.hover\\:my-var-blue:hover {\n  --my-var: blue;\n}'
    )
    expect(ui.render('m-10')).toBe('.m-10 {\n  margin: 10px;\n}')
    expect(ui.render('hover:m-10.5')).toBe('.hover\\:m-10\\.5:hover {\n  margin: 10.5px;\n}')
  })
  it('should generate css from custom function shorthand', () => {
    const ui = new TenoxUI({
      property: {
        aflex: () => 'display: flex', // non aggressive, allow basically all utilities started with flex-*
        flex: ({ value }) => (value ? null : 'display: flex') // aggresive check, only allow valueless utility
      }
    })

    expect(ui.process('flex-4')).toStrictEqual([])
    expect(
      ui.process('flex-ehatever-it-is-and-whatever-how-long-it-is-shoyld-be-this-way-i-dont-know')
    ).toStrictEqual([])
    expect(
      ui.process(
        'aflex-ehatever-it-is-and-whatever-how-long-it-is-shoyld-be-this-way-i-dont-know'
      )[0].className
    ).toBe('aflex-ehatever-it-is-and-whatever-how-long-it-is-shoyld-be-this-way-i-dont-know')
    expect(ui.render('flex')).toBe('.flex {\n  display: flex;\n}')
    expect(ui.render('aflex')).toBe('.aflex {\n  display: flex;\n}')
    expect(ui.render('aflex-hehehe')).toBe('.aflex-hehehe {\n  display: flex;\n}')
    expect(ui.render('aflex-whatever')).toBe('.aflex-whatever {\n  display: flex;\n}')
    expect(ui.render('aflex-10px')).toBe('.aflex-10px {\n  display: flex;\n}')
    expect(ui.render('aflex-10px/30px')).toBe('.aflex-10px\\/30px {\n  display: flex;\n}')
  })
  it('should create css from alias', () => {
    const ui = new TenoxUI({
      property: {
        bg: 'background',
        m: 'margin',
        size: ['width', 'height']
      },
      aliases: {
        btn: 'bg-red m-10px',
        btn2: 'bg-red m-10px hover:bg-blue',
        btn3: 'bg-red m-10px hover:bg-blue md:m-20px',
        box: 'size-50px'
      },
      variants: {
        hover: '&:hover'
      },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(ui.render('box')).toBe(`.box {
  width: 50px;
  height: 50px;
}`)
    expect(ui.render('btn')).toBe(`.btn {
  background: red;
  margin: 10px;
}`)
    expect(ui.render('btn2')).toBe(`.btn2 {
  background: red;
  margin: 10px;
}
.btn2:hover {
  background: blue;
}`)
    expect(ui.render('btn3')).toBe(`.btn3 {
  background: red;
  margin: 10px;
}
.btn3:hover {
  background: blue;
}
@media (width >= 48rem) {
  .btn3 {
    margin: 20px;
  }
}`)
  })
  it('should add prefix before selectors and new tab size', () => {
    const ui = new TenoxUI({
      tabSize: 4,
      property: {
        bg: 'background',
        m: 'margin',
        size: ['width', 'height'],
        flex: 'value:display: flex'
      },
      aliases: {
        btn: 'bg-red m-10px',
        btn2: 'bg-red m-10px hover:bg-blue',
        btn3: 'bg-red m-10px hover:bg-blue md:m-20px',
        box: 'size-50px'
      },
      variants: {
        hover: '&:hover',
        '@akl': 'value:@media print'
      },
      breakpoints: {
        md: '48rem'
      },
      selectorPrefix: '#tui-haha ',
      reservedVariantChars: ['@']
    })

    expect(ui.render('@akl:bg-red')).toBe(`@media print {
    #tui-haha .\\@akl\\:bg-red {
        background: red;
    }
}`)
    expect(ui.render('bg-red')).toBe(`#tui-haha .bg-red {
    background: red;
}`)
    expect(ui.render('box')).toBe(`#tui-haha .box {
    width: 50px;
    height: 50px;
}`)
    expect(ui.render('btn')).toBe(`#tui-haha .btn {
    background: red;
    margin: 10px;
}`)
    expect(ui.render('btn2')).toBe(`#tui-haha .btn2 {
    background: red;
    margin: 10px;
}
#tui-haha .btn2:hover {
    background: blue;
}`)
    expect(ui.render('btn3')).toBe(`#tui-haha .btn3 {
    background: red;
    margin: 10px;
}
#tui-haha .btn3:hover {
    background: blue;
}
@media (width >= 48rem) {
    #tui-haha .btn3 {
        margin: 20px;
    }
}`)
    expect(
      ui.render({
        body: 'bg-red ![display]-flex'
      })
    ).toBe(`#tui-haha body {
    background: red;
    display: flex !important;
}`)
  })
  it('should apply important class names', () => {
    const css = new TenoxUI({
      property: {
        flex: 'display: flex',
        grid: 'display: grid !important',
        bg: 'background'
      },
      aliases: {
        box: ['flex', 'bg-blue', '[border-radius]-4rem']
      },
      variants: {
        hover: '&:hover'
      }
    })

    expect(css.render('flex !flex grid !grid')).toContain(`.flex {
  display: flex;
}
.\\!flex {
  display: flex !important;
}
.grid {
  display: grid !important;
}
.\\!grid {
  display: grid !important;
}`)
    expect(css.render({ div: 'bg-red !flex hover:bg-blue' })).toContain(`div {
  background: red;
  display: flex !important;
}
div:hover {
  background: blue;
}`)
  })
  it('should add config for prefixLoader', () => {
    const ui = new TenoxUI({
      property: {
        bg: 'background'
      },
      moxieOptions: {
        prefixChars: ['@']
      },
      prefixLoaderOptions: {
        property: {
          '@akl': 'value:@media print'
        }
      }
    })

    expect(ui.render('@akl:bg-red')).toBe(`@media print {
  .\\@akl\\:bg-red {
    background: red;
  }
}`)
  })
})
