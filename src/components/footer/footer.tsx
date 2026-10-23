import { site } from '@/lib/site'
import styles from './footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.header}>
        <p className={styles.name}>{site.name}</p>
        <p className={styles.role}>{site.jobTitle}</p>
        <p className={styles.description}>{site.description}</p>
      </div>

      <ul className={styles.links}>
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
    </footer>
  )
}
