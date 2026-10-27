import type { Metadata } from 'next'
import { PageView } from '@/components/analytics/page-view'
import { JsonLd } from '@/components/seo/json-ld'
import { site } from '@/config/site'
import { TagIndex } from '@/features/posts/components/tag-index/tag-index'
import { getAllPosts } from '@/features/posts/services/posts'
import { tagsFromPosts } from '@/features/posts/utils/tags'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { subjectsPageGraph } from '@/lib/seo/schema-graph'

export async function generateMetadata(): Promise<Metadata> {
  const tags = tagsFromPosts(await getAllPosts())

  return pageMetadata({
    title: site.subjects.title,
    description: site.subjects.description,
    path: site.subjects.path,
    keywords: tags.map((tag) => tag.name),
  })
}

export default async function SubjectsPage() {
  const tags = tagsFromPosts(await getAllPosts())

  return (
    <>
      <JsonLd data={subjectsPageGraph(tags)} />
      <PageView event="opened-subjects-page" />
      <TagIndex tags={tags} />
    </>
  )
}
