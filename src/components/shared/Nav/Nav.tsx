import Link from 'next/link'
import {FC} from 'react'
import {ThemeSwitcher} from 'src/components/layouts'
import styles from './Nav.module.scss'

export const Nav: FC = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/posts">
            <a className={styles.link}>Posts</a>
          </Link>
        </li>
        <li className={styles.item}>
          <ThemeSwitcher className={styles.linkTokens} />
        </li>
      </ul>
    </nav>
  )
}
