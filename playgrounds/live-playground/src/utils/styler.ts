import { useLayoutEffect } from 'preact/hooks'
import { MakeTenoxUI } from 'tenoxui'
import type { CoreConfig, Values, Property, Classes } from 'tenoxui'
import { property } from '@tenoxui/property'
import { merge, createProperty } from '@nousantx/someutils'
import { standardAttributes, reactAttributes } from '@nousantx/list-attribute'
import { colors } from '../styles/color'

export const tenoxuiConfig: CoreConfig = {
  property: {
    ...property,
    ...(createProperty(
      {
        bg: 'backgroundColor',
        text: 'color',
        'bdr-c': 'borderColor'
      },
      'rgb({0} / var(--{1}-opacity, 1))'
    ) as Property),
    bgc: 'backgroundColor',
    bgi: 'backgroundImage',
    'bg-opacity': '--bg-opacity',
    'text-opacity': '--text-opacity'
  },
  values: merge(colors, {
    full: '100%',
    family: {
      code: 'JetBrains Mono, monospace',
      sans: 'Inter, sans-serif'
    }
  }) as Values,
  classes: {
    display: {
      block: 'block',
      iblock: 'inline-block',
      flex: 'flex',
      iflex: 'inline-flex',
      center: 'flex',
      hidden: 'none'
    },
    position: {
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky'
    },
    alignItems: {
      center: 'center'
    },
    justifyContent: {
      center: 'center',
      space: 'space-between'
    },
    fontStyle: {
      italic: 'italic'
    }
  },
  attributify: true,
  attributifyIgnore: [...standardAttributes, ...reactAttributes]
}

export function init() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute(
      'child',
      `
(body): fw-500 bg-neutral-50 text-neutral-950;
(textarea): w-100% h-mn-400px p-1rem over-x-scroll tw-nowrap;
(.btn): [all]-unset mr-10px h-40px d-inline-flex ai-center px-12px [cursor]-pointer bg-neutral-900 hover:bg-neutral-800 tr-time-300ms text-neutral-50 br-8px fs-14px fw-500;
(.text): fw-500 ls--0.035em fs-14px;`
    )
    document.querySelectorAll('*').forEach((element) => {
      new MakeTenoxUI({ element: element as HTMLElement, ...tenoxuiConfig }).useDOM()
    })
  }, [])
}
