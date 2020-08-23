import Head from 'next/head'

import Nav from '../components/Layout/Nav'
import Profile from '../components/Profile'

export default function Home() {
 

  return (
    <>
      <Head>
        <title>Gabriel Medina: Front-end Developer / UX Designer</title>
        
        <meta name="description" content="Atuo colhendo, refinando, prototipando e testando soluções e construíndo toda a parte front-end das aplicações." />
        <meta name="keywords" content="Medina, Developer, Designer, UX, Front-end" />
        <meta property="og:title" content="Gabriel Medina: Front-end Developer / UX Designer" />
        <meta property="og:description" content="Atuo colhendo, refinando, prototipando e testando soluções e construíndo toda a parte front-end das aplicações." />
        <meta property="og:image" content="/og.png" />
        
        <link rel="icon" href="/favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <Nav />
      <Profile />
    </>
  )
}
