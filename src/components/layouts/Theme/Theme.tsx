import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { logger } from 'src/logs'
import { ThemeContext, TOKENS_DARK, TOKENS_LIGHT } from './Theme.context'

type TThemeProps = {
  children: ReactNode
}

export const Theme: FC<TThemeProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>(TOKENS_DARK)
  const contextThemeValue = useMemo(() => ({ theme, setTheme }), [theme])

  useEffect(() => {
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? TOKENS_DARK
      : TOKENS_LIGHT

    setTheme(prefersColorScheme)
    logger.track('prefers-color-theme', {
      theme: prefersColorScheme,
    })
  }, [])

  return (
    <ThemeContext.Provider value={contextThemeValue}>
      <ThemeContext.Consumer>
        {(value) => <div className={`theme ${value.theme}`}>{children}</div>}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  )
}
