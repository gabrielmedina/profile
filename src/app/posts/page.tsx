import type { Metadata } from 'next'
import { TrackPageView } from '@/components/analytics/track-page-view'
import { PostList } from '@/features/posts/components/post-list'
import { getAllPosts } from '@/features/posts/posts'

const description =
  'Aprendendo; Compartilhando; Aprimorando. Conteúdos sobre o universo front-end, design e raramente back-end.'

export const metadata: Metadata = {
  title: 'Posts',
  description,
  keywords: ['Front-end', 'Back-end', 'Design', 'Blog'],
  openGraph: {
    title: 'Posts - Gabriel Medina',
    description,
    images: ['/og.png'],
  },
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <>
      <TrackPageView event="opened-posts-page" />
      <PostList posts={posts} />
    </>
  )
}
