import { useEffect } from 'react'

import { TOKENS_DARK, TOKENS_LIGHT } from '../constants/Tokens'

import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const body = document.querySelector('body')

    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add(TOKENS_DARK)
      localStorage.setItem('tokens', TOKENS_DARK)
    } else {
      body.classList.add(TOKENS_LIGHT)
      localStorage.setItem('tokens', TOKENS_LIGHT)
    }
  })

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
