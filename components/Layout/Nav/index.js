import { useState, useEffect } from 'react'

import { TOKENS_DARK, TOKENS_LIGHT } from '../../../constants/Tokens'

export default function Nav() {
  const [tokens, setTokens] = useState()

  useEffect(() => {
    const tokensStorage = localStorage.getItem('tokens')
    
    if(tokensStorage === null) {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTokens(true)
      } else {
        setTokens(false)
      }
    } else {
      tokensStorage === TOKENS_DARK
        ? setTokens(true)
        : setTokens(false)
    }
  })

  const handleChangeTokens = () => {
    const body = document.querySelector('body')

    localStorage.removeItem('tokens')
    body.classList.remove(TOKENS_DARK, TOKENS_LIGHT)

    if(tokens) {
      body.classList.add(TOKENS_LIGHT)
      localStorage.setItem('tokens', TOKENS_LIGHT)
    } else {
      body.classList.add(TOKENS_DARK)
      localStorage.setItem('tokens', TOKENS_DARK)
    }
  };

  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__list-item">
          <a
            className="nav__list-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/gmedinasantos/"
          >
            LinkedIn
          </a>
        </li>
        <li className="nav__list-item">
          <a
            className="nav__list-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/gabrielmedina"
          >
            GitHub
          </a>
        </li>
        <li className="nav__list-item">
          <button
            className="nav__list-btn-tokens"
            title={ tokens ? 'Trocar para modo claro' : 'Trocar para modo escuro' }
            onClick={() => {
              setTokens(!tokens)
              handleChangeTokens()
            }}
          >
            <svg
              focusable="false"
              data-prefix="fas"
              data-icon="adjust"
              className="nav__list-tokens-icon svg-inline--fa fa-adjust fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M8 256c0 136.966 111.033 248 248 248s248-111.034 248-248S392.966 8 256 8 8 119.033 8 256zm248 184V72c101.705 0 184 82.311 184 184 0 101.705-82.311 184-184 184z"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
