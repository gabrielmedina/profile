import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { Markdown } from '@/components/markdown/markdown'
import { absoluteUrl } from '@/config/absolute-url'
import { site } from '@/config/site'
import { formatLongDate } from '@/lib/format/long-date'
import type { Post, PostSummary } from '../../types'
import { tagPath } from '../../utils/tags'
import styles from './post-article.module.scss'
import { PostShare } from '../post-share/post-share'
import { PostSpeech } from '../post-speech/post-speech'
import { ReadingProgress } from '../reading-progress/reading-progress'
import { RelatedPosts } from '../related-posts/related-posts'

type PostArticleProps = {
  post: Post
  related: PostSummary[]
}

export function PostArticle({ post, related }: PostArticleProps) {
  return (
    <article lang={post.lang} className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.readingRange} data-reading-progress-range="">
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
              {formatLongDate(post.date)}
            </time>
          </div>

          <div className={styles.content}>
            <Markdown source={post.content} images={post.images} />
          </div>
        </div>

        <PostShare
          title={post.title}
          description={post.description}
          slug={post.slug}
          url={absoluteUrl(`/posts/${post.slug}`)}
        />

        {post.tags.length > 0 ? (
          <footer className={styles.footer}>
            <h2 className={styles.keywordsHeading}>Assuntos</h2>
            <ul className={styles.keywords}>
              {post.tags.map((tag) => (
                <li key={tag.slug}>
                  <a
                    href={tagPath(tag.slug)}
                    rel="tag"
                    {...trackAttrs('clicked-subject', {
                      title: tag.name,
                      slug: tag.slug,
                    })}
                  >
                    {tag.name}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}

        <RelatedPosts posts={related} />
      </div>
      <ReadingProgress />
    </article>
  )
}
