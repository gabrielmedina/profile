import { createContext } from 'react'

import { TOKENS_DARK } from '../constants/Tokens'

export const ThemeContext = createContext({
  theme: TOKENS_DARK,
  setTheme: () => {},
})