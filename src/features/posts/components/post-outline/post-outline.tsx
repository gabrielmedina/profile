import { trackAttrs } from '@/components/analytics/track-attrs'
import type { OutlineSection } from './outline'
import styles from './post-outline.module.scss'

type PostOutlineProps = {
  sections: OutlineSection[]
  slug: string
}

export function PostOutline({ sections, slug }: PostOutlineProps) {
  const labelId = `neste-artigo-${slug}`

  return (
    <nav
      className={styles.nav}
      aria-labelledby={labelId}
      data-article-outline=""
    >
      <p id={labelId} className={styles.label}>
        Neste artigo
      </p>
      <ul className={styles.list} data-outline-list="">
        {sections.map((section) => (
          <OutlineItem key={section.id} section={section} slug={slug} />
        ))}
      </ul>
      <noscript>
        <style>{`.${styles.nested}{display:block}.${styles.toggle}{display:none}`}</style>
      </noscript>
    </nav>
  )
}

function OutlineItem({
  section,
  slug,
  nested = false,
}: {
  section: OutlineSection
  slug: string
  nested?: boolean
}) {
  const panelId = `toc_${slug}_${section.id}`
  const hasChildren = section.children.length > 0

  return (
    <li
      className={nested ? styles.nestedItem : styles.item}
      data-outline-item=""
    >
      {hasChildren ? (
        <div className={styles.row}>
          <OutlineLink section={section} slug={slug} />
          <button
            type="button"
            className={styles.toggle}
            data-outline-toggle=""
            data-outline-name={section.text}
            aria-expanded="false"
            aria-controls={panelId}
            aria-label={`Mostrar subseções de ${section.text}`}
          >
            <span className={styles.count} aria-hidden="true">
              {section.children.length}
            </span>
            <Chevron />
          </button>
        </div>
      ) : (
        <OutlineLink section={section} slug={slug} />
      )}
      {hasChildren ? (
        <ul id={panelId} className={styles.nested} data-outline-nested="">
          {section.children.map((child) => (
            <OutlineItem key={child.id} section={child} slug={slug} nested />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function OutlineLink({
  section,
  slug,
}: {
  section: OutlineSection
  slug: string
}) {
  return (
    <a
      className={styles.link}
      href={`#${section.id}`}
      data-outline-link=""
      {...trackAttrs('clicked-article-outline', {
        title: section.text,
        slug,
      })}
    >
      {section.text}
    </a>
  )
}

function Chevron() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M4 6.5 8 10.5 12 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
