import { getAllPosts } from '@/features/posts/services/posts'
import { site } from '@/lib/site'
import { absoluteUrl } from '@/lib/url'
import { rfc822Date } from '@/lib/rfc822'

export async function GET() {
  const posts = await getAllPosts()
  const latest = posts[0]?.date

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/posts/${post.slug}`)
      const categories = post.keywords
        .map((key) => `<category>${escapeXml(key)}</category>`)
        .join('')

      return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822Date(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      ${categories}
    </item>`
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.posts.description)}</description>
    <language>${site.language}</language>
    <atom:link href="${absoluteUrl(site.feedPath)}" rel="self" type="application/rss+xml"/>
    ${latest ? `<lastBuildDate>${rfc822Date(latest)}</lastBuildDate>` : ''}
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
