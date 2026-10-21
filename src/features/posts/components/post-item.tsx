'use client'

import Link from 'next/link'
import { track } from '@/lib/analytics'
import type { PostSummary } from '../types'
import styles from './post-item.module.scss'

type PostItemProps = {
  post: PostSummary
}

export function PostItem({ post }: PostItemProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={styles.link}
      onClick={() => track('clicked-post-item', { title: post.title })}
    >
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.description}>{post.description}</p>
    </Link>
  )
}
