// /extensions/FontSize.ts
// Font size attribute tied to TipTap's textStyle mark.
// - Stores size as class="fs-24" + data-fs="24px" for responsive CSS.
// - Parses legacy inline styles and our data attributes/classes.
// - Provides type-safe commands for setting/unsetting font size.

import { Extension } from '@tiptap/core'

/** Keep in sync with your toolbar options */
export const FONT_SIZE_VALUES = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'] as const
export type FontSizeValue = typeof FONT_SIZE_VALUES[number]

/** Type guard to narrow arbitrary strings */
export function isFontSizeValue(s: string): s is FontSizeValue {
  return (FONT_SIZE_VALUES as readonly string[]).includes(s)
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /** Apply one of the allowed sizes (e.g., '24px'). */
      setFontSize: (size: FontSizeValue) => ReturnType
      /** Remove the font size mark. */
      unsetFontSize: () => ReturnType
    }
  }
}

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null as FontSizeValue | null,
            renderHTML: attrs => {
              const size = attrs.fontSize as FontSizeValue | null
              if (!size) return {}
              const numeric = String(size).replace(/[^0-9]/g, '')
              return {
                class: `fs-${numeric}`,
                'data-fs': size,
              }
            },
            parseHTML: element => {
              const ds = element.getAttribute('data-fs')
              if (ds && isFontSizeValue(ds)) return ds

              const cls = element.getAttribute('class') || ''
              const m = cls.match(/\bfs-(12|14|16|18|24|32|48)\b/)
              if (m) return `${m[1]}px` as FontSizeValue

              const styleVal = (element as HTMLElement).style.fontSize || ''
              if (styleVal && isFontSizeValue(styleVal)) return styleVal

              return null
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: size }).run(),

      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

export default FontSize
