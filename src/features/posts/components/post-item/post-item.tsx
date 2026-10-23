import { trackAttrs } from '@/components/analytics/track-attrs'
import { formatLongDate } from '@/lib/format/long-date'
import type { PostSummary } from '../../types'
import styles from './post-item.module.scss'

type PostItemProps = {
  post: PostSummary
  size?: 'default' | 'compact'
}

export function PostItem({ post, size = 'default' }: PostItemProps) {
  const Title = size === 'compact' ? 'h3' : 'h2'

  return (
    <a
      href={`/posts/${post.slug}`}
      className={
        size === 'compact' ? `${styles.link} ${styles.compact}` : styles.link
      }
      {...trackAttrs('clicked-post-item', { title: post.title })}
    >
      <Title className={styles.title}>{post.title}</Title>
      <p className={styles.description}>{post.description}</p>
      <p className={styles.meta}>
        <time dateTime={post.date}>{formatLongDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingTime}</span>
      </p>
    </a>
  )
}
