import { property } from '../@tenoxui-property/src/esm/full.js'

export default {
  input: ['index.html', 'src/**/*.{html,js,jsx,ts,tsx,vue,svelte,astro}'],
  output: 'styles.css',
  property: property,
  classes: {
    display: {
      center: 'flex'
    },
    alignItems: {
      center: 'center'
    },
    justifyContent: {
      center: 'center'
    }
  },
  breakpoints: [
    { name: 'sm', max: 640 },
    { name: 'md', min: 641, max: 768 },
    { name: 'lg', min: 769 }
  ]
}
