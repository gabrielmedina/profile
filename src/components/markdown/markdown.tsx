import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { isValidElement } from 'react'
import { cacheLife } from 'next/cache'
import { MarkdownAsync } from 'react-markdown'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeRaw from 'rehype-raw'
import { CodeBlock } from './code-block'
import styles from './code-block.module.scss'
import { textContent, uniqueHeadingId } from './heading-id'
import markdownStyles from './markdown.module.scss'
import { prettyCodeOptions } from './pretty-code'

type MarkdownImage = {
  width: number
  height: number
}

type MarkdownProps = {
  source: string
  images?: Record<string, MarkdownImage>
  priority?: boolean
}

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  'data-language'?: string
}

type FigureProps = ComponentPropsWithoutRef<'figure'> & {
  'data-rehype-pretty-code-figure'?: string
}

export async function Markdown({
  source,
  images,
  priority = true,
}: MarkdownProps) {
  // Shiki touches Date.now(); cache keeps prerender deterministic.
  'use cache'
  cacheLife('max')

  const usedIds = new Map<string, number>()
  const firstImage = priority
    ? /!\[[^\]]*]\(([^)\s]+)\)/.exec(source)?.[1]
    : undefined

  return (
    <MarkdownAsync
      rehypePlugins={[[rehypePrettyCode, prettyCodeOptions], rehypeRaw]}
      components={{
        h2: ({ children }) => heading('h2', children, usedIds),
        h3: ({ children }) => heading('h3', children, usedIds),
        h4: ({ children }) => heading('h4', children, usedIds),
        h5: ({ children }) => heading('h5', children, usedIds),
        h6: ({ children }) => heading('h6', children, usedIds),
        figure: ({ children, ...props }: FigureProps) => {
          if ('data-rehype-pretty-code-figure' in props) {
            return children
          }

          return <figure {...props}>{children}</figure>
        },
        pre: ({ children, ...props }: PreProps) => {
          const language =
            typeof props['data-language'] === 'string'
              ? props['data-language']
              : languageFromCodeChild(children)

          return (
            <CodeBlock language={language}>
              <pre {...props} className={styles.pre}>
                {children}
              </pre>
            </CodeBlock>
          )
        },
        img: ({ src, alt }) => {
          const imageSrc = typeof src === 'string' ? src : null

          if (!imageSrc) return null

          const size = images?.[imageSrc]

          const priority = imageSrc === firstImage

          return (
            <>
              {priority ? (
                <link
                  rel="preload"
                  as="image"
                  href={imageSrc}
                  fetchPriority="high"
                />
              ) : null}
              <img
                src={imageSrc}
                alt={alt ?? ''}
                width={size?.width}
                height={size?.height}
                decoding="async"
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                className={size ? markdownStyles.media : undefined}
              />
            </>
          )
        },
      }}
    >
      {source}
    </MarkdownAsync>
  )
}

function heading(
  Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: ReactNode,
  usedIds: Map<string, number>,
) {
  const id = uniqueHeadingId(textContent(children), usedIds)

  return (
    <Tag id={id} className={markdownStyles.heading}>
      <a href={`#${id}`}>{children}</a>
    </Tag>
  )
}

function languageFromCodeChild(children: ReactNode): string | undefined {
  if (!isValidElement<{ className?: string }>(children)) return undefined

  const className = children.props.className
  if (typeof className !== 'string') return undefined

  return /language-([\w-]+)/.exec(className)?.[1]
}
