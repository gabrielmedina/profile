import { trackAttrs } from '@/components/analytics/track-attrs'
import { postCountLabel, tagPath, type TagSummary } from '../../utils/tags'
import styles from './tag-filters.module.scss'

type TagFiltersProps = {
  tags: readonly TagSummary[]
  total: number
  activeSlug?: string
}

export function TagFilters({ tags, total, activeSlug }: TagFiltersProps) {
  if (tags.length === 0) return null

  return (
    <nav className={styles.nav} aria-label="Filtrar por assunto">
      <p className={styles.label}>Assuntos</p>
      <ul className={styles.list} data-tag-list>
        <li>
          <a
            href="/posts"
            className={styles.link}
            aria-current={activeSlug ? undefined : 'page'}
            aria-label={`Todos, ${postCountLabel(total)}`}
            {...trackAttrs('clicked-subject', {
              title: 'Todos',
              slug: 'todos',
            })}
          >
            Todos
            <span className={styles.count}>{total}</span>
          </a>
        </li>
        {tags.map((tag) => (
          <li key={tag.slug}>
            <a
              href={tagPath(tag.slug)}
              className={styles.link}
              aria-current={tag.slug === activeSlug ? 'page' : undefined}
              aria-label={`${tag.name}, ${postCountLabel(tag.count)}`}
              {...trackAttrs('clicked-subject', {
                title: tag.name,
                slug: tag.slug,
              })}
            >
              {tag.name}
              <span className={styles.count}>{tag.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
