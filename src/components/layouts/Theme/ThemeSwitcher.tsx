import {FC, HTMLAttributes, useContext} from 'react'
import {ThemeContext, TOKENS_DARK, TOKENS_LIGHT} from './Theme.context'

import IconDarkMode from '@assets/icons/moon-outline.svg'
import IconLightMode from '@assets/icons/sunny-outline.svg'

export const ThemeSwitcher: FC<HTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  const {theme, setTheme} = useContext(ThemeContext)

  if (theme === TOKENS_LIGHT)
    return (
      <button
        {...props}
        title="Change to dark mode"
        onClick={() => setTheme(TOKENS_DARK)}
      >
        <IconDarkMode />
      </button>
    )

  return (
    <button
      {...props}
      title="Change to light mode"
      onClick={() => setTheme(TOKENS_LIGHT)}
    >
      <IconLightMode />
    </button>
  )
}
