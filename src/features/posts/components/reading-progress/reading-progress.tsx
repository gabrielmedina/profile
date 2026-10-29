import styles from './reading-progress.module.scss'

type ReadingProgressProps = {
  slug: string
  title: string
}

export function ReadingProgress({ slug, title }: ReadingProgressProps) {
  return (
    <div
      className={styles.bar}
      data-reading-progress-bar=""
      data-reading-slug={slug}
      data-reading-title={title}
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-hidden="true"
    />
  )
}
