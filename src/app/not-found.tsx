import type { Metadata } from 'next'
import Link from 'next/link'
import { feedAlternates, noIndexRobots } from '@/lib/metadata'
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
        <Link href="/" className={styles.action}>
          Voltar para o início
        </Link>
        <Link href="/posts" className={styles.action}>
          Ver os posts
        </Link>
      </div>
    </section>
  )
}
