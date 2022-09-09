import { FC, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import axios from 'axios'
import { logger } from 'src/logs'
import { Nav } from 'src/components/layouts'
import { Profile, TProfile } from 'src/components/features'

export const HomePage: FC<TProfile> = ({ user, content }) => {
  useEffect(() => {
    logger.track('opened-home-page')
  }, [])

  return (
    <>
      <Head>
        <title>Gabriel Medina: Front-end Engineer</title>
        <meta
          name="description"
          content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento."
        />
        <meta
          name="keywords"
          content="Medina, Developer, Designer, UX, Front-end, Engineer"
        />
        <meta
          property="og:title"
          content="Gabriel Medina: Front-end Engineer"
        />
        <meta
          property="og:description"
          content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento."
        />
        <meta property="og:image" content="/og.png" />
      </Head>

      <Nav />
      <Profile user={user} content={content} />
    </>
  )
}

export default HomePage

export const getStaticProps: GetStaticProps = async () => {
  const userUrl = 'https://api.github.com/users/gabrielmedina'
  const contentUrl =
    'https://raw.githubusercontent.com/gabrielmedina/gabrielmedina/main/README.md'

  const user = await axios
    .get(userUrl)
    .then(({ data }) => ({ user: data as unknown }))
    .catch((error) => ({ error: error as unknown }))

  const content = await axios
    .get(contentUrl)
    .then(({ data }) => ({ content: data as unknown }))
    .catch((error) => ({ error: error as unknown }))

  return {
    props: {
      ...user,
      ...content,
    },
    revalidate: 10080, // one week
  }
}
