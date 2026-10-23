import { site } from './site'
import { absoluteUrl } from './url'

export const personId = `${site.url}/#person`
export const websiteId = `${site.url}/#website`

type Crumb = {
  name: string
  path: string
}

type PostListItem = {
  title: string
  slug: string
}

type ArticleData = {
  title: string
  description: string
  slug: string
  date: string
  updated?: string
  lang: string
  keywords: string[]
  wordCount: number
  image?: string
  imageWidth?: number
  imageHeight?: number
}

export function websiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(), personNode()],
  }
}

export function profilePageGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${site.url}/#profile`,
    url: site.url,
    name: site.title,
    description: site.description,
    inLanguage: site.language,
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
    mainEntity: { '@id': personId },
  }
}

export function postsPageGraph(posts: PostListItem[]) {
  const url = absoluteUrl('/posts')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: `${site.posts.title} - ${site.name}`,
        description: site.posts.description,
        inLanguage: site.language,
        isPartOf: { '@id': websiteId },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: absoluteUrl(`/posts/${post.slug}`),
          })),
        },
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: 'Posts', path: '/posts' },
      ]),
    ],
  }
}

export function postPageGraph(post: ArticleData) {
  const url = absoluteUrl(`/posts/${post.slug}`)
  const image = absoluteUrl(post.image ?? site.image.url)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: post.title,
        description: post.description,
        image: {
          '@type': 'ImageObject',
          url: image,
          ...(post.imageWidth ? { width: post.imageWidth } : {}),
          ...(post.imageHeight ? { height: post.imageHeight } : {}),
        },
        datePublished: `${post.date}T00:00:00.000Z`,
        dateModified: `${post.updated ?? post.date}T00:00:00.000Z`,
        inLanguage: post.lang,
        author: authorNode(),
        publisher: authorNode(),
        keywords: post.keywords.join(', '),
        articleSection: post.keywords[0],
        wordCount: post.wordCount,
        isAccessibleForFree: true,
      },
      breadcrumbList([
        { name: 'Início', path: '/' },
        { name: 'Posts', path: '/posts' },
        { name: post.title, path: `/posts/${post.slug}` },
      ]),
    ],
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.language,
    publisher: { '@id': personId },
  }
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
    image: site.avatarUrl,
    jobTitle: site.jobTitle,
    description: site.description,
    sameAs: [...site.sameAs],
    knowsAbout: [...site.knowsAbout],
    knowsLanguage: site.language,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
  }
}

function authorNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    url: site.url,
  }
}

function breadcrumbList(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
