import type { Options } from 'rehype-pretty-code'

/** Dual theme: CSS variables swap with `.tokens-light` / `.tokens-dark`. */
export const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: 'plaintext',
} satisfies Options
