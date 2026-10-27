'use client'

import { usePathname } from 'next/navigation'
import { NavList } from './nav-list'

export function NavLinks() {
  return <NavList pathname={usePathname()} />
}
