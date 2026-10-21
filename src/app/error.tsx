'use client'

import { useEffect } from 'react'
import styles from './not-found.module.scss'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Não foi possível carregar esta página</h1>
      <p className={styles.text}>Tenta de novo em instantes.</p>
      <button type="button" className={styles.action} onClick={reset}>
        Tentar de novo
      </button>
    </section>
  )
}
