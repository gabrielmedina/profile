import { FC } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { TProfile } from './Profile.types'
import styles from './Profile.module.scss'

export const Profile: FC<TProfile> = ({ user, content }) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <figure className={styles.figure}>
            <Image
              priority
              layout="responsive"
              src={user.avatar_url}
              alt="Foto de perfil: Gabriel Medina"
              width={133}
              height={133}
            />
          </figure>
          <h1 className={styles.title}>{user.name}</h1>
          <h2 className={styles.subtitle}>{user.bio}</h2>
        </header>

        <ReactMarkdown className={styles.content}>{content}</ReactMarkdown>
      </div>
    </section>
  )
}
