// Class names are shared with styles/base/_tokens.scss and public/site.js.
export const THEME_STORAGE_KEY = 'theme'
export const THEME_DARK = 'tokens-dark'
export const THEME_LIGHT = 'tokens-light'

export type ThemeName = typeof THEME_DARK | typeof THEME_LIGHT

export const THEME_COLOR: Record<ThemeName, string> = {
  [THEME_DARK]: '#16161b',
  [THEME_LIGHT]: '#f5f5f5',
}
