import Head from 'next/head'

import api from '../services/api'

import skills from '../db/skills.json'

import { Nav, Profile } from '../components'

export default function Home({ profile }) {
  return (
    <>
      <Head>
        <title>Gabriel Medina: Front-end Engineer</title>
        
        <meta name="description" content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento." />
        <meta name="keywords" content="Medina, Developer, Designer, UX, Front-end, Engineer" />
        <meta property="og:title" content="Gabriel Medina: Front-end Engineer" />
        <meta property="og:description" content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento." />
        <meta property="og:image" content="/og.png" />
        
        <link rel="icon" href="/favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@500;700&display=swap" rel="stylesheet" />
      </Head>

      <Nav />

      <Profile
        profile={profile}
        skills={skills}
      />
    </>
  )
}

export async function getStaticProps() {
  const responseProfile = await api.get('/users/gabrielmedina')
    .then(({ data }) => {
      return { profile: data }
    })
    .catch(error => {
      return { error }
    })
  
  return {
    props: {
      ...responseProfile,
    },
    revalidate: 10080, // one week
  }    
}
