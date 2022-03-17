import { useEffect, useState } from 'react'

import { ThemeContext } from '../contexts/Theme'

import { TOKENS_DARK, TOKENS_LIGHT } from '../constants/Tokens'

import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState(TOKENS_DARK)
  const value = { theme, setTheme }

  useEffect(() => {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches
      ? TOKENS_DARK
      : TOKENS_LIGHT)
  }, [])

  return (
    <ThemeContext.Provider value={value}>
      <ThemeContext.Consumer>
        {value => (
          <div className={`theme ${value.theme}`}>
            <Component {...pageProps} />
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  )
}

export default MyApp
