import styles from './reading-progress.module.scss'

export function ReadingProgress() {
  return (
    <div
      className={styles.bar}
      data-reading-progress-bar=""
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-hidden="true"
    />
  )
}
