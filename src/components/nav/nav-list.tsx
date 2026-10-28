import { trackAttrs } from '@/components/analytics/track-attrs'
import { site } from '@/config/site'
import styles from './nav.module.scss'

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Posts', href: '/posts' },
  { title: site.consulting.title, href: site.consulting.path },
] as const

// Home is only the index. Posts also covers each post and each subject page.
function isCurrentNav(href: string, pathname: string) {
  if (href === '/') return pathname === '/'
  if (href === '/posts') {
    return pathname.startsWith('/posts') || pathname.startsWith('/assuntos/')
  }

  return href.length > 0 && pathname.startsWith(href)
}

type NavListProps = {
  pathname: string | null
}

export function NavList({ pathname }: NavListProps) {
  return navItems.map((item) => (
    <li key={item.href} className={styles.item}>
      <a
        href={item.href}
        className={styles.link}
        aria-current={
          pathname && isCurrentNav(item.href, pathname) ? 'page' : undefined
        }
        {...trackAttrs('clicked-nav-link', { title: item.title })}
      >
        {item.title}
      </a>
    </li>
  ))
}
