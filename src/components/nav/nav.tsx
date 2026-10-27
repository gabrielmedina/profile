import { Suspense } from 'react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { NavLinks } from './nav-links'
import { NavList } from './nav-list'
import styles from './nav.module.scss'

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Principal">
      <ul className={styles.list}>
        <Suspense fallback={<NavList pathname={null} />}>
          <NavLinks />
        </Suspense>
        <li className={styles.item}>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  )
}
