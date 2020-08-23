export default function Profile() {
  return (
    <section className="profile">
      <div className="profile__wrapper">
        <header className="profile__header">
          <figure className="profile__figure">
            <img
              className="profile__img"
              alt="Foto de perfil"
              src="https://avatars3.githubusercontent.com/u/2979365?v=3&amp;s=466"
            />
          </figure>
          <h1 className="profile__title">Gabriel Medina</h1>
          <h2 className="profile__subtitle">Front-end Developer / UX Designer</h2>
        </header>

        <p className="profile__text">
          Enquanto <strong>designer de experiência do usuário (UX)</strong>, 
          atuo colhendo, refinando, prototipando e testando soluções.
        </p>

        <p className="profile__text">
          Já como <strong>front-end developer</strong>, atuo provendo HTML semântico e acessível, 
          CSS escalável e JavaScript seguindo boas práticas de desenvolvimento.
        </p>

        <footer className="profile__footer">
          <ul className="profile__skills" title="Competências">
            <li className="profile__skills-item">UX/UI Design</li>
            <li className="profile__skills-item">Figma</li>
            <li className="profile__skills-item">HTML</li>
            <li className="profile__skills-item">Acessibilidade</li>
            <li className="profile__skills-item">CSS</li>
            <li className="profile__skills-item">Sass</li>
            <li className="profile__skills-item">Responsive design</li>
            <li className="profile__skills-item">Design systems</li>
            <li className="profile__skills-item">JavaScript</li>
            <li className="profile__skills-item">React</li>
            <li className="profile__skills-item">Next.js</li>
          </ul>
        </footer>
      </div>
    </section>
  );
}
