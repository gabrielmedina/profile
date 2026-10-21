import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './not-found.module.scss'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.text}>Esse caminho não existe mais.</p>
      <Link href="/" className={styles.action}>
        Voltar para o início
      </Link>
    </section>
  )
}
