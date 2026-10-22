import type { PostSummary } from '../types'
import { PostItem } from './post-item'
import styles from './related-posts.module.scss'

type RelatedPostsProps = {
  posts: PostSummary[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="continue-lendo">
      <h2 id="continue-lendo" className={styles.title}>
        Continue lendo
      </h2>
      
      <ol className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug}>
            <PostItem post={post} size="compact" />
          </li>
        ))}
      </ol>
    </section>
  )
}
