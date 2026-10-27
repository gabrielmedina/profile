import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { PostList } from '@/features/posts/components/post-list/post-list'
import { getAllPosts } from '@/features/posts/services/posts'
import { tagsFromPosts } from '@/features/posts/utils/tags'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { postsPageGraph } from '@/lib/seo/schema-graph'

export async function generateMetadata(): Promise<Metadata> {
  const tags = tagsFromPosts(await getAllPosts())

  return pageMetadata({
    title: site.posts.title,
    description: site.posts.description,
    path: '/posts',
    keywords: tags.map((tag) => tag.name),
  })
}

export default async function PostsPage() {
  const posts = await getAllPosts()
  const tags = tagsFromPosts(posts)

  return (
    <>
      <JsonLd data={postsPageGraph(posts)} />
      <PageView event="opened-posts-page" />
      <PostList
        posts={posts}
        title={site.posts.title}
        subtitle={site.posts.subtitle}
        description={site.posts.description}
        breadcrumbs={[
          { name: 'Início', href: '/' },
          { name: 'Posts', href: '/posts' },
        ]}
        feed
        tags={tags}
        total={posts.length}
      />
    </>
  )
}
