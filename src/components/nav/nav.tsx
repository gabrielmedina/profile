import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { NavLink } from './nav-link'
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
            <NavLink href={item.href} title={item.title} />
          </li>
        ))}
        <li className={styles.item}>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  )
}
