export default function Profile({ profile, skills }) {
  return (
    <section className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <figure className="profile__figure">
            <img
              className="profile__img"
              alt="Foto de perfil"
              src={profile.avatar_url}
            />
          </figure>
          <h1 className="profile__title">{profile.name}</h1>
          <h2 className="profile__subtitle">{profile.bio}</h2>
        </header>

        <p className="profile__text">
          Software engineer focused in front-end application with ux designer skills. I love work in/build systems with good architecture and organization to make developers days happie :)
        </p>

        <blockquote className="profile__blockquote" cite="http://cleancoder.com/">
          “The goal of software architecture is to minimize the human resources required to build and maintain the required system.” ― Robert C. Martin
        </blockquote>

        <footer className="profile__footer">
          <h1 className="utils--hidden-screen-only">Competências</h1>

          <ul className="profile__skills">
            {skills.map(skill => (
              <li
                className="profile__skills-item"
                key={skill.id}
              >
                {skill.title}
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </section>
  )
}
