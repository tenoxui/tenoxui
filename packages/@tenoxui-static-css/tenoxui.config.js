import { property } from '../@tenoxui-property/dist/full.esm.js'

export default {
  input: ['index.html', 'src/apps/*.{html,js,jsx,ts,tsx,vue,svelte}'],
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
