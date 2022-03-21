import { createContext, Dispatch, SetStateAction } from 'react'

export const TOKENS_DARK = 'tokens-dark'
export const TOKENS_LIGHT = 'tokens-light'

export type TThemeProps = {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}

export const ThemeContext = createContext<TThemeProps>({
  theme: TOKENS_DARK,
  setTheme: () => {},
})