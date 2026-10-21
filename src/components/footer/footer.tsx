import Link from 'next/link'
import { site } from '@/lib/site'
import styles from './footer.module.scss'

const pages = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts' },
] as const

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.role}>{site.jobTitle}</p>
          <p className={styles.description}>{site.description}</p>
        </div>

        <div className={styles.columns}>
          <nav aria-label="Rodapé">
            <p className={styles.label}>Navegar</p>
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
            <p className={styles.label}>Fora daqui</p>
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

          <div className={styles.topics}>
            <p className={styles.label}>Assuntos</p>
            <ul className={styles.topicList}>
              {site.knowsAbout.map((topic) => (
                <li key={topic} className={styles.topic}>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className={styles.note}>
        {site.name} · {site.language}
      </p>
    </footer>
  )
}
