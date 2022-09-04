import Link from 'next/link'
import {FC} from 'react'
import {ThemeSwitcher} from 'src/components/layouts'

export const Nav: FC = () => {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__list-item">
          <Link href="/">
            <a className="nav__list-link">Home</a>
          </Link>
        </li>
        <li className="nav__list-item">
          <Link href="/posts">
            <a className="nav__list-link">Posts</a>
          </Link>
        </li>
        <li className="nav__list-item">
          <ThemeSwitcher className="nav__list-tokens" />
        </li>
      </ul>
    </nav>
  )
}
