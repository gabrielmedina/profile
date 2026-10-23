import type { ReactNode } from 'react'
import { headingSlug } from './heading-slug'

export function uniqueHeadingId(value: string, usedIds: Map<string, number>) {
  const base = headingSlug(value)
  const seen = usedIds.get(base) ?? 0
  usedIds.set(base, seen + 1)

  return seen === 0 ? base : `${base}-${seen + 1}`
}

export function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')

  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as { props?: { children?: ReactNode } }
    return textContent(element.props?.children)
  }

  return ''
}
