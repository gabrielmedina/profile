import Image from 'next/image'
import { Markdown } from '@/components/markdown/markdown'
import type { ProfileContent } from './types'
import styles from './profile.module.scss'

type ProfileProps = ProfileContent

export function Profile({ user, content }: ProfileProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <figure className={styles.figure}>
            <Image
              priority
              fill
              sizes="144px"
              src={user.avatarUrl}
              alt="Foto de perfil: Gabriel Medina"
            />
          </figure>
          <h1 className={styles.title}>{user.name}</h1>
          <h2 className={styles.subtitle}>{user.bio}</h2>
        </header>

        <div className={styles.content}>
          <Markdown source={content} />
        </div>
      </div>
    </section>
  )
}
