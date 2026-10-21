'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import styles from './nav.module.scss'

type NavLinkProps = {
  href: string
  title: string
}

export function NavLink({ href, title }: NavLinkProps) {
  const pathname = usePathname()
  const current = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={styles.link}
      aria-current={current ? 'page' : undefined}
      onClick={() => track('clicked-nav-link', { title })}
    >
      {title}
    </Link>
  )
}
