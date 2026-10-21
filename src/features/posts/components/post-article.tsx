import { Markdown } from '@/components/markdown/markdown'
import { formatDate } from '@/lib/format-date'
import type { Post } from '../types'
import styles from './post-article.module.scss'

type PostArticleProps = {
  post: Post
}

export function PostArticle({ post }: PostArticleProps) {
  return (
    <article lang={post.lang} className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
        </header>

        <div className={styles.infos}>
          <p className={styles.timeToRead}>{post.readingTime}</p>
          <time dateTime={post.date} className={styles.date}>
            {formatDate(post.date)}
          </time>
        </div>

        <div className={styles.content}>
          <Markdown source={post.content} />
        </div>

        <footer className={styles.footer}>
          <p className={styles.copy}>Just keep going, Gabriel Medina.</p>
          <p className={styles.keywords}>Keywords: {post.keys}.</p>
        </footer>
      </div>
    </article>
  )
}
