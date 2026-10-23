import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/features/posts/services/posts'
import { site } from '@/lib/site'
import { absoluteUrl } from '@/lib/url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const latest = posts[0]?.date

  return [
    {
      url: site.url,
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/posts'),
      lastModified: latest,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.date,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
      ...(post.contentImages.length > 0
        ? { images: post.contentImages.map((src) => absoluteUrl(src)) }
        : {}),
    })),
  ]
}
