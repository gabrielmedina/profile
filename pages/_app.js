import { useEffect } from 'react'

import { TOKENS_DARK, TOKENS_LIGHT } from '../constants/Tokens'

import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const body = document.querySelector('body')
    const tokens = localStorage.getItem('tokens')

    if(tokens !== null) {
      body.classList.remove(TOKENS_DARK, TOKENS_LIGHT)
      body.classList.add(tokens)
    }
  })

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
