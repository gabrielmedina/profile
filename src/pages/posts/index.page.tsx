import {FC} from 'react'
import Head from 'next/head'
import {Theme} from 'src/components/layouts'
import {TPost, PostList} from 'src/components/features'
import {Nav} from 'src/components/shared'
import { getAllPosts } from 'src/libs'

type TPostsPageProps = {
  posts: TPost[]
}

export const PostsPage: FC<TPostsPageProps> = ({posts}) => {
  return (
    <>
      <Head>
        <title>Posts - Gabriel Medina</title>
        <meta
          name="description"
          content="Aprendendo; Compartilhando; Aprimorando. Conteúdos sobre o universo front-end, design e raramente back-end."
        />
        <meta
          name="keywords"
          content="Front-end, Back-end, Design, Blog"
        />
        <meta property="og:title" content="Posts - Gabriel Medina" />
        <meta
          property="og:description"
          content="Aprendendo; Compartilhando; Aprimorando. Conteúdos sobre o universo front-end, design e raramente back-end."
        />
        <meta property="og:image" content="/og.png" />
      </Head>

      <Theme>
        <Nav />
        <PostList posts={posts} />
      </Theme>
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()

  return {
    props: {
      posts
    }
  }
}

export default PostsPage
