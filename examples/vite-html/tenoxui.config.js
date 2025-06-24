import { preset, preflight, defaultProperties } from '@tenoxui/preset-tailwind'

const { variants, values, ...config } = preset()

export default {
  include: ['index.html', 'src/**/*.{js,jsx,ts,tsx}'],
  exclude: ['**/node_modules/**/*', '**/dist/**/*'],
  css: {
    apply: {
      ...defaultProperties,
      ...preflight,
      ':root': '[--tw-default-font-sans]-Inter [--tw-default-font-mono]-[JetBrains_Mono]'
    },
    ...config,
    variants: {
      ...variants,
      dark: 'value:[data-theme=dark] &',
      'dark-hover': 'value:[data-theme=dark] &:hover'
    },
    values: { ...values, primary: '#ccf654' }
  }
}
