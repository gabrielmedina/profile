import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { Markdown } from '@/components/markdown/markdown'
import { formatDate } from '@/lib/format-date'
import { site } from '@/lib/site'
import { absoluteUrl } from '@/lib/url'
import { splitKeywords } from '../keywords'
import type { Post, PostSummary } from '../types'
import styles from './post-article.module.scss'
import { PostShare } from './post-share'
import { PostSpeech } from './post-speech'
import { ReadingProgress } from './reading-progress'
import { RelatedPosts } from './related-posts'

type PostArticleProps = {
  post: Post
  related: PostSummary[]
}

export function PostArticle({ post, related }: PostArticleProps) {
  const keywords = splitKeywords(post.keys)

  return (
    <article lang={post.lang} className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: 'Início', href: '/' },
            { name: 'Posts', href: '/posts' },
            { name: post.title, href: `/posts/${post.slug}` },
          ]}
        />
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
        </header>

        <div className={styles.infos}>
          <div className={styles.reading}>
            <p className={styles.author}>
              Por{' '}
              <a href="/" rel="author">
                {site.name}
              </a>
            </p>
            <p className={styles.timeToRead}>{post.readingTime}</p>
            <PostSpeech
              title={post.title}
              description={post.description}
              content={post.content}
              lang={post.lang}
              slug={post.slug}
            />
          </div>
          <time dateTime={post.date} className={styles.date}>
            {formatDate(post.date)}
          </time>
        </div>

        <div className={styles.content} data-reading-progress="">
          <Markdown source={post.content} images={post.images} />
        </div>

        <PostShare
          title={post.title}
          description={post.description}
          slug={post.slug}
          url={absoluteUrl(`/posts/${post.slug}`)}
        />

        {keywords.length > 0 ? (
          <footer className={styles.footer}>
            <h2 className={styles.keywordsHeading}>Assuntos</h2>
            <ul className={styles.keywords}>
              {keywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          </footer>
        ) : null}

        <RelatedPosts posts={related} />
      </div>
      <ReadingProgress key={post.slug} />
    </article>
  )
}
