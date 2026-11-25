import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { Markdown } from '@/components/markdown/markdown'
import { absoluteUrl } from '@/config/absolute-url'
import { site } from '@/config/site'
import { formatLongDate } from '@/lib/format/long-date'
import type { Post, PostSummary } from '../../types'
import { tagPath } from '../../utils/tags'
import styles from './post-article.module.scss'
import { articleOutline } from '../post-outline/outline'
import { PostOutline } from '../post-outline/post-outline'
import { PostShare } from '../post-share/post-share'
import { PostSpeech } from '../post-speech/post-speech'
import { ReadingProgress } from '../reading-progress/reading-progress'
import { RelatedPosts } from '../related-posts/related-posts'

type PostArticleProps = {
  post: Post
  related: PostSummary[]
}

export function PostArticle({ post, related }: PostArticleProps) {
  const isLinkedIn = post.type === 'linkedin'
  const outline = articleOutline(post.content)

  return (
    <article
      lang={post.lang}
      className={`${styles.wrapper} ${isLinkedIn ? styles.linkedin : ''}`}
    >
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
              {!isLinkedIn || post.wordCount > 100 ? (
                <p className={styles.timeToRead}>{post.readingTime}</p>
              ) : null}
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

          <div
            className={outline ? styles.withOutline : undefined}
            data-article-frame=""
          >
            {outline ? (
              <aside className={styles.outline}>
                <PostOutline sections={outline} slug={post.slug} />
              </aside>
            ) : null}
            <div className={styles.content} data-article-content="">
              <Markdown
                source={post.content}
                images={post.images}
                priority={true}
              />
            </div>
          </div>

          {post.linkedin_link ? (
            <div className={styles.linkedinExternal}>
              <a
                href={post.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver discussão no LinkedIn
              </a>
            </div>
          ) : null}
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
      <ReadingProgress slug={post.slug} title={post.title} />
    </article>
  )
}
