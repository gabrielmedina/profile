import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { PostList } from '@/features/posts/components/post-list/post-list'
import { getAllPosts } from '@/features/posts/services/posts'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { postsPageGraph } from '@/lib/seo/schema-graph'

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
      <PageView event="opened-posts-page" />
      <PostList posts={posts} />
    </>
  )
}
