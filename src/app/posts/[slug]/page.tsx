import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { PostArticle } from '@/features/posts/components/post-article'
import { splitKeywords } from '@/features/posts/keywords'
import { getAllPosts, getPost } from '@/features/posts/posts'
import { relatedPosts } from '@/features/posts/related'
import { feedAlternates, noIndexRobots, pageMetadata } from '@/lib/metadata'
import { postPageGraph } from '@/lib/structured-data'

type PostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post',
      robots: noIndexRobots,
      alternates: feedAlternates,
    }
  }

  const keywords = splitKeywords(post.keys)
  const imageSize = post.image ? post.images[post.image] : undefined

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/posts/${post.slug}`,
    keywords,
    kind: 'article',
    publishedTime: `${post.date}T00:00:00.000Z`,
    tags: keywords,
    section: keywords[0],
    image: post.image
      ? {
          url: post.image,
          alt: post.title,
          width: imageSize?.width,
          height: imageSize?.height,
        }
      : undefined,
  })
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const posts = await getAllPosts()
  const keywords = splitKeywords(post.keys)
  const imageSize = post.image ? post.images[post.image] : undefined

  return (
    <>
      <JsonLd
        data={postPageGraph({
          title: post.title,
          description: post.description,
          slug: post.slug,
          date: post.date,
          lang: post.lang,
          keywords,
          wordCount: post.wordCount,
          image: post.image,
          imageWidth: imageSize?.width,
          imageHeight: imageSize?.height,
        })}
      />
      <PageView
        event="opened-post-page"
        properties={{ post: post.title, slug: post.slug }}
      />
      <PostArticle post={post} related={relatedPosts(post, posts)} />
    </>
  )
}
