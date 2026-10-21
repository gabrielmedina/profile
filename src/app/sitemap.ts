import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/features/posts/posts'
import { site } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  return [
    {
      url: site.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${site.url}/posts`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/posts/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
