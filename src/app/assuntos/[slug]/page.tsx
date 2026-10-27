import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { PostList } from '@/features/posts/components/post-list/post-list'
import { getAllPosts } from '@/features/posts/services/posts'
import {
  postCountLabel,
  postsWithTag,
  tagPath,
  tagsFromPosts,
} from '@/features/posts/utils/tags'
import {
  feedAlternates,
  noIndexRobots,
  pageMetadata,
} from '@/lib/seo/page-metadata'
import { subjectPageGraph } from '@/lib/seo/schema-graph'

type SubjectPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tags = tagsFromPosts(await getAllPosts())

  return tags.map((tag) => ({ slug: tag.slug }))
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = tagsFromPosts(await getAllPosts()).find(
    (item) => item.slug === slug,
  )

  if (!tag) {
    return {
      title: 'Assunto',
      robots: noIndexRobots,
      alternates: feedAlternates,
    }
  }

  return pageMetadata({
    title: tag.name,
    description: tag.description,
    path: tagPath(tag.slug),
    keywords: [tag.name],
  })
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { slug } = await params
  const posts = await getAllPosts()
  const tags = tagsFromPosts(posts)
  const tag = tags.find((item) => item.slug === slug)

  if (!tag) notFound()

  const filtered = postsWithTag(posts, tag.slug)

  return (
    <>
      <JsonLd data={subjectPageGraph(tag, filtered)} />
      <PageView
        event="opened-subject-page"
        properties={{ subject: tag.name, slug: tag.slug }}
      />
      <PostList
        posts={filtered}
        title={tag.name}
        subtitle={postCountLabel(filtered.length)}
        description={tag.description}
        breadcrumbs={[
          { name: 'Início', href: '/' },
          { name: 'Posts', href: '/posts' },
          { name: tag.name, href: tagPath(tag.slug) },
        ]}
        tags={tags}
        activeSlug={tag.slug}
        total={posts.length}
        emptyLabel="Nenhum post neste assunto."
      />
    </>
  )
}
