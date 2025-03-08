import { property } from '@tenoxui/property'
import { merge, transformClasses } from '@nousantx/someutils'
import { theme, variables } from '@nousantx/tenoxui-create-theme'
import { primary, zinc, red, rose } from '@nousantx/color-library'

const color = {
  primary,
  red,
  neutral: zinc
}

export default {
  include: ['index.html', 'src/**/*.js'],
  property,
  values: variables(color),
  classes: transformClasses({
    bg: {
      '--bg-opacity': '{1}% || 1',
      backgroundColor: 'rgb({0} / var(--bg-opacity)) || rgb(255 0 0)'
    },
    text: {
      '--text-opacity': '{1}% || 1',
      color: 'rgb({0} / var(--text-opacity)) || rgb(255 0 0)'
    },
    border: {
      '--text-opacity': '{1}% || 1',
      borderColor: 'rgb({0} / var(--text-opacity)) || rgb(255 0 0)'
    }
  }),
  theme: {
    apply: {
      SINGLE_RULE: [
        "@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');"
      ],
      "[data-theme='light']": theme({ ...color, primary: rose }),
      "[data-theme='dark']": theme(color, true),
      ':root': 'family-inter'
    }
  },
  base: {
    apply: {
      '*, *::before, *::after': '[m,p]-0 [box-sizing]-border-box'
    }
  }
}
