import { property as TxProps } from '@tenoxui/property'

export default {
  property: {
    ...TxProps,
    'my-bg': {
      property: ['background', 'color'],
      value: 'rgb({0})'
    }
  },
  values: {
    primary: '#ccf654'
  },
  reserveClass: ['[background,--new-cls]-[rgb(color({primary}))]', 'text-red'],
  classes: {
    '--my-ctr': {
      center: '1s'
    },
    webkitAnimation: {
      center: 'var(--my-ctr)'
    },
    display: {
      center: 'flex',
      block: 'block'
    },
    justifyContent: {
      center: 'center'
    },
    alignItems: {
      center: 'center'
    }
  },
  aliases: {
    btn: 'bg-red text-blue' // .btn { background: red; color: blue; }
  },
  breakpoints: [
    { name: 'max-sm', max: 640 },
    { name: 'sm', min: 640 },
    { name: 'max-md', max: 767.9 },
    { name: 'md', min: 768, max: 992 },
    { name: 'max-lg', max: 1023.9 },
    { name: 'lg', min: 1024 },
    { name: 'max-xl', max: 1279.9 },
    { name: 'xl', min: 1280 },
    { name: 'max-2xl', max: 1535.9 },
    { name: '2xl', min: 1536 }
  ]
}
