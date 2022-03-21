import {FC} from 'react'
import {ThemeSwitcher} from 'src/components/layouts'

export const Nav: FC = () => {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__list-item">
          <a
            className="nav__list-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/gmedinasantos/"
          >
            LinkedIn
          </a>
        </li>
        <li className="nav__list-item">
          <a
            className="nav__list-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/gabrielmedina"
          >
            GitHub
          </a>
        </li>
        <li className="nav__list-item">
          <ThemeSwitcher className="nav__list-tokens" />
        </li>
      </ul>
    </nav>
  )
}
