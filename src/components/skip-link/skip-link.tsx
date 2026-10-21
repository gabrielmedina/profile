import styles from './skip-link.module.scss'

export function SkipLink() {
  return (
    <a className={styles.link} href="#conteudo">
      Pular para o conteúdo
    </a>
  )
}
