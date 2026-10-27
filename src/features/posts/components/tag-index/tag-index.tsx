import { trackAttrs } from '@/components/analytics/track-attrs'
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs'
import { site } from '@/config/site'
import { postCountLabel, tagPath, type TagSummary } from '../../utils/tags'
import styles from './tag-index.module.scss'

type TagIndexProps = {
  tags: readonly TagSummary[]
}

export function TagIndex({ tags }: TagIndexProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs
          items={[
            { name: 'Início', href: '/' },
            { name: site.subjects.title, href: site.subjects.path },
          ]}
        />
        <header className={styles.header}>
          <h1 className={styles.title}>{site.subjects.title}</h1>
          <p className={styles.subtitle}>{site.subjects.subtitle}</p>
          <p className={styles.lead}>{site.subjects.description}</p>
        </header>

        {tags.length === 0 ? (
          <p className={styles.empty}>Nenhum assunto publicado ainda.</p>
        ) : (
          <ol className={styles.list}>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <a
                  href={tagPath(tag.slug)}
                  className={styles.link}
                  {...trackAttrs('clicked-subject', {
                    title: tag.name,
                    slug: tag.slug,
                  })}
                >
                  <h2 className={styles.name}>{tag.name}</h2>
                  <p className={styles.description}>{tag.description}</p>
                  <p className={styles.meta}>{postCountLabel(tag.count)}</p>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
