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

    expect(ui.render('[background]-red')[0]).toBe('.\\[background\\]-red {\n  background: red;\n}')
    expect(ui.render('md:[background]-blue')[0]).toBe(`@media (width >= 48rem) {
  .md\\:\\[background\\]-blue {
    background: blue;
  }
}`)
    expect(ui.render('[width,height]-100px')[0]).toBe(
      '.\\[width\\,height\\]-100px {\n  width: 100px;\n  height: 100px;\n}'
    )
    expect(ui.render('[--my-var]-red')[0]).toBe('.\\[--my-var\\]-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:[--my-var]-red')[0]).toBe(
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

    expect(ui.render('bg-red')[0]).toBe('.bg-red {\n  background: red;\n}')
    expect(ui.render('md:bg-blue')[0]).toBe(`@media (width >= 48rem) {
  .md\\:bg-blue {
    background: blue;
  }
}`)
    expect(ui.render('size-100px')[0]).toBe('.size-100px {\n  width: 100px;\n  height: 100px;\n}')
    expect(ui.render('my-var-red')[0]).toBe('.my-var-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:my-var-blue')[0]).toBe(
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

    expect(ui.render('bg-red')[0]).toBe('.bg-red {\n  background: red;\n}')
    expect(ui.render('md:bg-blue')[0]).toBe(`@media (width >= 48rem) {
  .md\\:bg-blue {
    background: blue;
  }
}`)
    expect(ui.render('size-100px')[0]).toBe('.size-100px {\n  width: 100px;\n  height: 100px;\n}')
    expect(ui.render('my-var-red')[0]).toBe('.my-var-red {\n  --my-var: red;\n}')
    expect(ui.render('hover:my-var-blue')[0]).toBe(
      '.hover\\:my-var-blue:hover {\n  --my-var: blue;\n}'
    )
    expect(ui.render('m-10')[0]).toBe('.m-10 {\n  margin: 10px;\n}')
    expect(ui.render('hover:m-10.5')[0]).toBe('.hover\\:m-10\\.5:hover {\n  margin: 10.5px;\n}')
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
    expect(ui.render('flex')[0]).toBe('.flex {\n  display: flex;\n}')
    expect(ui.render('aflex')[0]).toBe('.aflex {\n  display: flex;\n}')
    expect(ui.render('aflex-hehehe')[0]).toBe('.aflex-hehehe {\n  display: flex;\n}')
    expect(ui.render('aflex-whatever')[0]).toBe('.aflex-whatever {\n  display: flex;\n}')
    expect(ui.render('aflex-10px')[0]).toBe('.aflex-10px {\n  display: flex;\n}')
    expect(ui.render('aflex-10px/30px')[0]).toBe('.aflex-10px\\/30px {\n  display: flex;\n}')
  })
  it('should create css from alias', () => {
    const ui = new TenoxUI({
      property: {
        bg: 'background',
        m: 'margin'
      },
      aliases: {
        btn: 'bg-red m-10px',
        btn2: 'bg-red m-10px hover:bg-blue',
        btn3: 'bg-red m-10px hover:bg-blue md:m-20px'
      },
      variants: {
        hover: '&:hover'
      },
      breakpoints: {
        md: '48rem'
      }
    })

    expect(ui.render('btn')[0]).toBe(`.btn {
  background: red;
  margin: 10px;
}`)
    expect(ui.render('btn2').join('\n')).toBe(`.btn2 {
  background: red;
  margin: 10px;
}
.btn2:hover {
  background: blue;
}`)
    expect(ui.render('btn3').join('\n')).toBe(`.btn3 {
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
})
