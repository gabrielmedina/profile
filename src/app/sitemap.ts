import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/config/absolute-url'
import { site } from '@/config/site'
import { consulting, offerPath } from '@/features/consulting/content'
import { getAllPosts } from '@/features/posts/services/posts'
import { tagPath, tagsFromPosts } from '@/features/posts/utils/tags'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const tags = tagsFromPosts(posts)
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
    {
      url: absoluteUrl(site.consulting.path),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...consulting.offers.map((offer) => ({
      url: absoluteUrl(offerPath(offer.slug)),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: absoluteUrl(tagPath(tag.slug)),
      lastModified: tag.latest,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
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
