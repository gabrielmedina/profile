import {FC} from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {TProfile} from '..'

export const Profile: FC<TProfile> = ({user, content}) => {
  return (
    <section className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <figure className="profile__figure">
            <Image
              layout="responsive"
              src={user.avatar_url}
              alt="Foto de perfil: Gabriel Medina"
              width={133}
              height={133}
            />
          </figure>
          <h1 className="profile__title">{user.name}</h1>
          <h2 className="profile__subtitle">{user.bio}</h2>
        </header>

        <ReactMarkdown className="profile__content">{content}</ReactMarkdown>
      </div>
    </section>
  )
}
