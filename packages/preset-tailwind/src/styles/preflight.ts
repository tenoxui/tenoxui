export const preflight: Record<string, string | string[]> = {
  '*, ::before, ::after, ::backdrop, ::file-selector-button':
    '[box-sizing]-border-box m-0 p-0 [border]-[0_solid]',
  'html, :host': `
      leading-[1.5]
      [-webkit-text-size-adjust]-100% 
      [tab-size]-4 
      font-sans
      [fontFeatureSettings,fontVariationSettings]-normal
      [webkitTapHighlightColor]-transparent
    `,
  hr: 'h-0 text-inherit border-t-1',
  'abbr:where([title])': '[-webkit-text-decoration,text-decoration]-[underline_dotted]',
  'h1, h2, h3, h4, h5, h6': 'text-(length:inherit) [font-weight]-inherit leading-inherit',
  a: '[color,-webkit-text-decoration,text-decoration]-inherit',
  'b, strong': '[fontWeight]-bolder',
  'code, kbd, samp, pre':
    'font-mono [fontFeatureSettings]-normal [fontVariationSettings]-normal text-1em',
  small: 'text-80%',
  'sub, sup': 'text-75% leading-0 relative align-baseline',
  sub: 'bottom--1',
  sup: 'top--2',
  table: 'indent-0 border-(color:inherit) [border-collapse]-collapse',
  ':-moz-focusring': 'outline-auto',
  progress: 'align-baseline',
  summary: 'list-item',
  'ol, ul, menu': '[list-style]-none',
  'img, svg, video, canvas, audio, iframe, embed, object': 'block align-middle',
  'img, video': 'max-w-100% h-auto',
  'button, input, select, optgroup, textarea, ::file-selector-button':
    '[font,color,letterSpacing,fontFeatureSettings,fontVariationSettings]-inherit bg-transparent radius-[0] opacity-1',
  ':where(select:is([multiple], [size])) optgroup': '[fontWeight]-bolder',
  ':where(select:is([multiple], [size])) optgroup option': '[paddingInlineStart]-20px',
  '::file-selector-button': '[marginInlineEnd]-4px',
  textarea: 'resize-y',
  '::-webkit-search-decoration': '[webkitAppearance]-none',
  '::-webkit-date-and-time-value': 'min-h-1lh [textAlign]-inherit',
  '::-webkit-datetime-edit': 'inline-flex',
  '::-webkit-datetime-edit-fields-wrapper': 'p-0',
  '::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field':
    'py-0',
  ':-moz-ui-invalid': '[box-shadow]-none',
  "button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button":
    '[appearance]-button',
  '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': 'h-auto',
  "[hidden]:where(:not([hidden='until-found']))": '[display]-[none_!important]',
  '::placeholder':
    'opacity-1 [@supports_(not_(-webkit-appearance:_-apple-pay-button))_or_(contain-intrinsic-size:_1px)]:[color]-[color-mix(in_oklab,_currentColor_50%,_transparent);]'
}
