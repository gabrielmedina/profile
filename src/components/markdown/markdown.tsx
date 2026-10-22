import type { ReactNode } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { slugify } from '@/lib/slugify'
import styles from './markdown.module.scss'

type MarkdownImage = {
  width: number
  height: number
}

type MarkdownProps = {
  source: string
  images?: Record<string, MarkdownImage>
}

export function Markdown({ source, images }: MarkdownProps) {
  const usedIds = new Map<string, number>()
  const firstImage = /!\[[^\]]*]\(([^)\s]+)\)/.exec(source)?.[1]

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h2: ({ children }) => heading('h2', children, usedIds),
        h3: ({ children }) => heading('h3', children, usedIds),
        h4: ({ children }) => heading('h4', children, usedIds),
        h5: ({ children }) => heading('h5', children, usedIds),
        h6: ({ children }) => heading('h6', children, usedIds),
        img: ({ src, alt }) => {
          const imageSrc = typeof src === 'string' ? src : null

          if (!imageSrc) return null

          const size = images?.[imageSrc]

          if (!size) {
            return (
              // Remote or unsized markdown images keep the native tag.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc} alt={alt ?? ''} decoding="async" />
            )
          }

          return (
            <Image
              src={imageSrc}
              alt={alt ?? ''}
              width={size.width}
              height={size.height}
              sizes="(min-width: 1200px) 1200px, 100vw"
              priority={imageSrc === firstImage}
              className={styles.media}
            />
          )
        },
      }}
    >
      {source}
    </ReactMarkdown>
  )
}

function heading(
  Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: ReactNode,
  usedIds: Map<string, number>,
) {
  const id = uniqueId(textContent(children), usedIds)

  return (
    <Tag id={id} className={styles.heading}>
      <a href={`#${id}`}>{children}</a>
    </Tag>
  )
}

function uniqueId(value: string, usedIds: Map<string, number>) {
  const base = slugify(value)
  const seen = usedIds.get(base) ?? 0
  usedIds.set(base, seen + 1)

  return seen === 0 ? base : `${base}-${seen + 1}`
}

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')

  if (node && typeof node === 'object' && 'props' in node) {
    const element = node as { props?: { children?: ReactNode } }
    return textContent(element.props?.children)
  }

  return ''
}
