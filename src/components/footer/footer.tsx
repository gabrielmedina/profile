import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.name}>{site.name}</p>
      <p className={styles.role}>{site.jobTitle}</p>
      <nav aria-label="Rodapé">
        <ul className={styles.list}>
          <li>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/posts" className={styles.link}>
              Posts
            </Link>
          </li>
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
      </nav>
    </footer>
  )
}
