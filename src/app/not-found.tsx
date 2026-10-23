import type { Metadata } from 'next'
import { feedAlternates, noIndexRobots } from '@/lib/seo/page-metadata'
import styles from './not-found.module.scss'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'Esse caminho não existe mais.',
  robots: noIndexRobots,
  alternates: feedAlternates,
}

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.text}>Esse caminho não existe mais.</p>
      <div className={styles.actions}>
        <a href="/" className={styles.action}>
          Voltar para o início
        </a>
        <a href="/posts" className={styles.action}>
          Ver os posts
        </a>
      </div>
    </section>
  )
}
