import { Markdown } from '@/components/markdown/markdown'
import type { ProfileContent } from './types'
import styles from './profile.module.scss'

type ProfileProps = ProfileContent

export function Profile({ user, content }: ProfileProps) {
  const avatar = avatarSrc(user.avatarUrl)

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <figure className={styles.figure}>
            <link rel="preload" as="image" href={avatar} fetchPriority="high" />
            <img
              src={avatar}
              alt="Foto de perfil: Gabriel Medina"
              width={144}
              height={144}
              decoding="async"
              fetchPriority="high"
            />
          </figure>
          <h1 className={styles.title}>{user.name}</h1>
          <p className={styles.subtitle}>{user.bio}</p>
        </header>

        <div className={styles.content}>
          <Markdown source={content} />
        </div>
      </div>
    </section>
  )
}

function avatarSrc(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'avatars.githubusercontent.com') return url
    parsed.searchParams.set('s', '384')
    return parsed.toString()
  } catch {
    return url
  }
}
