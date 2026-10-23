import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { site } from '@/config/site'
import type { PostSummary } from '../../types'
import { PostItem } from '../post-item/post-item'
import styles from './post-list.module.scss'

type PostListProps = {
  posts: PostSummary[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: 'Início', href: '/' },
            { name: 'Posts', href: '/posts' },
          ]}
        />
        <header className={styles.header}>
          <h1 className={styles.title}>{site.posts.title}</h1>
          <p className={styles.subtitle}>{site.posts.subtitle}</p>
          <p className={styles.lead}>{site.posts.description}</p>
          <a className={styles.feed} href={site.feedPath}>
            Assinar o feed
          </a>
        </header>

        {posts.length === 0 ? (
          <p className={styles.empty}>Nenhum post publicado ainda.</p>
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
