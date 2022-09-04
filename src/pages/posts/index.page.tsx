import {FC} from 'react'
import Head from 'next/head'
import {Theme} from 'src/components/layouts'
import {TPost, PostList} from 'src/components/features'
import {Nav} from 'src/components/shared'
import { getAllPosts } from 'libs'

type TPostsPageProps = {
  posts: TPost[]
}

export const PostsPage: FC<TPostsPageProps> = ({posts}) => {
  return (
    <>
      <Head>
        <title>Blog | Gabriel Medina</title>
        <meta
          name="description"
          content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento."
        />
        <meta
          name="keywords"
          content="Medina, Developer, Designer, UX, Front-end, Engineer"
        />
        <meta property="og:title" content="Posts | Gabriel Medina" />
        <meta
          property="og:description"
          content="Atuo provendo HTML semântico e acessível, CSS escalável e JavaScript seguindo boas práticas de desenvolvimento."
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
