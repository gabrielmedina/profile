import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './footer.module.scss'

const pages = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts' },
] as const

const summary =
  'Senior Front-end Engineer e referência técnica. Atuo na arquitetura de front-end, na evolução de produtos digitais e nas decisões que sustentam a entrega.'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.role}>{site.jobTitle}</p>
          <p className={styles.description}>{summary}</p>
        </div>

        <div className={styles.columns}>
          <nav aria-label="Rodapé">
            <p className={styles.label}>Neste site</p>
            <ul className={styles.list}>
              {pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={styles.link}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={styles.label}>Links</p>
            <ul className={styles.list}>
              <li>
                <a
                  href={site.sameAs[0]}
                  className={styles.link}
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.feedPath} className={styles.link}>
                  Feed
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className={styles.note}>{site.name}</p>
    </footer>
  )
}
