'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { THEME_DARK, THEME_LIGHT } from '@/lib/theme'

export function TrackColorScheme() {
  useEffect(() => {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT

    track('prefers-color-theme', { theme })
  }, [])

  return null
}
