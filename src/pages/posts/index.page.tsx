import { FC, useEffect } from 'react'
import Head from 'next/head'
import { logger } from 'src/logs'
import { Nav } from 'src/components/layouts'
import { TPost, PostList, getAllPosts } from 'src/components/features'

type TPostsPageProps = {
  posts: TPost[]
}

export const PostsPage: FC<TPostsPageProps> = ({ posts }) => {
  useEffect(() => {
    logger.track('opened-posts-page')
  }, [])

  return (
    <>
      <Head>
        <title>Posts - Gabriel Medina</title>
        <meta
          name="description"
          content="Aprendendo; Compartilhando; Aprimorando. Conteúdos sobre o universo front-end, design e raramente back-end."
        />
        <meta name="keywords" content="Front-end, Back-end, Design, Blog" />
        <meta property="og:title" content="Posts - Gabriel Medina" />
        <meta
          property="og:description"
          content="Aprendendo; Compartilhando; Aprimorando. Conteúdos sobre o universo front-end, design e raramente back-end."
        />
        <meta property="og:image" content="/og.png" />
      </Head>

      <Nav />
      <PostList posts={posts} />
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: {
      posts,
    },
  }
}

export default PostsPage
