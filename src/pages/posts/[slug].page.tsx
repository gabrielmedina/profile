import { FC, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { logger } from 'src/logs'
import { Nav } from 'src/components/layouts'
import {
  TPost,
  PostShow,
  getPostBySlug,
  getAllPosts,
} from 'src/components/features'

type TPostPageProps = {
  post: TPost
}

export const PostPage: FC<TPostPageProps> = ({ post }) => {
  useEffect(() => {
    logger.track('opened-post-page', {
      post: post.data.title,
      slug: post.data.slug,
    })
  }, [])

  return (
    <>
      <Head>
        <title>{post.data.title} - Gabriel Medina</title>
        <meta name="description" content={post.data.description} />
        <meta name="keywords" content={post.data.keys} />
        <meta
          property="og:title"
          content={`${post.data.title} - Gabriel Medina`}
        />
        <meta property="og:description" content={post.data.description} />
        <meta property="og:image" content={post.data.image} />
      </Head>

      <Nav />
      <PostShow post={post} />
    </>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { content, data } = getPostBySlug(params?.slug as string)

  return {
    props: {
      post: {
        data,
        content,
      },
    },
    revalidate: 10080, // one week
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.data.slug,
        },
      }
    }),
    fallback: 'blocking',
  }
}
