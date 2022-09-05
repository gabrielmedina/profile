import {FC} from 'react'
import {GetStaticProps} from 'next'
import Head from 'next/head'
import {Theme} from 'src/components/layouts'
import {TPost, PostItem} from 'src/components/features'
import {Nav} from 'src/components/shared'
import { getAllPosts, getPostBySlug } from 'libs'

type TPostPageProps = {
  post: TPost
}

export const PostPage: FC<TPostPageProps> = ({post}) => {
  return (
    <>
      <Head>
        <title>{post.data.title} | Gabriel Medina</title>
        <meta name="description" content={post.data.description} />
        <meta name="keywords" content={post.data.keys} />
        <meta
          property="og:title"
          content={`${post.data.title} - Gabriel Medina`}
        />
        <meta property="og:description" content={post.data.description} />
        <meta property="og:image" content={post.data.image} />
      </Head>

      <Theme>
        <Nav />
        <PostItem post={post} />
      </Theme>
    </>
  )
}

export default PostPage

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {content, data} = getPostBySlug(params?.slug as string)

  return {
    props: {
      post: {
        data,
        content
      }
    },
    revalidate: 10080 // one week
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.data.slug
        }
      }
    }),
    fallback: 'blocking'
  }
}
