'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

type TrackedLinkProps = {
  href: string
  className?: string
  event: string
  properties?: Record<string, string>
  children: ReactNode
}

export function TrackedLink({
  href,
  className,
  event,
  properties,
  children,
}: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, properties)}
    >
      {children}
    </Link>
  )
}
