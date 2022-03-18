import ReactMarkdown from 'react-markdown'

export function Profile({ user, content }) {
  return (
    <section className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <figure className="profile__figure">
            <img
              className="profile__img"
              alt="Foto de perfil"
              src={user.avatar_url}
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
