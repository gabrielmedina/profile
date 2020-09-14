import { useEffect } from 'react'

import { TOKENS_DARK, TOKENS_LIGHT } from '../constants/Tokens'

import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const tokensStorage = localStorage.getItem('tokens')

    if (tokensStorage !== null) {
      document.body.classList.add(tokensStorage)
      return
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? addTokens(TOKENS_DARK)
      : addTokens(TOKENS_LIGHT)
  })

  const addTokens = (token) => {
    document.body.classList.add(token)
    localStorage.setItem('tokens', token)
  }

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
