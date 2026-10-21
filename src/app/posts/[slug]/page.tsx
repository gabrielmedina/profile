import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrackPageView } from '@/components/analytics/track-page-view'
import { PostArticle } from '@/features/posts/components/post-article'
import { getAllPosts, getPost } from '@/features/posts/posts'

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

  if (!post) return { title: 'Post' }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keys.split(',').map((key) => key.trim()),
    openGraph: {
      title: `${post.title} - Gabriel Medina`,
      description: post.description,
      images: [post.image ?? '/og.png'],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  return (
    <>
      <TrackPageView
        event="opened-post-page"
        properties={{ post: post.title, slug: post.slug }}
      />
      <PostArticle post={post} />
    </>
  )
}
