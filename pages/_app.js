import { useEffect } from 'react'

import { TOKENS_DARK, TOKENS_LIGHT } from '../constants/Tokens'

import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const tokensStorage = localStorage.getItem('tokens')
    
    if(tokensStorage === null) {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add(TOKENS_DARK)
        localStorage.setItem('tokens', TOKENS_DARK)
      } else {
        document.body.classList.add(TOKENS_LIGHT)
        localStorage.setItem('tokens', TOKENS_LIGHT)
      }
    } else {
      document.body.classList.add(tokensStorage)
    }
  })

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
