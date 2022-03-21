import {FC, useEffect, useState} from 'react'
import {ThemeContext, TOKENS_DARK, TOKENS_LIGHT} from 'src/components/features'

export const LayoutDefault: FC = ({children}) => {
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
