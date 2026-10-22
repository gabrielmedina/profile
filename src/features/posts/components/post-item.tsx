'use client'

import Link from 'next/link'
import { track } from '@/lib/analytics'
import { formatDate } from '@/lib/format-date'
import type { PostSummary } from '../types'
import styles from './post-item.module.scss'

type PostItemProps = {
  post: PostSummary
  size?: 'default' | 'compact'
}

export function PostItem({ post, size = 'default' }: PostItemProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={
        size === 'compact' ? `${styles.link} ${styles.compact}` : styles.link
      }
      onClick={() => track('clicked-post-item', { title: post.title })}
    >
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.description}>{post.description}</p>
      <p className={styles.meta}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readingTime}</span>
      </p>
    </Link>
  )
}
