import type { ReactNode } from 'react'
import { codeLanguageLabel } from './code-language'
import styles from './code-block.module.scss'

type CodeBlockProps = {
  children: ReactNode
  language?: string
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  const label = codeLanguageLabel(language)

  return (
    <div className={styles.root} data-code-block="">
      <div className={styles.toolbar}>
        <span className={styles.language}>{label}</span>
        <button
          type="button"
          className={styles.copy}
          data-copy-code=""
          aria-label={`Copiar ${label}`}
        >
          <CopyIcon />
          <CheckIcon />
          <span aria-live="polite" data-copy-label="">
            Copiar
          </span>
        </button>
      </div>
      {children}
      <p className={styles.error} data-copy-error="" hidden role="status" />
    </div>
  )
}

function CopyIcon() {
  return (
    <svg
      className={styles.copyIcon}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.25" />
      <path d="M10.5 5.5V4.25A1.25 1.25 0 0 0 9.25 3h-5A1.25 1.25 0 0 0 3 4.25v5A1.25 1.25 0 0 0 4.25 10.5H5.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  )
}
