import styles from './breadcrumbs.module.scss'

export type BreadcrumbItem = {
  name: string
  href: string
}

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.nav} aria-label="Trilha">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const current = index === items.length - 1

          return (
            <li key={item.href} className={styles.item}>
              {current ? (
                <span className={styles.current} aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>
                  {item.name}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
