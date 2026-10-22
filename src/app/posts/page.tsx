import type { Metadata } from 'next'
import { TrackPageView } from '@/components/analytics/track-page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { PostList } from '@/features/posts/components/post-list'
import { getAllPosts } from '@/features/posts/posts'
import { pageMetadata } from '@/lib/metadata'
import { site } from '@/lib/site'
import { postsPageGraph } from '@/lib/structured-data'

export const metadata: Metadata = pageMetadata({
  title: site.posts.title,
  description: site.posts.description,
  path: '/posts',
  keywords: ['Front-end', 'Back-end', 'Design', 'Blog'],
})

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <>
      <JsonLd data={postsPageGraph(posts)} />
      <TrackPageView event="opened-posts-page" />
      <PostList posts={posts} />
    </>
  )
}
