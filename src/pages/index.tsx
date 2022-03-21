import {FC} from 'react'
import {GetStaticProps} from 'next'
import Head from 'next/head'
import axios from 'axios'
import {LayoutDefault} from 'src/components/layouts'
import {Nav} from 'src/components/shared'
import {Profile} from 'src/components/features'
import {TUser} from 'src/components/features/Profile/Profile.types'

type THomeProps = {
  user: TUser
  content: string
}

export const Home: FC<THomeProps> = ({user, content}) => {
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

      <LayoutDefault>
        <Nav />
        <Profile user={user} content={content} />
      </LayoutDefault>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const user = await axios
    .get('https://api.github.com/users/gabrielmedina')
    .then(({data}) => {
      return {user: data}
    })
    .catch((error) => {
      return {error}
    })

  const content = await axios
    .get(
      'https://raw.githubusercontent.com/gabrielmedina/gabrielmedina/main/README.md'
    )
    .then(({data}) => {
      return {content: data}
    })
    .catch((error) => {
      return {error}
    })

  return {
    props: {
      ...user,
      ...content
    },
    revalidate: 10080 // one week
  }
}
