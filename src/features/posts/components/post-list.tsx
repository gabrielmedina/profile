import type { PostSummary } from '../types'
import { PostItem } from './post-item'
import styles from './post-list.module.scss'

type PostListProps = {
  posts: PostSummary[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Posts</h1>

        <ol className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>
              <PostItem post={post} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
