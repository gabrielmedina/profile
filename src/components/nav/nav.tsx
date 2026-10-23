import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { trackAttrs } from '@/lib/track-attrs'
import styles from './nav.module.scss'

const items = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts' },
] as const

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Principal">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <a
              href={item.href}
              className={styles.link}
              data-nav
              {...trackAttrs('clicked-nav-link', { title: item.title })}
            >
              {item.title}
            </a>
          </li>
        ))}
        <li className={styles.item}>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  )
}
