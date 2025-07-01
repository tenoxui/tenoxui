export const ui = new TenoxUI<
  Record<
    string,
    | ((value: { raw: string; data: string | null } | null) => UtilityFunctionResult)
    | CSSPropertyOrVariable
  >
>({
  utilities: {
    bg: 'background',
    m: (value) => {
      return {
        property: 'margin',
        value
      }
    },
    px: (value) => {
      return [
        {
          property: 'paddingLeft',
          value
        },
        { property: 'paddingRight', value }
      ]
    }
  },
  plugins: [Moxie()]
})

export const data = ui.process('m-10')
console.dir(data, { depth: null })
