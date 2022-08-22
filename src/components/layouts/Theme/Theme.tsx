import {FC, ReactNode, useEffect, useState} from 'react'
import {ThemeContext, TOKENS_DARK, TOKENS_LIGHT} from './Theme.context'

type TThemeProps = {
  children: ReactNode
}

export const Theme: FC<TThemeProps> = ({children}) => {
  const [theme, setTheme] = useState<string>(TOKENS_DARK)

  useEffect(() => {
    setTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? TOKENS_DARK
        : TOKENS_LIGHT
    )
  }, [])

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <ThemeContext.Consumer>
        {(value) => <div className={`theme ${value.theme}`}>{children}</div>}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  )
}
