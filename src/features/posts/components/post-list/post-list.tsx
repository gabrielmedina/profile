import {
  Breadcrumbs,
  type BreadcrumbItem,
} from '@/components/breadcrumbs/breadcrumbs'
import { site } from '@/config/site'
import type { PostSummary } from '../../types'
import type { TagSummary } from '../../utils/tags'
import { PostItem } from '../post-item/post-item'
import { TagFilters } from '../tag-filters/tag-filters'
import styles from './post-list.module.scss'

type PostListProps = {
  posts: PostSummary[]
  title: string
  description: string
  breadcrumbs: readonly BreadcrumbItem[]
  subtitle?: string
  feed?: boolean
  tags?: readonly TagSummary[]
  activeSlug?: string
  total?: number
  emptyLabel?: string
}

export function PostList({
  posts,
  title,
  description,
  breadcrumbs,
  subtitle,
  feed = false,
  tags,
  activeSlug,
  total,
  emptyLabel = 'Nenhum post publicado ainda.',
}: PostListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbs} />
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          <p className={styles.lead}>{description}</p>
          {feed ? (
            <a className={styles.feed} href={site.feedPath}>
              Assinar o feed
            </a>
          ) : null}
          {tags && tags.length > 0 ? (
            <TagFilters
              tags={tags}
              activeSlug={activeSlug}
              total={total ?? posts.length}
            />
          ) : null}
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          <ol className={styles.list}>
            {posts.map((post) => (
              <li key={post.slug}>
                <PostItem post={post} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
