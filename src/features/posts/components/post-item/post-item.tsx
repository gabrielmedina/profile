import { trackAttrs } from '@/components/analytics/track-attrs'
import { formatLongDate } from '@/lib/format/long-date'
import type { PostSummary } from '../../types'
import styles from './post-item.module.scss'

type PostItemProps = {
  post: PostSummary
  size?: 'default' | 'compact'
  surface: 'list' | 'continue-reading'
}

export function PostItem({ post, size = 'default', surface }: PostItemProps) {
  const Title = size === 'compact' ? 'h3' : 'h2'
  const isLinkedIn = post.type === 'linkedin'

  return (
    <a
      href={`/posts/${post.slug}`}
      className={`${styles.link} ${size === 'compact' ? styles.compact : ''} ${isLinkedIn ? styles.linkedin : ''}`}
      {...trackAttrs('clicked-post-item', {
        title: post.title,
        slug: post.slug,
        surface,
      })}
    >
      <div className={styles.header}>
        <Title className={styles.title}>{post.title}</Title>
        {isLinkedIn ? (
          <span className={styles.badge} aria-label="Post do LinkedIn">
            LinkedIn
          </span>
        ) : null}
      </div>
      <p className={styles.description}>{post.description}</p>
      <p className={styles.meta}>
        <time dateTime={post.date}>{formatLongDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingTime}</span>
      </p>
    </a>
  )
}
