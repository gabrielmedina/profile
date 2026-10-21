'use client'

import { track } from '@/lib/analytics'
import {
  THEME_DARK,
  THEME_LIGHT,
  THEME_STORAGE_KEY,
  type ThemeName,
} from '@/lib/theme'

export function applyTheme(theme: ThemeName) {
  const root = document.documentElement

  root.classList.remove(THEME_DARK, THEME_LIGHT)
  root.classList.add(theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  track('changed-theme', { theme })
}
